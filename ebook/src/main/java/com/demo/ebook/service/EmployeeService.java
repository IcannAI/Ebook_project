package com.demo.ebook.service;

import com.demo.ebook.dto.*;
import com.demo.ebook.entity.Employee;
import com.demo.ebook.repository.EmployeeRepository;
import com.demo.ebook.utility.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Register Admin/Employee
    public EmployeeDTO register(AdminRegisterRequest request) {
        if (employeeRepository.findByAccount(request.getAccount()).isPresent()) {
            throw new RuntimeException("Account exists");
        }
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email exists");
        }

        Employee employee = new Employee();
        employee.setAccount(request.getAccount());
        employee.setPassword(request.getPassword());
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setRole(request.getRole() != null ? request.getRole() : "ADMIN");  // Default to ADMIN
        employee.setStatus(1);
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        employee = employeeRepository.save(employee);
        return toDTO(employee);
    }

    // Login
    public AdminLoginResponse login(AdminLoginRequest request) {
        Employee employee = employeeRepository.findByAccount(request.getAccount()).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!request.getPassword().equals(employee.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }
        employee.setUpdatedAt(LocalDateTime.now());  // Update last login as updated_at
        employeeRepository.save(employee);

        String token = jwtUtil.generateToken(employee.getAccount(), "admin", List.of("ROLE_" + employee.getRole().toUpperCase()));
        AdminLoginResponse response = new AdminLoginResponse();
        response.setToken(token);
        response.setEmployee(toDTO(employee));
        return response;
    }

    // Get All Employees
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Get Employee by ID
    public EmployeeDTO getEmployeeById(Integer id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
        return toDTO(employee);
    }

    // Update Employee
    public EmployeeDTO updateEmployee(Integer id, UpdateEmployeeRequest request) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
        if (request.getName() != null) employee.setName(request.getName());
        if (request.getEmail() != null) {
            if (employeeRepository.findByEmail(request.getEmail()).isPresent() && !request.getEmail().equals(employee.getEmail())) {
                throw new RuntimeException("Email exists");
            }
            employee.setEmail(request.getEmail());
        }
        if (request.getRole() != null) employee.setRole(request.getRole());
        employee.setUpdatedAt(LocalDateTime.now());
        employee = employeeRepository.save(employee);
        return toDTO(employee);
    }

    // Delete Employee
    public void deleteEmployee(Integer id) {
        employeeRepository.deleteById(id);
    }

    // Forgot Password for Admin (similar to user)
    public void forgotPassword(String email) {
        Employee employee = employeeRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email not found"));
        String newPass = UUID.randomUUID().toString().substring(0, 12);
        employee.setPassword(newPass);
        employee.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(employee);
        System.out.println("New admin password: " + newPass);
    }

    // Add for profile
    public Employee getEmployeeByAccount(String account) {
        return employeeRepository.findByAccount(account).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public EmployeeDTO toDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setAccount(employee.getAccount());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setRole(employee.getRole());
        dto.setStatus(employee.getStatus());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());
        return dto;
    }
}