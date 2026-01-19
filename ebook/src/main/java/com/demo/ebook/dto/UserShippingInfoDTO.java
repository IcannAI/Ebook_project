package com.demo.ebook.dto;

import lombok.Data;

@Data
public class UserShippingInfoDTO {
    private Integer id;
    private String methodName;
    private String address;
    private String phone;   // 如果有加電話欄位
}