package com.demo.ebook.service;

import com.demo.ebook.dto.CategoryDTO;
import com.demo.ebook.dto.SubCategoryDTO;
import com.demo.ebook.entity.Category;
import com.demo.ebook.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * 取得所有分類（包含子分類），供前端分類樹使用
     */
    public List<CategoryDTO> getAllCategories() {
        // 使用 findAll() 會自動透過 @EntityGraph 載入 subCategories
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());

        // 轉換子分類
        List<SubCategoryDTO> subDtos = category.getSubCategories().stream()
                .map(sub -> {
                    SubCategoryDTO subDto = new SubCategoryDTO();
                    subDto.setId(sub.getId());
                    subDto.setName(sub.getName());
                    return subDto;
                })
                .collect(Collectors.toList());

        dto.setSubCategories(subDtos);
        return dto;
    }
}