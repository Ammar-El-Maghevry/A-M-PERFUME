package com.amperfume.api.controller;

import com.amperfume.api.dto.response.NotificationResponse;
import com.amperfume.api.dto.response.PageResponse;
import com.amperfume.api.security.SecurityUtils;
import com.amperfume.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public PageResponse<NotificationResponse> list(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        return notificationService.list(SecurityUtils.currentUserId(), page, size);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unread() {
        return Map.of("count", notificationService.unreadCount(SecurityUtils.currentUserId()));
    }

    @PutMapping("/{id}/read")
    public NotificationResponse markRead(@PathVariable Long id) {
        return notificationService.markRead(SecurityUtils.currentUserId(), id);
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Integer>> markAllRead() {
        int updated = notificationService.markAllRead(SecurityUtils.currentUserId());
        return ResponseEntity.ok(Map.of("updated", updated));
    }
}
