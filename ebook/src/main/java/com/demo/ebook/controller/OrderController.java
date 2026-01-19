package com.demo.ebook.controller;

import com.demo.ebook.dto.CreateOrderRequest;
import com.demo.ebook.dto.OrderDTO;
import com.demo.ebook.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<OrderDTO> getOrders(@RequestParam(defaultValue = "-1") Integer status) {
        return orderService.getOrders(status);
    }

    @GetMapping("/{id}")
    public OrderDTO getOrderDetail(@PathVariable Integer id) {
        return orderService.getOrderDetail(id);
    }

    @PostMapping
    public OrderDTO createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }
}