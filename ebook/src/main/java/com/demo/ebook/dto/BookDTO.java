package com.demo.ebook.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.math.BigDecimal;

@Data
public class BookDTO {
    private Integer id;
    private String title;
    private String isbn;
    private BigDecimal price;  // BigDecimal for price
    private String description;
    private String coverImage;
    private Byte status; // 0: 下架, 1: 上架
    private Integer stock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer updatedByAdminId;
    private Integer publisherId;
    private Integer subCategoryId;
    private Set<Integer> authorIds;
    
    // 新增欄位（與 Entity 同步）
    private LocalDate publishDate;  
    private BigDecimal discount; // BigDecimal for discount
}