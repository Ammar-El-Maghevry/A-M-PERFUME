package com.amperfume.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank @Size(max = 64) String slug,
        @NotBlank @Size(max = 128) String nameFr,
        @NotBlank @Size(max = 128) String nameAr,
        @NotBlank @Size(max = 128) String nameEn,
        Integer position,
        Boolean active
) {}
