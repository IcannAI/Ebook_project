package com.demo.ebook.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookDTO {
    private Integer id;
    private String title;
    private String isbn;
    private Double price;      // 改用Double
    private String description;
    private String coverImage;
    private Integer status;
    private Integer stock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer updatedByAdminId;
    private Integer publisherId;
    private Integer subCategoryId;
    private Set<Integer> authorIds;
    
    // 新增欄位（與 Entity 同步）
    private LocalDate publishDate;  
    private Double discount;   // 折扣係數
}