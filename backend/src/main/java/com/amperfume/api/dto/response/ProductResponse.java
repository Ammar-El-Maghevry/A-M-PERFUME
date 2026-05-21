package com.amperfume.api.dto.response;

import com.amperfume.api.entity.Product;

import java.math.BigDecimal;
import java.util.List;

public record ProductResponse(
        Long id,
        String slug,
        String sku,
        Long categoryId,
        String categorySlug,
        String nameFr,
        String nameAr,
        String nameEn,
        String tagline,
        String description,
        String family,
        BigDecimal price,
        Integer stock,
        String concentration,
        String size,
        String longevity,
        String sillage,
        List<String> seasons,
        List<String> occasions,
        List<String> topNotes,
        List<String> heartNotes,
        List<String> baseNotes,
        String hue,
        String accent,
        boolean limitedEdition,
        boolean active,
        List<ProductImageResponse> images
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(), p.getSlug(), p.getSku(),
                p.getCategory() == null ? null : p.getCategory().getId(),
                p.getCategory() == null ? null : p.getCategory().getSlug(),
                p.getNameFr(), p.getNameAr(), p.getNameEn(),
                p.getTagline(), p.getDescription(), p.getFamily(),
                p.getPrice(), p.getStock(),
                p.getConcentration(), p.getSize(), p.getLongevity(), p.getSillage(),
                splitCsv(p.getSeasons()), splitCsv(p.getOccasions()),
                splitCsv(p.getTopNotes()), splitCsv(p.getHeartNotes()), splitCsv(p.getBaseNotes()),
                p.getHue(), p.getAccent(), p.isLimitedEdition(), p.isActive(),
                p.getImages() == null ? List.of() :
                        p.getImages().stream().map(ProductImageResponse::from).toList()
        );
    }

    private static List<String> splitCsv(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        return List.of(csv.split("\\s*,\\s*"));
    }
}
