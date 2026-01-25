package com.demo.ebook.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

@Data
public class OrderDTO {
    private Integer id;
    private BigDecimal totalAmount;
    private Byte status;
    private LocalDateTime createdAt;
    private String shippingMethod;
    private String shippingAddress;
    private String paymentMethod;
    private List<OrderDetailDTO> details;
}