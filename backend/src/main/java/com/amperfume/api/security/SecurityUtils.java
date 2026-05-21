package com.amperfume.api.security;

import com.amperfume.api.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static Optional<UserPrincipal> currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal up)) {
            return Optional.empty();
        }
        return Optional.of(up);
    }

    public static UserPrincipal requireUser() {
        return currentUser().orElseThrow(() -> new UnauthorizedException("Authentication required"));
    }

    public static Long currentUserId() {
        return requireUser().getId();
    }
}
