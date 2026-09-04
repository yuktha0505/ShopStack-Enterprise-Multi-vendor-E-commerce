package com.shopstack.backend.controller;

import com.shopstack.backend.dto.AdminAnalyticsResponse;
import com.shopstack.backend.dto.AdminDashboardResponse;
import com.shopstack.backend.dto.AdminOrderResponse;
import com.shopstack.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.shopstack.backend.dto.AdminVendorResponse;
import com.shopstack.backend.dto.AdminCommissionResponse;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;


    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {

        AdminDashboardResponse response =
                adminService.getDashboardData();

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // VENDOR MANAGEMENT
    // ==========================================



    @GetMapping("/vendors")
    public ResponseEntity<List<AdminVendorResponse>> getAllVendors() {

        List<AdminVendorResponse> vendors =
                adminService.getAllVendors();

        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {

        AdminAnalyticsResponse response =
                adminService.getAnalyticsData();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderResponse>> getAllOrders() {

        List<AdminOrderResponse> orders =
                adminService.getAllOrders();

        return ResponseEntity.ok(orders);
    }



    @GetMapping("/commissions")
    public ResponseEntity<List<AdminCommissionResponse>> getAllCommissions() {

        List<AdminCommissionResponse> commissions =
                adminService.getAllCommissions();

        return ResponseEntity.ok(commissions);
    }

}