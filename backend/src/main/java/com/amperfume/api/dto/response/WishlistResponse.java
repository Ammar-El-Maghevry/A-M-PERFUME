package com.amperfume.api.dto.response;

import java.util.List;

public record WishlistResponse(
        List<ProductResponse> products,
        int count
) {}
