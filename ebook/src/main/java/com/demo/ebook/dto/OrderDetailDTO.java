package com.demo.ebook.dto;

import lombok.Data;

@Data
public class OrderDetailDTO {
    private Integer bookId;
    private String bookTitle;
    private Integer quantity;
    private Double price;
    private Double subtotal;
}