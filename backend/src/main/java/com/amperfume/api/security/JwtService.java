package com.amperfume.api.security;

import com.amperfume.api.config.AppProperties;
import com.amperfume.api.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private static final String CLAIM_TYPE = "typ";
    private static final String CLAIM_ROLE = "role";
    private static final String ACCESS = "access";
    private static final String REFRESH = "refresh";

    private final SecretKey signingKey;
    private final Duration accessTtl;
    private final Duration refreshTtl;

    public JwtService(AppProperties props) {
        String secret = props.getJwt().getSecret();
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters");
        }
        byte[] keyBytes = looksLikeBase64(secret)
                ? Decoders.BASE64.decode(secret)
                : secret.getBytes(StandardCharsets.UTF_8);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.accessTtl = Duration.ofMinutes(props.getJwt().getAccessTokenTtlMinutes());
        this.refreshTtl = Duration.ofDays(props.getJwt().getRefreshTokenTtlDays());
    }

    private static boolean looksLikeBase64(String s) {
        return s.matches("^[A-Za-z0-9+/=]+$") && s.length() % 4 == 0 && s.length() >= 44;
    }

    public String generateAccessToken(Long userId, String email, Role role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim(CLAIM_ROLE, role.name())
                .claim(CLAIM_TYPE, ACCESS)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessTtl)))
                .signWith(signingKey)
                .compact();
    }

    public String generateRefreshToken(Long userId, String email) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim(CLAIM_TYPE, REFRESH)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(refreshTtl)))
                .signWith(signingKey)
                .compact();
    }

    public Claims parse(String token) {
        try {
            return Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload();
        } catch (JwtException ex) {
            throw new JwtException("Invalid or expired token", ex);
        }
    }

    public boolean isAccessToken(Claims claims) {
        return ACCESS.equals(claims.get(CLAIM_TYPE, String.class));
    }

    public boolean isRefreshToken(Claims claims) {
        return REFRESH.equals(claims.get(CLAIM_TYPE, String.class));
    }

    public Long subjectId(Claims claims) {
        return Long.valueOf(claims.getSubject());
    }

    public Map<String, Object> meta() {
        return Map.of(
                "accessTokenExpiresIn", accessTtl.toSeconds(),
                "refreshTokenExpiresIn", refreshTtl.toSeconds()
        );
    }
}
