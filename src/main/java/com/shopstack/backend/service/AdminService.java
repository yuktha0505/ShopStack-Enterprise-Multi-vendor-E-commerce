package com.shopstack.backend.service;

import com.shopstack.backend.dto.AdminDashboardResponse;
import com.shopstack.backend.dto.VendorResponse;
import com.shopstack.backend.entity.Order;
import com.shopstack.backend.entity.User;
import com.shopstack.backend.enums.Role;
import com.shopstack.backend.repository.OrderRepository;
import com.shopstack.backend.repository.ProductRepository;
import com.shopstack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.shopstack.backend.dto.AdminVendorResponse;
import java.util.*;
import com.shopstack.backend.dto.AdminAnalyticsResponse;
import com.shopstack.backend.entity.OrderStatus;
import com.shopstack.backend.dto.AdminOrderResponse;
import java.util.stream.Collectors;
import com.shopstack.backend.dto.AdminCommissionResponse;
import com.shopstack.backend.entity.Commission;
import com.shopstack.backend.repository.CommissionRepository;





@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CommissionRepository commissionRepository;
    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    public AdminDashboardResponse getDashboardData() {

        // Total users
        long totalUsers =
                userRepository.count();

        // Total vendors
        long totalVendors =
                userRepository.countByRole(Role.VENDOR);

        // Total products
        long totalProducts =
                productRepository.count();

        // Total orders
        long totalOrders =
                orderRepository.count();

        // Total sales
        double totalSales =
                orderRepository.findAll()
                        .stream()
                        .mapToDouble(Order::getTotalAmount)
                        .sum();

        return new AdminDashboardResponse(
                totalUsers,
                totalVendors,
                totalProducts,
                totalOrders,
                totalSales
        );
    }


    // ==========================================
    // VENDOR MANAGEMENT
    // ==========================================




    // ==========================================
    // CONVERT USER → VENDOR RESPONSE
    // ==========================================

    private VendorResponse convertToVendorResponse(User user) {

        return new VendorResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getCity(),
                user.getState(),
                user.getPincode(),
                user.getRole()
        );
    }

    public List<AdminVendorResponse> getAllVendors() {

        List<User> vendors =
                userRepository.findByRole(Role.VENDOR);

        List<AdminVendorResponse> responses =
                new java.util.ArrayList<>();

        for (User vendor : vendors) {

            long productCount =
                    productRepository
                            .findByVendor(vendor)
                            .size();

            AdminVendorResponse response =
                    new AdminVendorResponse(
                            vendor.getId(),
                            vendor.getName(),
                            vendor.getEmail(),
                            vendor.getPhone(),
                            vendor.getAddress(),
                            vendor.getCity(),
                            vendor.getState(),
                            vendor.getPincode(),
                            productCount
                    );

            responses.add(response);
        }

        return responses;
    }

    public AdminAnalyticsResponse getAnalyticsData() {

        long totalUsers = userRepository.count();

        long totalVendors =
                userRepository.countByRole(Role.VENDOR);

        long totalCustomers =
                userRepository.countByRole(Role.CUSTOMER);

        long totalProducts =
                productRepository.count();

        long totalOrders =
                orderRepository.count();

        List<Order> orders =
                orderRepository.findAll();

        double totalSales =
                orders.stream()
                        .mapToDouble(Order::getTotalAmount)
                        .sum();

        long placedOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus() == OrderStatus.PLACED)
                        .count();

        long confirmedOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus() == OrderStatus.CONFIRMED)
                        .count();

        long processingOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus() == OrderStatus.PROCESSING)
                        .count();

        long shippedOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus() == OrderStatus.SHIPPED)
                        .count();

        long outForDeliveryOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus() == OrderStatus.OUT_FOR_DELIVERY)
                        .count();

        long deliveredOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus() == OrderStatus.DELIVERED)
                        .count();

        long cancelledOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus() == OrderStatus.CANCELLED)
                        .count();

        return new AdminAnalyticsResponse(
                totalUsers,
                totalVendors,
                totalCustomers,
                totalProducts,
                totalOrders,
                totalSales,
                placedOrders,
                confirmedOrders,
                processingOrders,
                shippedOrders,
                outForDeliveryOrders,
                deliveredOrders,
                cancelledOrders
        );
    }

    public List<AdminOrderResponse> getAllOrders() {

        List<Order> orders =
                orderRepository.findAllByOrderByOrderDateDesc();

        return orders.stream()
                .map(order -> new AdminOrderResponse(
                        order.getId(),
                        order.getUser().getName(),
                        order.getUser().getEmail(),
                        order.getTotalAmount(),
                        order.getStatus().name(),
                        order.getOrderDate()
                ))
                .collect(Collectors.toList());
    }

    public List<AdminCommissionResponse> getAllCommissions() {

        List<Commission> commissions =
                commissionRepository.findAllByOrderByCreatedAtDesc();

        List<AdminCommissionResponse> responses =
                new ArrayList<>();

        for (Commission commission : commissions) {

            responses.add(
                    new AdminCommissionResponse(
                            commission.getId(),
                            commission.getOrder().getId(),
                            commission.getVendor().getId(),
                            commission.getVendor().getName(),
                            commission.getSaleAmount(),
                            commission.getCommissionRate(),
                            commission.getCommissionAmount(),
                            commission.getVendorAmount(),
                            commission.getStatus().name(),
                            commission.getCreatedAt()
                    )
            );
        }

        return responses;
    }
}