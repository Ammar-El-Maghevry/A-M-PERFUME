package com.amperfume.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 128) String fullName,
        @NotBlank @Email @Size(max = 191) String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        @Size(max = 32) String phone
) {}
