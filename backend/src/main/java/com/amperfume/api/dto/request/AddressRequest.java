package com.amperfume.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record AddressRequest(
        @Size(max = 64) String label,
        @NotBlank @Size(max = 128) String fullName,
        @NotBlank @Size(max = 32) String phone,
        @NotBlank @Size(max = 64) String city,
        @NotBlank @Size(max = 128) String neighborhood,
        String details,
        BigDecimal lat,
        BigDecimal lng,
        Boolean isDefault
) {}
