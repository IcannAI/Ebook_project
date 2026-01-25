package com.demo.ebook.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_shipping_infos")
@Data
public class UserShippingInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Member user;

    @Column(name = "method_name")
    private String methodName;   // 例如：住家、公司、學校

    private String address;      // 完整地址
}