package com.demo.ebook.repository;

import com.demo.ebook.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Optional<Employee> findByAccount(String account);
    Optional<Employee> findByEmail(String email);
}