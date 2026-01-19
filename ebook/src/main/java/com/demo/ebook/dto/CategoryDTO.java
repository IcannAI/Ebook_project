package com.demo.ebook.dto;

import lombok.Data;

import java.util.List;

@Data
public class CategoryDTO {
    private Integer id;
    private String name;
    private List<SubCategoryDTO> subCategories;
}