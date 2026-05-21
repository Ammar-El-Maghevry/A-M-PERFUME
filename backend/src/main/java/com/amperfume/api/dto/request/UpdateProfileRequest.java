package com.amperfume.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank @Size(max = 128) String fullName,
        @Size(max = 32) String phone
) {}
