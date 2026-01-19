package com.demo.ebook.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Integer id;
    private Double totalAmount;
    private Integer status;
    private LocalDateTime createdAt;
    private String shippingMethod;
    private String shippingAddress;
    private String paymentMethod;
    private List<OrderDetailDTO> details;
}