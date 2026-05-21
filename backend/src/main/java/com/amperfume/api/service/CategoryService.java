package com.amperfume.api.service;

import com.amperfume.api.dto.request.CategoryRequest;
import com.amperfume.api.dto.response.CategoryResponse;
import com.amperfume.api.entity.Category;
import com.amperfume.api.exception.ConflictException;
import com.amperfume.api.exception.NotFoundException;
import com.amperfume.api.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> listActive() {
        return categoryRepository.findByActiveTrueOrderByPositionAscIdAsc().stream()
                .map(CategoryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAll() {
        return categoryRepository.findAllByOrderByPositionAscIdAsc().stream()
                .map(CategoryResponse::from).toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        String slug = req.slug().trim().toLowerCase();
        if (categoryRepository.existsBySlugIgnoreCase(slug)) {
            throw new ConflictException("Category slug already exists: " + slug);
        }
        Category c = Category.builder()
                .slug(slug)
                .nameFr(req.nameFr().trim())
                .nameAr(req.nameAr().trim())
                .nameEn(req.nameEn().trim())
                .position(req.position())
                .active(req.active() == null || req.active())
                .build();
        return CategoryResponse.from(categoryRepository.save(c));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
        if (!c.getSlug().equalsIgnoreCase(req.slug())
                && categoryRepository.existsBySlugIgnoreCase(req.slug())) {
            throw new ConflictException("Category slug already exists: " + req.slug());
        }
        c.setSlug(req.slug().trim().toLowerCase());
        c.setNameFr(req.nameFr().trim());
        c.setNameAr(req.nameAr().trim());
        c.setNameEn(req.nameEn().trim());
        c.setPosition(req.position());
        if (req.active() != null) c.setActive(req.active());
        return CategoryResponse.from(categoryRepository.save(c));
    }

    @Transactional
    public void softDelete(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
        c.setActive(false);
        categoryRepository.save(c);
    }
}
