package com.demo.ebook.repository;

import com.demo.ebook.entity.Order;
import com.demo.ebook.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    // 1. 查詢某張訂單的所有明細（最常用）
    List<OrderDetail> findByOrder(Order order);

    // 2. 查詢某張訂單的所有明細（使用 orderId）
    List<OrderDetail> findByOrderId(Integer orderId);

    // 3. 查詢某本書在哪些訂單中出現過（可選）
    List<OrderDetail> findByBookId(Integer bookId);

 
    // 4. 計算某張訂單的總金額（如果不信任前端計算）
    // @Query("SELECT SUM(od.subtotal) FROM OrderDetail od WHERE od.order.id = :orderId")
    // Double sumSubtotalByOrderId(@Param("orderId") Integer orderId);
}