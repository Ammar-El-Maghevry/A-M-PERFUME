package com.amperfume.api.dto.response;

import com.amperfume.api.entity.Notification;
import com.amperfume.api.enums.NotificationType;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        NotificationType type,
        String title,
        String message,
        Long relatedId,
        boolean read,
        Instant createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getType(), n.getTitle(), n.getMessage(),
                n.getRelatedId(), n.isRead(), n.getCreatedAt()
        );
    }
}
