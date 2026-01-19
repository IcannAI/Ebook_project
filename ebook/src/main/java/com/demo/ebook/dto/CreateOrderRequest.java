package com.demo.ebook.dto;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private Integer shippingInfoId;
    private String shippingType; // home, family, etc. for fee calculation
    private String paymentMethod; // Credit Card, etc.
}