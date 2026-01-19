package com.demo.ebook.controller;

import com.demo.ebook.dto.CartItemDTO;
import com.demo.ebook.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*") // Adjust for production
public class CartController {
    @Autowired
    private CartService service;

    @GetMapping
    public List<CartItemDTO> getCart() {
        return service.getCartItems();
    }

    @PostMapping
    public ResponseEntity<Void> addToCart(@RequestParam Integer bookId, @RequestParam Integer quantity) {
        service.addToCart(bookId, quantity);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateQuantity(@PathVariable Integer id, @RequestParam Integer quantity) {
        service.updateQuantity(id, quantity);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Integer id) {
        service.removeItem(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/total")
    public Double getTotal() {
        return service.getTotal();
    }

    @GetMapping("/count")
    public Integer getCount() {
        return service.getCartItems().size();
    }
}