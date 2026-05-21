package com.amperfume.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {
    private String baseUrl;
    private Cors cors = new Cors();
    private Jwt jwt = new Jwt();
    private Cloudinary cloudinary = new Cloudinary();

    @Getter @Setter public static class Cors {
        private List<String> allowedOrigins = List.of();
        private List<String> allowedOriginPatterns = List.of();
    }

    @Getter @Setter public static class Jwt {
        private String secret;
        private long accessTokenTtlMinutes = 15;
        private long refreshTokenTtlDays = 7;
    }

    @Getter @Setter public static class Cloudinary {
        private String cloudName;
        private String apiKey;
        private String apiSecret;
        private String folder = "amperfume";
    }
}
