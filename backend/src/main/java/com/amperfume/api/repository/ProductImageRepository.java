package com.amperfume.api.repository;

import com.amperfume.api.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductIdOrderByPositionAscIdAsc(Long productId);
}
