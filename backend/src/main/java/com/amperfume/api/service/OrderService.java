package com.amperfume.api.service;

import com.amperfume.api.dto.request.AddressRequest;
import com.amperfume.api.dto.request.CreateOrderRequest;
import com.amperfume.api.dto.request.RejectOrderRequest;
import com.amperfume.api.dto.request.UpdateOrderStatusRequest;
import com.amperfume.api.dto.response.FileUploadResponse;
import com.amperfume.api.dto.response.OrderResponse;
import com.amperfume.api.dto.response.PageResponse;
import com.amperfume.api.entity.*;
import com.amperfume.api.enums.OrderStatus;
import com.amperfume.api.exception.BadRequestException;
import com.amperfume.api.exception.NotFoundException;
import com.amperfume.api.repository.*;
import com.amperfume.api.security.SecurityUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest req) {
        var principal = SecurityUtils.currentUser().orElse(null);
        User user = principal == null ? null
                : userRepository.findById(principal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<OrderLine> lines = resolveLines(user, req);
        if (lines.isEmpty()) throw new BadRequestException("Order must contain at least one item");

        BigDecimal subtotal = lines.stream()
                .map(l -> l.product.getPrice().multiply(BigDecimal.valueOf(l.quantity)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Address address = resolveAddress(user, req);

        String customerName = pickCustomerName(user, req, address);
        String customerPhone = pickCustomerPhone(user, req, address);
        String customerEmail = pickCustomerEmail(user, req);
        if (customerName == null || customerName.isBlank())
            throw new BadRequestException("Customer name is required");
        if (customerPhone == null || customerPhone.isBlank())
            throw new BadRequestException("Customer phone is required");

        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .customerName(customerName)
                .customerPhone(customerPhone)
                .customerEmail(customerEmail)
                .guest(user == null)
                .city(address.getCity())
                .neighborhood(address.getNeighborhood())
                .details(address.getDetails())
                .lat(address.getLat())
                .lng(address.getLng())
                .addressSnapshot(snapshotAddress(address))
                .paymentMethod(req.paymentMethod())
                .status(OrderStatus.PENDING_VERIFICATION)
                .subtotal(subtotal)
                .shipping(BigDecimal.ZERO)
                .total(subtotal)
                .proofNote(req.proofNote())
                .build();

        for (OrderLine line : lines) {
            Product p = line.product;
            BigDecimal lineTotal = p.getPrice().multiply(BigDecimal.valueOf(line.quantity));
            order.getItems().add(OrderItem.builder()
                    .order(order)
                    .product(p)
                    .productName(p.getNameFr())
                    .productSku(p.getSku())
                    .size(p.getSize())
                    .concentration(p.getConcentration())
                    .unitPrice(p.getPrice())
                    .quantity(line.quantity)
                    .lineTotal(lineTotal)
                    .build());
            p.setStock(p.getStock() - line.quantity);
            productRepository.save(p);
        }

        order.getHistory().add(OrderStatusHistory.builder()
                .order(order)
                .status(OrderStatus.PENDING_VERIFICATION)
                .changedBy(user == null ? "guest" : user.getEmail())
                .build());

        Order saved = orderRepository.save(order);

        if (user != null) cartItemRepository.deleteByUserId(user.getId());

        try { notificationService.notifyAdminsNewOrder(saved); } catch (Exception ex) {
            log.warn("Failed to notify admins for order {}: {}", saved.getOrderNumber(), ex.getMessage());
        }
        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse uploadProof(Long orderId, MultipartFile file) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
        FileUploadResponse uploaded = fileStorageService.upload(file, "proofs");
        if (order.getProofPublicId() != null) {
            fileStorageService.delete(order.getProofPublicId());
        }
        order.setProofUrl(uploaded.url());
        order.setProofPublicId(uploaded.publicId());
        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> myOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50));
        Page<Order> result = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PageResponse.from(result, OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public OrderResponse myOrder(Long userId, Long id) {
        Order o = orderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        return OrderResponse.from(o);
    }

    @Transactional
    public OrderResponse cancelMyOrder(Long userId, Long id) {
        Order o = orderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        if (o.getStatus() != OrderStatus.PENDING_VERIFICATION) {
            throw new BadRequestException("Only pending orders can be cancelled");
        }
        restoreStock(o);
        applyStatus(o, OrderStatus.CANCELLED, null, "user");
        return OrderResponse.from(orderRepository.save(o));
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> adminList(OrderStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> result = (status == null)
                ? orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                : orderRepository.findByStatus(status, pageable);
        return PageResponse.from(result, OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public OrderResponse adminGet(Long id) {
        return OrderResponse.from(orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id)));
    }

    @Transactional
    public OrderResponse adminConfirm(Long id) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
        if (o.getStatus() != OrderStatus.PENDING_VERIFICATION) {
            throw new BadRequestException("Order cannot be confirmed from status " + o.getStatus());
        }
        applyStatus(o, OrderStatus.CONFIRMED, "Payment confirmed", "admin");
        Order saved = orderRepository.save(o);
        notificationService.notifyOrderUpdate(saved);
        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse adminReject(Long id, RejectOrderRequest req) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
        if (o.getStatus() != OrderStatus.PENDING_VERIFICATION) {
            throw new BadRequestException("Order cannot be rejected from status " + o.getStatus());
        }
        restoreStock(o);
        o.setRejectionReason(req.reason());
        applyStatus(o, OrderStatus.REJECTED, req.reason(), "admin");
        Order saved = orderRepository.save(o);
        notificationService.notifyOrderUpdate(saved);
        return OrderResponse.from(saved);
    }

    @Transactional
    public OrderResponse adminUpdateStatus(Long id, UpdateOrderStatusRequest req) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
        if (req.status() == OrderStatus.REJECTED || req.status() == OrderStatus.CANCELLED) {
            restoreStock(o);
        }
        applyStatus(o, req.status(), req.note(), "admin");
        Order saved = orderRepository.save(o);
        notificationService.notifyOrderUpdate(saved);
        return OrderResponse.from(saved);
    }

    public String generateOrderNumber() {
        int year = LocalDate.now().getYear();
        long count = orderRepository.countByYear(String.valueOf(year)) + 1;
        return String.format("AM-%d-%04d", year, count);
    }

    private void applyStatus(Order o, OrderStatus status, String note, String changedBy) {
        o.setStatus(status);
        o.getHistory().add(OrderStatusHistory.builder()
                .order(o).status(status).note(note).changedBy(changedBy).build());
    }

    private void restoreStock(Order o) {
        for (OrderItem item : o.getItems()) {
            if (item.getProduct() == null) continue;
            Product p = item.getProduct();
            p.setStock(p.getStock() + item.getQuantity());
            productRepository.save(p);
        }
    }

    private List<OrderLine> resolveLines(User user, CreateOrderRequest req) {
        if (user != null && (req.items() == null || req.items().isEmpty())) {
            return cartItemRepository.findByUserIdWithProduct(user.getId()).stream()
                    .map(ci -> {
                        ensureCanFulfill(ci.getProduct(), ci.getQuantity());
                        return new OrderLine(ci.getProduct(), ci.getQuantity());
                    })
                    .toList();
        }
        if (req.items() == null || req.items().isEmpty()) {
            throw new BadRequestException("Order items are required");
        }
        // Coalesce duplicates by productId
        Map<Long, Integer> merged = new HashMap<>();
        for (var it : req.items()) merged.merge(it.productId(), it.quantity(), Integer::sum);
        List<OrderLine> lines = new ArrayList<>();
        for (Map.Entry<Long, Integer> e : merged.entrySet()) {
            Product p = productRepository.findById(e.getKey())
                    .orElseThrow(() -> new NotFoundException("Product not found: " + e.getKey()));
            ensureCanFulfill(p, e.getValue());
            lines.add(new OrderLine(p, e.getValue()));
        }
        return lines;
    }

    private void ensureCanFulfill(Product p, int qty) {
        if (!p.isActive()) throw new BadRequestException("Product unavailable: " + p.getSku());
        if (p.getStock() < qty) {
            throw new BadRequestException("Insufficient stock for " + p.getNameFr()
                    + " (have " + p.getStock() + ", need " + qty + ")");
        }
    }

    private Address resolveAddress(User user, CreateOrderRequest req) {
        if (req.addressId() != null) {
            if (user == null) throw new BadRequestException("Guests cannot reference a saved address");
            return addressRepository.findByIdAndUserId(req.addressId(), user.getId())
                    .orElseThrow(() -> new NotFoundException("Address not found"));
        }
        AddressRequest na = req.newAddress();
        if (na == null) throw new BadRequestException("Address is required");
        return Address.builder()
                .label(na.label())
                .fullName(na.fullName())
                .phone(na.phone())
                .city(na.city())
                .neighborhood(na.neighborhood())
                .details(na.details())
                .lat(na.lat())
                .lng(na.lng())
                .build();
    }

    private String pickCustomerName(User user, CreateOrderRequest req, Address addr) {
        if (req.guestName() != null && !req.guestName().isBlank()) return req.guestName().trim();
        if (addr != null && addr.getFullName() != null) return addr.getFullName();
        return user == null ? null : user.getFullName();
    }

    private String pickCustomerPhone(User user, CreateOrderRequest req, Address addr) {
        if (req.guestPhone() != null && !req.guestPhone().isBlank()) return req.guestPhone().trim();
        if (addr != null && addr.getPhone() != null) return addr.getPhone();
        return user == null ? null : user.getPhone();
    }

    private String pickCustomerEmail(User user, CreateOrderRequest req) {
        if (req.guestEmail() != null && !req.guestEmail().isBlank()) return req.guestEmail().trim();
        return user == null ? null : user.getEmail();
    }

    private String snapshotAddress(Address address) {
        try {
            Map<String, Object> snap = new HashMap<>();
            snap.put("label", address.getLabel());
            snap.put("fullName", address.getFullName());
            snap.put("phone", address.getPhone());
            snap.put("city", address.getCity());
            snap.put("neighborhood", address.getNeighborhood());
            snap.put("details", address.getDetails());
            snap.put("lat", address.getLat());
            snap.put("lng", address.getLng());
            return objectMapper.writeValueAsString(snap);
        } catch (Exception ex) {
            log.warn("Failed to serialise address snapshot: {}", ex.getMessage());
            return null;
        }
    }

    private record OrderLine(Product product, int quantity) {}
}
