package com.amperfume.api.service;

import com.amperfume.api.dto.request.LoginRequest;
import com.amperfume.api.dto.request.RefreshTokenRequest;
import com.amperfume.api.dto.request.RegisterRequest;
import com.amperfume.api.dto.response.AuthResponse;
import com.amperfume.api.dto.response.UserResponse;
import com.amperfume.api.entity.User;
import com.amperfume.api.enums.Role;
import com.amperfume.api.exception.ConflictException;
import com.amperfume.api.exception.UnauthorizedException;
import com.amperfume.api.repository.UserRepository;
import com.amperfume.api.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new ConflictException("Email is already registered");
        }
        User user = User.builder()
                .fullName(req.fullName().trim())
                .email(req.email().trim().toLowerCase())
                .phone(req.phone() == null ? null : req.phone().trim())
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(Role.USER)
                .active(true)
                .build();
        user = userRepository.save(user);
        return issue(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        if (!user.isActive()) throw new UnauthorizedException("Account is disabled");
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        return issue(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(RefreshTokenRequest req) {
        Claims claims = jwtService.parse(req.refreshToken());
        if (!jwtService.isRefreshToken(claims)) {
            throw new UnauthorizedException("Not a refresh token");
        }
        User user = userRepository.findById(jwtService.subjectId(claims))
                .orElseThrow(() -> new UnauthorizedException("User no longer exists"));
        if (!user.isActive()) throw new UnauthorizedException("Account is disabled");
        return issue(user);
    }

    private AuthResponse issue(User u) {
        String access = jwtService.generateAccessToken(u.getId(), u.getEmail(), u.getRole());
        String refresh = jwtService.generateRefreshToken(u.getId(), u.getEmail());
        long expires = (long) jwtService.meta().get("accessTokenExpiresIn");
        return new AuthResponse(access, refresh, "Bearer", expires, UserResponse.from(u));
    }
}
