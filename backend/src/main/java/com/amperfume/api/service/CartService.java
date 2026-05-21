package com.amperfume.api.service;

import com.amperfume.api.dto.request.CartItemQuantityRequest;
import com.amperfume.api.dto.request.CartItemRequest;
import com.amperfume.api.dto.response.CartItemResponse;
import com.amperfume.api.dto.response.CartResponse;
import com.amperfume.api.entity.CartItem;
import com.amperfume.api.entity.Product;
import com.amperfume.api.entity.User;
import com.amperfume.api.exception.BadRequestException;
import com.amperfume.api.exception.NotFoundException;
import com.amperfume.api.repository.CartItemRepository;
import com.amperfume.api.repository.ProductRepository;
import com.amperfume.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        return toResponse(cartItemRepository.findByUserIdWithProduct(userId));
    }

    @Transactional
    public CartResponse addItem(Long userId, CartItemRequest req) {
        Product product = activeProduct(req.productId());
        CartItem existing = cartItemRepository.findByUserIdAndProductId(userId, req.productId()).orElse(null);
        int desired = (existing == null ? 0 : existing.getQuantity()) + req.quantity();
        ensureStock(product, desired);
        if (existing == null) {
            User u = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found: " + userId));
            cartItemRepository.save(CartItem.builder()
                    .user(u).product(product).quantity(req.quantity()).build());
        } else {
            existing.setQuantity(desired);
            cartItemRepository.save(existing);
        }
        return getCart(userId);
    }

    @Transactional
    public CartResponse updateQuantity(Long userId, Long productId, CartItemQuantityRequest req) {
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new NotFoundException("Cart item not found"));
        ensureStock(item.getProduct(), req.quantity());
        item.setQuantity(req.quantity());
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long productId) {
        cartItemRepository.deleteByUserIdAndProductId(userId, productId);
        return getCart(userId);
    }

    @Transactional
    public void clear(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private Product activeProduct(Long productId) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));
        if (!p.isActive()) throw new BadRequestException("Product is unavailable");
        return p;
    }

    private void ensureStock(Product product, int requested) {
        if (requested > product.getStock()) {
            throw new BadRequestException("Only " + product.getStock() + " unit(s) of " + product.getNameFr() + " in stock");
        }
    }

    private CartResponse toResponse(List<CartItem> items) {
        List<CartItemResponse> mapped = items.stream().map(CartItemResponse::from).toList();
        BigDecimal subtotal = mapped.stream().map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalQty = mapped.stream().mapToInt(CartItemResponse::quantity).sum();
        return new CartResponse(mapped, subtotal, mapped.size(), totalQty);
    }
}
