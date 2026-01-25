package com.demo.ebook.dto;


import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class CartItemDTO {
    private Integer id;
    private Integer bookId;
    private String bookTitle;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
    private LocalDateTime addedAt;
}