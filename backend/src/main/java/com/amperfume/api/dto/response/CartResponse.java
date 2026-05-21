package com.amperfume.api.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        BigDecimal subtotal,
        int totalItems,
        int totalQuantity
) {}
