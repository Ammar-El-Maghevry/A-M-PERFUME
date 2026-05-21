package com.amperfume.api.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        String slug,
        @NotBlank @Size(max = 32) String sku,
        @NotNull Long categoryId,
        @NotBlank @Size(max = 191) String nameFr,
        @NotBlank @Size(max = 191) String nameAr,
        @NotBlank @Size(max = 191) String nameEn,
        @Size(max = 255) String tagline,
        String description,
        @Size(max = 64) String family,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal price,
        @NotNull @Min(0) Integer stock,
        @Size(max = 64) String concentration,
        @Size(max = 32) String size,
        @Size(max = 64) String longevity,
        @Size(max = 64) String sillage,
        List<String> seasons,
        List<String> occasions,
        List<String> topNotes,
        List<String> heartNotes,
        List<String> baseNotes,
        @Size(max = 32) String hue,
        @Size(max = 16) String accent,
        Boolean limitedEdition,
        Boolean active
) {}
