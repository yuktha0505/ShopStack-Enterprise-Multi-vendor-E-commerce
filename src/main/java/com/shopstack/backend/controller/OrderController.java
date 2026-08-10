package com.shopstack.backend.controller;

import com.shopstack.backend.dto.OrderResponse;
import com.shopstack.backend.service.JwtService;
import com.shopstack.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
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
}