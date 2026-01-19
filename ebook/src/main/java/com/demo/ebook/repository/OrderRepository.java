package com.demo.ebook.repository;

import com.demo.ebook.entity.Member;
import com.demo.ebook.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUser(Member user);
    List<Order> findByUserAndStatus(Member user, Integer status);
}