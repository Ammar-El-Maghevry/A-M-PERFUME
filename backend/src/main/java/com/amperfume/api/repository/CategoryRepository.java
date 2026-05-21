package com.amperfume.api.repository;

import com.amperfume.api.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlugIgnoreCase(String slug);
    boolean existsBySlugIgnoreCase(String slug);
    List<Category> findByActiveTrueOrderByPositionAscIdAsc();
    List<Category> findAllByOrderByPositionAscIdAsc();
}
