package com.amperfume.api.dto.response;

import com.amperfume.api.entity.OrderItem;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        String productSku,
        String size,
        String concentration,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal lineTotal
) {
    public static OrderItemResponse from(OrderItem oi) {
        return new OrderItemResponse(
                oi.getId(),
                oi.getProduct() == null ? null : oi.getProduct().getId(),
                oi.getProductName(),
                oi.getProductSku(),
                oi.getSize(),
                oi.getConcentration(),
                oi.getUnitPrice(),
                oi.getQuantity(),
                oi.getLineTotal()
        );
    }
}
