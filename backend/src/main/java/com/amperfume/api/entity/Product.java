package com.amperfume.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_slug", columnList = "slug", unique = true),
        @Index(name = "idx_products_sku", columnList = "sku", unique = true),
        @Index(name = "idx_products_category", columnList = "category_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 128)
    private String slug;

    @Column(nullable = false, unique = true, length = 32)
    private String sku;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, length = 191)
    private String nameFr;

    @Column(nullable = false, length = 191)
    private String nameAr;

    @Column(nullable = false, length = 191)
    private String nameEn;

    @Column(length = 255)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 64)
    private String family;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;

    @Column(length = 64)
    private String concentration;

    @Column(length = 32)
    private String size;

    @Column(length = 64)
    private String longevity;

    @Column(length = 64)
    private String sillage;

    /** Comma-separated list, e.g. "Printemps,Été". */
    @Column(length = 191)
    private String seasons;

    /** Comma-separated list, e.g. "Quotidien,Romance". */
    @Column(length = 191)
    private String occasions;

    @Column(columnDefinition = "TEXT")
    private String topNotes;

    @Column(columnDefinition = "TEXT")
    private String heartNotes;

    @Column(columnDefinition = "TEXT")
    private String baseNotes;

    @Column(length = 32)
    private String hue;

    @Column(length = 16)
    private String accent;

    @Column(nullable = false)
    @Builder.Default
    private boolean limitedEdition = false;

    /** Soft-delete flag (only false products are visible to the public). */
    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC, id ASC")
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
