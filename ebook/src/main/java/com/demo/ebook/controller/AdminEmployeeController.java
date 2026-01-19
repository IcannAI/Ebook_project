package com.demo.ebook.controller;

import com.demo.ebook.dto.AdminRegisterRequest;
import com.demo.ebook.dto.EmployeeDTO;
import com.demo.ebook.dto.UpdateEmployeeRequest;
import com.demo.ebook.entity.Employee;
import com.demo.ebook.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employees")
@CrossOrigin(origins = "*")
public class AdminEmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public List<EmployeeDTO> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public EmployeeDTO getEmployee(@PathVariable Integer id) {
        return employeeService.getEmployeeById(id);
    }

    @PostMapping
    public EmployeeDTO addEmployee(@RequestBody AdminRegisterRequest request) {
        return employeeService.register(request);  // Reuse register for adding new admin/employee
    }

    @PutMapping("/{id}")
    public EmployeeDTO updateEmployee(@PathVariable Integer id, @RequestBody UpdateEmployeeRequest request) {
        return employeeService.updateEmployee(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    // Dashboard might not need specific endpoint, but if needed for welcome
    @GetMapping("/profile")
    public EmployeeDTO getProfile(Authentication authentication) {
        // Extract account from token, assuming token is account:admin
        String account = authentication.getName().split(":")[0];
        Employee employee = employeeService.getEmployeeByAccount(account);  // Add method if needed
        return employeeService.toDTO(employee);  // Assume added to service
    }
}