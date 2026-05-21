package com.amperfume.api.service;

import com.amperfume.api.dto.response.ProductResponse;
import com.amperfume.api.dto.response.WishlistResponse;
import com.amperfume.api.entity.Product;
import com.amperfume.api.entity.User;
import com.amperfume.api.entity.WishlistItem;
import com.amperfume.api.exception.NotFoundException;
import com.amperfume.api.repository.ProductRepository;
import com.amperfume.api.repository.UserRepository;
import com.amperfume.api.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public WishlistResponse list(Long userId) {
        List<WishlistItem> items = wishlistRepository.findByUserIdWithProduct(userId);
        List<ProductResponse> mapped = items.stream()
                .map(WishlistItem::getProduct)
                .filter(Product::isActive)
                .map(ProductResponse::from)
                .toList();
        return new WishlistResponse(mapped, mapped.size());
    }

    @Transactional(readOnly = true)
    public List<Long> ids(Long userId) {
        return wishlistRepository.findProductIdsByUserId(userId);
    }

    @Transactional
    public WishlistResponse add(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            Product p = productRepository.findById(productId)
                    .orElseThrow(() -> new NotFoundException("Product not found: " + productId));
            User u = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found: " + userId));
            wishlistRepository.save(WishlistItem.builder().user(u).product(p).build());
        }
        return list(userId);
    }

    @Transactional
    public WishlistResponse remove(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
        return list(userId);
    }
}
