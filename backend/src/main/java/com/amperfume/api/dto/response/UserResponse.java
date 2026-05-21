package com.amperfume.api.dto.response;

import com.amperfume.api.entity.User;
import com.amperfume.api.enums.Role;

import java.time.Instant;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        Role role,
        boolean active,
        Instant createdAt
) {
    public static UserResponse from(User u) {
        return new UserResponse(
                u.getId(), u.getFullName(), u.getEmail(), u.getPhone(),
                u.getRole(), u.isActive(), u.getCreatedAt()
        );
    }
}
