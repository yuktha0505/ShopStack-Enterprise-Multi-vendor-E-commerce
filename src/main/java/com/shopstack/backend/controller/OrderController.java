package com.shopstack.backend.controller;

import com.shopstack.backend.dto.OrderResponse;
import com.shopstack.backend.entity.OrderStatus;
import com.shopstack.backend.service.JwtService;
import com.shopstack.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtService jwtService;


    @PostMapping
    public OrderResponse placeOrder(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);

        String email = jwtService.extractEmail(token);

        return orderService.placeOrder(email);
    }


    @GetMapping
    public List<OrderResponse> getMyOrders(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);

        String email = jwtService.extractEmail(token);

        return orderService.getMyOrders(email);
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status,
            @RequestHeader("Authorization") String authHeader
    ) {

        try {

            String token = authHeader.substring(7);

            String email = jwtService.extractEmail(token);

            String response =
                    orderService.updateOrderStatus(
                            id,
                            email,
                            status
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/vendor")
    public ResponseEntity<?> getVendorOrders(
            @RequestHeader("Authorization") String authHeader) {

        try {

            String token = authHeader.substring(7);

            String email = jwtService.extractEmail(token);

            List<OrderResponse> orders =
                    orderService.getVendorOrders(email);

            return ResponseEntity.ok(orders);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}