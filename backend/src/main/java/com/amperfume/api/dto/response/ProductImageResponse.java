package com.amperfume.api.dto.response;

import com.amperfume.api.entity.ProductImage;

public record ProductImageResponse(
        Long id,
        String url,
        String publicId,
        String alt,
        Integer position
) {
    public static ProductImageResponse from(ProductImage img) {
        return new ProductImageResponse(
                img.getId(), img.getUrl(), img.getPublicId(), img.getAlt(), img.getPosition()
        );
    }
}
