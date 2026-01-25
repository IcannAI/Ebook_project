package com.demo.ebook.dto;


import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderDetailDTO {
    private Integer bookId;
    private String bookTitle;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}