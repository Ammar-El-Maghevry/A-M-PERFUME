package com.amperfume.api.dto.response;

import com.amperfume.api.entity.CartItem;

import java.math.BigDecimal;

public record CartItemResponse(
        Long productId,
        String slug,
        String sku,
        String nameFr,
        String nameAr,
        String nameEn,
        BigDecimal price,
        Integer quantity,
        BigDecimal lineTotal,
        Integer stock,
        String hue,
        String size,
        String concentration
) {
    public static CartItemResponse from(CartItem c) {
        var p = c.getProduct();
        BigDecimal line = p.getPrice().multiply(BigDecimal.valueOf(c.getQuantity()));
        return new CartItemResponse(
                p.getId(), p.getSlug(), p.getSku(),
                p.getNameFr(), p.getNameAr(), p.getNameEn(),
                p.getPrice(), c.getQuantity(), line,
                p.getStock(), p.getHue(), p.getSize(), p.getConcentration()
        );
    }
}
