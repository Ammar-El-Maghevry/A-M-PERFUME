package com.amperfume.api.dto.response;

import com.amperfume.api.entity.Category;

public record CategoryResponse(
        Long id,
        String slug,
        String nameFr,
        String nameAr,
        String nameEn,
        Integer position,
        boolean active
) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(
                c.getId(), c.getSlug(), c.getNameFr(), c.getNameAr(), c.getNameEn(),
                c.getPosition(), c.isActive()
        );
    }
}
