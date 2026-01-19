package com.demo.ebook.service;

import com.demo.ebook.dto.CartItemDTO;
import com.demo.ebook.entity.Book;
import com.demo.ebook.entity.CartItem;
import com.demo.ebook.entity.Member;
import com.demo.ebook.repository.BookRepository;
import com.demo.ebook.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private BookRepository bookRepository;

    private Member getCurrentUser() {
        // Assume authentication, get user from principal
        return (Member) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<CartItemDTO> getCartItems() {
        Member user = getCurrentUser();
        return cartItemRepository.findByUser(user).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void addToCart(Integer bookId, Integer quantity) {
        Member user = getCurrentUser();
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
        Optional<CartItem> optionalItem = cartItemRepository.findByUserAndBook(user, book);
        CartItem item = optionalItem.orElse(new CartItem());
        item.setUser(user);
        item.setBook(book);
        item.setQuantity(item.getQuantity() != null ? item.getQuantity() + quantity : quantity);
        item.setAddedAt(LocalDateTime.now());
        cartItemRepository.save(item);
    }

    public void updateQuantity(Integer itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
    }

    public void removeItem(Integer itemId) {
        cartItemRepository.deleteById(itemId);
    }

    public Double getTotal() {
        return getCartItems().stream().mapToDouble(CartItemDTO::getSubtotal).sum();
    }

    private CartItemDTO toDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setBookId(item.getBook().getId());
        dto.setBookTitle(item.getBook().getTitle());
        dto.setPrice(item.getBook().getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(item.getQuantity() * item.getBook().getPrice());
        dto.setAddedAt(item.getAddedAt());
        return dto;
    }

    public void clearCart() {
        Member user = getCurrentUser();
        cartItemRepository.deleteByUser(user);
    }
}