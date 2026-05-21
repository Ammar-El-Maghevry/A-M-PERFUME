package com.amperfume.api.controller;

import com.amperfume.api.dto.response.WishlistResponse;
import com.amperfume.api.security.SecurityUtils;
import com.amperfume.api.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public WishlistResponse list() {
        return wishlistService.list(SecurityUtils.currentUserId());
    }

    @GetMapping("/ids")
    public List<Long> ids() {
        return wishlistService.ids(SecurityUtils.currentUserId());
    }

    @PostMapping("/{productId}")
    public WishlistResponse add(@PathVariable Long productId) {
        return wishlistService.add(SecurityUtils.currentUserId(), productId);
    }

    @DeleteMapping("/{productId}")
    public WishlistResponse remove(@PathVariable Long productId) {
        return wishlistService.remove(SecurityUtils.currentUserId(), productId);
    }
}
