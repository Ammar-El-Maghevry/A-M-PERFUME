package com.amperfume.api.repository;

import com.amperfume.api.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlugIgnoreCaseAndActiveTrue(String slug);
    Optional<Product> findBySlugIgnoreCase(String slug);
    boolean existsBySlugIgnoreCase(String slug);
    boolean existsBySkuIgnoreCase(String sku);
    List<Product> findTop8ByActiveTrueAndStockLessThanOrderByStockAsc(Integer stockThreshold);
    long countByActiveTrueAndStockLessThan(Integer stockThreshold);
}
