package com.demo.ebook.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CartItemDTO {
    private Integer id;
    private Integer bookId;
    private String bookTitle;
    private Double price;
    private Integer quantity;
    private Double subtotal;
    private LocalDateTime addedAt;
}