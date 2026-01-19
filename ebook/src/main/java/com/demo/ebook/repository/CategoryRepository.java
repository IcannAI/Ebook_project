package com.demo.ebook.repository;

import com.demo.ebook.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    // 使用 EntityGraph 強制載入 subCategories，避免 Lazy Loading 問題
    @EntityGraph(attributePaths = {"subCategories"})
    List<Category> findAll();
}