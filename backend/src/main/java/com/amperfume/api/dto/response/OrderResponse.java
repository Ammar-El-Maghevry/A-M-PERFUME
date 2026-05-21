package com.amperfume.api.dto.response;

import com.amperfume.api.entity.Order;
import com.amperfume.api.enums.OrderStatus;
import com.amperfume.api.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        Long userId,
        String customerName,
        String customerPhone,
        String customerEmail,
        boolean guest,
        String city,
        String neighborhood,
        String details,
        BigDecimal lat,
        BigDecimal lng,
        PaymentMethod paymentMethod,
        OrderStatus status,
        BigDecimal subtotal,
        BigDecimal shipping,
        BigDecimal total,
        String proofUrl,
        String proofNote,
        String rejectionReason,
        List<OrderItemResponse> items,
        List<OrderStatusHistoryResponse> history,
        Instant createdAt,
        Instant updatedAt
) {
    public static OrderResponse from(Order o) {
        return new OrderResponse(
                o.getId(), o.getOrderNumber(),
                o.getUser() == null ? null : o.getUser().getId(),
                o.getCustomerName(), o.getCustomerPhone(), o.getCustomerEmail(),
                o.isGuest(),
                o.getCity(), o.getNeighborhood(), o.getDetails(), o.getLat(), o.getLng(),
                o.getPaymentMethod(), o.getStatus(),
                o.getSubtotal(), o.getShipping(), o.getTotal(),
                o.getProofUrl(), o.getProofNote(), o.getRejectionReason(),
                o.getItems().stream().map(OrderItemResponse::from).toList(),
                o.getHistory().stream().map(OrderStatusHistoryResponse::from).toList(),
                o.getCreatedAt(), o.getUpdatedAt()
        );
    }
}
