package com.amperfume.api.controller;

import com.amperfume.api.dto.request.CartItemQuantityRequest;
import com.amperfume.api.dto.request.CartItemRequest;
import com.amperfume.api.dto.response.CartResponse;
import com.amperfume.api.security.SecurityUtils;
import com.amperfume.api.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart(SecurityUtils.currentUserId());
    }

    @PostMapping("/items")
    public CartResponse addItem(@Valid @RequestBody CartItemRequest req) {
        return cartService.addItem(SecurityUtils.currentUserId(), req);
    }

    @PutMapping("/items/{productId}")
    public CartResponse updateQty(@PathVariable Long productId,
                                  @Valid @RequestBody CartItemQuantityRequest req) {
        return cartService.updateQuantity(SecurityUtils.currentUserId(), productId, req);
    }

    @DeleteMapping("/items/{productId}")
    public CartResponse remove(@PathVariable Long productId) {
        return cartService.removeItem(SecurityUtils.currentUserId(), productId);
    }

    @DeleteMapping
    public ResponseEntity<Void> clear() {
        cartService.clear(SecurityUtils.currentUserId());
        return ResponseEntity.noContent().build();
    }
}
