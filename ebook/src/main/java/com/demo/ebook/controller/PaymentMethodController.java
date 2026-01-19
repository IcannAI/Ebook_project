package com.demo.ebook.controller;

import com.demo.ebook.dto.PaymentMethodDTO;
import com.demo.ebook.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@CrossOrigin(origins = "*")  // 根據專案需求調整
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    /**
     * 取得所有付款方式（供結帳頁面使用）
     */
    @GetMapping
    public ResponseEntity<List<PaymentMethodDTO>> getAllPaymentMethods() {
        List<PaymentMethodDTO> methods = paymentMethodService.getAllPaymentMethods();
        return ResponseEntity.ok(methods);
    }

    /**
     * 根據名稱查詢單一付款方式（可選）
     */
    @GetMapping("/by-name")
    public ResponseEntity<PaymentMethodDTO> getByName(@RequestParam String name) {
        PaymentMethodDTO dto = paymentMethodService.findByName(name);
        return ResponseEntity.ok(dto);
    }
}