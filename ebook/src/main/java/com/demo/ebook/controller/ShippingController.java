package com.demo.ebook.controller;

import com.demo.ebook.dto.UserShippingInfoDTO;
import com.demo.ebook.service.ShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = "*")
public class ShippingController {

    @Autowired
    private ShippingService shippingService;

    @GetMapping
    public List<UserShippingInfoDTO> getShippingInfos() {
        return shippingService.getShippingInfos();
    }

    @PostMapping
    public UserShippingInfoDTO addShipping(
            @RequestParam String methodName,
            @RequestParam String address,
            @RequestParam(required = false) String phone) {
        return shippingService.addShippingInfo(methodName, address, phone);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipping(@PathVariable Integer id) {
        shippingService.deleteShippingInfo(id);
        return ResponseEntity.ok().build();
    }
}