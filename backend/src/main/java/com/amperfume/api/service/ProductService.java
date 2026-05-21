package com.amperfume.api.service;

import com.amperfume.api.dto.request.ProductRequest;
import com.amperfume.api.dto.response.FileUploadResponse;
import com.amperfume.api.dto.response.PageResponse;
import com.amperfume.api.dto.response.ProductImageResponse;
import com.amperfume.api.dto.response.ProductResponse;
import com.amperfume.api.entity.Category;
import com.amperfume.api.entity.Product;
import com.amperfume.api.entity.ProductImage;
import com.amperfume.api.exception.BadRequestException;
import com.amperfume.api.exception.ConflictException;
import com.amperfume.api.exception.NotFoundException;
import com.amperfume.api.repository.CategoryRepository;
import com.amperfume.api.repository.ProductImageRepository;
import com.amperfume.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

import static com.amperfume.api.service.ProductSpecifications.*;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> list(int page, int size,
                                              String category, String family,
                                              BigDecimal minPrice, BigDecimal maxPrice,
                                              Boolean inStock, String search, String sort) {
        Specification<Product> spec = Specification.where(activeOnly())
                .and(categorySlug(category))
                .and(family(family))
                .and(minPrice(minPrice))
                .and(maxPrice(maxPrice))
                .and(inStock(inStock))
                .and(search(search));

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 60), parseSort(sort));
        Page<Product> result = productRepository.findAll(spec, pageable);
        return PageResponse.from(result, ProductResponse::from);
    }

    private Sort parseSort(String sort) {
        if (sort == null) return Sort.by(Sort.Direction.DESC, "createdAt");
        return switch (sort) {
            case "price_asc"  -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "name_asc"   -> Sort.by(Sort.Direction.ASC, "nameFr");
            case "stock_asc"  -> Sort.by(Sort.Direction.ASC, "stock");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    @Transactional(readOnly = true)
    public ProductResponse getBySlug(String slug) {
        Product p = productRepository.findBySlugIgnoreCaseAndActiveTrue(slug)
                .orElseThrow(() -> new NotFoundException("Product not found: " + slug));
        return ProductResponse.from(p);
    }

    @Transactional
    public ProductResponse create(ProductRequest req) {
        if (productRepository.existsBySkuIgnoreCase(req.sku())) {
            throw new ConflictException("SKU already exists: " + req.sku());
        }
        String slug = (req.slug() == null || req.slug().isBlank())
                ? SlugUtil.slugify(req.nameFr())
                : SlugUtil.slugify(req.slug());
        slug = ensureUniqueSlug(slug, null);

        Category category = categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new NotFoundException("Category not found: " + req.categoryId()));

        Product p = Product.builder()
                .slug(slug)
                .sku(req.sku().trim().toUpperCase())
                .category(category)
                .nameFr(req.nameFr().trim())
                .nameAr(req.nameAr().trim())
                .nameEn(req.nameEn().trim())
                .tagline(req.tagline())
                .description(req.description())
                .family(req.family())
                .price(req.price())
                .stock(req.stock())
                .concentration(req.concentration())
                .size(req.size())
                .longevity(req.longevity())
                .sillage(req.sillage())
                .seasons(joinCsv(req.seasons()))
                .occasions(joinCsv(req.occasions()))
                .topNotes(joinCsv(req.topNotes()))
                .heartNotes(joinCsv(req.heartNotes()))
                .baseNotes(joinCsv(req.baseNotes()))
                .hue(req.hue())
                .accent(req.accent())
                .limitedEdition(Boolean.TRUE.equals(req.limitedEdition()))
                .active(req.active() == null || req.active())
                .build();
        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));

        if (req.slug() != null && !req.slug().isBlank()
                && !req.slug().equalsIgnoreCase(p.getSlug())) {
            p.setSlug(ensureUniqueSlug(SlugUtil.slugify(req.slug()), id));
        }
        if (!p.getSku().equalsIgnoreCase(req.sku())
                && productRepository.existsBySkuIgnoreCase(req.sku())) {
            throw new ConflictException("SKU already exists: " + req.sku());
        }
        Category category = categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new NotFoundException("Category not found: " + req.categoryId()));
        p.setSku(req.sku().trim().toUpperCase());
        p.setCategory(category);
        p.setNameFr(req.nameFr().trim());
        p.setNameAr(req.nameAr().trim());
        p.setNameEn(req.nameEn().trim());
        p.setTagline(req.tagline());
        p.setDescription(req.description());
        p.setFamily(req.family());
        p.setPrice(req.price());
        p.setStock(req.stock());
        p.setConcentration(req.concentration());
        p.setSize(req.size());
        p.setLongevity(req.longevity());
        p.setSillage(req.sillage());
        p.setSeasons(joinCsv(req.seasons()));
        p.setOccasions(joinCsv(req.occasions()));
        p.setTopNotes(joinCsv(req.topNotes()));
        p.setHeartNotes(joinCsv(req.heartNotes()));
        p.setBaseNotes(joinCsv(req.baseNotes()));
        p.setHue(req.hue());
        p.setAccent(req.accent());
        if (req.limitedEdition() != null) p.setLimitedEdition(req.limitedEdition());
        if (req.active() != null) p.setActive(req.active());

        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional
    public void softDelete(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
        p.setActive(false);
        productRepository.save(p);
    }

    @Transactional
    public ProductImageResponse addImage(Long productId, MultipartFile file, String alt, Integer position) {
        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));
        FileUploadResponse uploaded = fileStorageService.upload(file, "products/" + p.getSku().toLowerCase());
        ProductImage img = ProductImage.builder()
                .product(p)
                .url(uploaded.url())
                .publicId(uploaded.publicId())
                .alt(alt)
                .position(position == null ? p.getImages().size() : position)
                .build();
        return ProductImageResponse.from(productImageRepository.save(img));
    }

    public BigDecimal validatePrice(BigDecimal price) {
        if (price == null || price.signum() <= 0) {
            throw new BadRequestException("Price must be greater than zero");
        }
        return price;
    }

    private String ensureUniqueSlug(String base, Long ignoreId) {
        String candidate = base;
        int suffix = 2;
        while (true) {
            var existing = productRepository.findBySlugIgnoreCase(candidate);
            if (existing.isEmpty() || (ignoreId != null && existing.get().getId().equals(ignoreId))) {
                return candidate;
            }
            candidate = base + "-" + suffix++;
        }
    }

    private static String joinCsv(List<String> values) {
        if (values == null || values.isEmpty()) return null;
        return String.join(",", values.stream().map(String::trim).filter(s -> !s.isEmpty()).toList());
    }
}
