package com.demo.ebook.service;

import com.demo.ebook.dto.PaymentMethodDTO;
import com.demo.ebook.entity.PaymentMethod;
import com.demo.ebook.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    /**
     * 取得所有付款方式（用於結帳頁下拉選單）
     */
    public List<PaymentMethodDTO> getAllPaymentMethods() {
        return paymentMethodRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 根據名稱查找付款方式（結帳時驗證使用）
     */
    public PaymentMethodDTO findByName(String name) {
        PaymentMethod method = paymentMethodRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Payment method not found: " + name));
        return toDTO(method);
    }

    private PaymentMethodDTO toDTO(PaymentMethod entity) {
        PaymentMethodDTO dto = new PaymentMethodDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        return dto;
    }
}