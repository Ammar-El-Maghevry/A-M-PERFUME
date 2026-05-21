package com.amperfume.api.dto.response;

import com.amperfume.api.entity.OrderStatusHistory;
import com.amperfume.api.enums.OrderStatus;

import java.time.Instant;

public record OrderStatusHistoryResponse(
        Long id,
        OrderStatus status,
        String note,
        String changedBy,
        Instant at
) {
    public static OrderStatusHistoryResponse from(OrderStatusHistory h) {
        return new OrderStatusHistoryResponse(
                h.getId(), h.getStatus(), h.getNote(), h.getChangedBy(), h.getCreatedAt()
        );
    }
}
