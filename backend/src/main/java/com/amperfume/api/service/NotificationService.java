package com.amperfume.api.service;

import com.amperfume.api.dto.response.NotificationResponse;
import com.amperfume.api.dto.response.PageResponse;
import com.amperfume.api.entity.Notification;
import com.amperfume.api.entity.Order;
import com.amperfume.api.entity.User;
import com.amperfume.api.enums.NotificationType;
import com.amperfume.api.enums.OrderStatus;
import com.amperfume.api.enums.Role;
import com.amperfume.api.exception.NotFoundException;
import com.amperfume.api.repository.NotificationRepository;
import com.amperfume.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public Notification createForUser(Long userId, String title, String message,
                                      NotificationType type, Long relatedId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));
        Notification n = Notification.builder()
                .user(u).type(type).title(title).message(message).relatedId(relatedId)
                .build();
        return notificationRepository.save(n);
    }

    @Transactional
    public void notifyOrderUpdate(Order order) {
        if (order.getUser() == null) return;
        String title = switch (order.getStatus()) {
            case PENDING_VERIFICATION -> "Commande " + order.getOrderNumber() + " reçue";
            case CONFIRMED -> "Commande " + order.getOrderNumber() + " confirmée";
            case PREPARING -> "Commande " + order.getOrderNumber() + " en préparation";
            case SHIPPED -> "Commande " + order.getOrderNumber() + " expédiée";
            case DELIVERED -> "Commande " + order.getOrderNumber() + " livrée";
            case REJECTED -> "Commande " + order.getOrderNumber() + " refusée";
            case CANCELLED -> "Commande " + order.getOrderNumber() + " annulée";
        };
        String body = order.getStatus() == OrderStatus.REJECTED && order.getRejectionReason() != null
                ? "Motif : " + order.getRejectionReason()
                : "Statut mis à jour.";
        createForUser(order.getUser().getId(), title, body, NotificationType.ORDER_UPDATE, order.getId());
    }

    @Transactional
    public void broadcast(String title, String message) {
        List<User> admins = userRepository.findByRole(Role.ADMIN, Pageable.unpaged()).getContent();
        for (User a : admins) {
            notificationRepository.save(Notification.builder()
                    .user(a)
                    .type(NotificationType.SYSTEM)
                    .title(title)
                    .message(message)
                    .build());
        }
    }

    @Transactional
    public void notifyAdminsNewOrder(Order order) {
        broadcast("Nouvelle commande " + order.getOrderNumber(),
                order.getCustomerName() + " · " + order.getTotal() + " MRU");
    }

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> list(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> result = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PageResponse.from(result, NotificationResponse::from);
    }

    @Transactional(readOnly = true)
    public long unreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public NotificationResponse markRead(Long userId, Long id) {
        Notification n = notificationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));
        n.setRead(true);
        return NotificationResponse.from(notificationRepository.save(n));
    }

    @Transactional
    public int markAllRead(Long userId) {
        return notificationRepository.markAllRead(userId);
    }
}
