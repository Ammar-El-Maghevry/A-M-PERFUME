package com.amperfume.api.service;

import com.amperfume.api.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class ProductSpecifications {

    private ProductSpecifications() {}

    public static Specification<Product> activeOnly() {
        return (root, q, cb) -> cb.isTrue(root.get("active"));
    }

    public static Specification<Product> categorySlug(String slug) {
        if (slug == null || slug.isBlank() || "all".equalsIgnoreCase(slug)) return null;
        return (root, q, cb) -> cb.equal(cb.lower(root.get("category").get("slug")), slug.toLowerCase());
    }

    public static Specification<Product> family(String family) {
        if (family == null || family.isBlank()) return null;
        return (root, q, cb) -> cb.like(cb.lower(root.get("family")), "%" + family.toLowerCase() + "%");
    }

    public static Specification<Product> minPrice(BigDecimal min) {
        if (min == null) return null;
        return (root, q, cb) -> cb.greaterThanOrEqualTo(root.get("price"), min);
    }

    public static Specification<Product> maxPrice(BigDecimal max) {
        if (max == null) return null;
        return (root, q, cb) -> cb.lessThanOrEqualTo(root.get("price"), max);
    }

    public static Specification<Product> inStock(Boolean inStock) {
        if (inStock == null || !inStock) return null;
        return (root, q, cb) -> cb.greaterThan(root.get("stock"), 0);
    }

    public static Specification<Product> search(String term) {
        if (term == null || term.isBlank()) return null;
        String t = "%" + term.toLowerCase() + "%";
        return (root, q, cb) -> {
            List<Predicate> ors = new ArrayList<>();
            ors.add(cb.like(cb.lower(root.get("nameFr")), t));
            ors.add(cb.like(cb.lower(root.get("nameAr")), t));
            ors.add(cb.like(cb.lower(root.get("nameEn")), t));
            ors.add(cb.like(cb.lower(root.get("sku")), t));
            ors.add(cb.like(cb.lower(root.get("family")), t));
            return cb.or(ors.toArray(new Predicate[0]));
        };
    }
}
