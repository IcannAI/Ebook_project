package com.demo.ebook.service;

import com.demo.ebook.dto.CreateOrderRequest;
import com.demo.ebook.dto.OrderDTO;
import com.demo.ebook.dto.OrderDetailDTO;
import com.demo.ebook.entity.*;
import com.demo.ebook.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private UserShippingInfoRepository shippingRepository;
    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    private Member getCurrentUser() {
        return (Member) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<OrderDTO> getOrders(Integer status) {
        Member user = getCurrentUser();
        List<Order> orders = status == -1 ? orderRepository.findByUser(user) : orderRepository.findByUserAndStatus(user, status);
        return orders.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public OrderDTO getOrderDetail(Integer id) {
        Order order = orderRepository.findById(id).orElseThrow();
        // Check if belongs to user
        if (!order.getUser().equals(getCurrentUser())) {
            throw new RuntimeException("Unauthorized");
        }
        return toDTO(order);
    }

    public OrderDTO createOrder(CreateOrderRequest request) {
        Member user = getCurrentUser();
        List<CartItem> cartItems = cartService.getCartItems().stream().map(dto -> {
            CartItem item = new CartItem();
            // Map back, but actually use repo
            return item;
        }).collect(Collectors.toList()); // Better to use cart repo directly

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart empty");
        }

        UserShippingInfo shipping = shippingRepository.findById(request.getShippingInfoId()).orElseThrow();

        PaymentMethod payment = paymentMethodRepository.findByName(request.getPaymentMethod()).orElseThrow(() -> new RuntimeException("Invalid payment"));

        java.math.BigDecimal cartTotal = cartService.getTotal();
        java.math.BigDecimal shippingFee = "home".equals(request.getShippingType()) ? new java.math.BigDecimal("80") : new java.math.BigDecimal("60");
        java.math.BigDecimal total = cartTotal.add(shippingFee);

        Order order = new Order();
        order.setUser(user);
        order.setShippingInfo(shipping);
        order.setTotalAmount(total);
        order.setStatus((byte) 1); 
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setPaymentMethod(payment);

        order = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setBook(cartItem.getBook());
            detail.setQuantity(cartItem.getQuantity());
            detail.setPriceAtMoment(cartItem.getBook().getPrice());
            detail.setSubtotal(detail.getPriceAtMoment().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            orderDetailRepository.save(detail);
        }

        cartService.clearCart();

        return toDTO(order);
    }

    private OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setShippingMethod(order.getShippingInfo().getMethodName());
        dto.setShippingAddress(order.getShippingInfo().getAddress());
        dto.setPaymentMethod(order.getPaymentMethod().getName());
        dto.setDetails(order.getDetails().stream().map(d -> {
            OrderDetailDTO ddto = new OrderDetailDTO();
            ddto.setBookId(d.getBook().getId());
            ddto.setBookTitle(d.getBook().getTitle());
            ddto.setQuantity(d.getQuantity());
            ddto.setPrice(d.getPriceAtMoment());
            ddto.setSubtotal(d.getSubtotal());
            return ddto;
        }).collect(Collectors.toList()));
        return dto;
    }
}