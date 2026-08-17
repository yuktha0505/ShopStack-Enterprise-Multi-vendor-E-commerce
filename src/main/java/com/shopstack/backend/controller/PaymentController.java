package com.shopstack.backend.controller;

import com.shopstack.backend.dto.PaymentRequest;
import com.shopstack.backend.dto.PaymentVerificationRequest;
import com.shopstack.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody PaymentRequest request) {

        try {

            String order = paymentService.createPaymentOrder(
                    request.getAmount()
            );

            return ResponseEntity.ok(order);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==========================================
    // VERIFY RAZORPAY PAYMENT
    // ==========================================

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerificationRequest request) {

        try {

            boolean verified =
                    paymentService.verifyPayment(request);

            if (verified) {

                return ResponseEntity.ok(
                        "Payment Verified Successfully"
                );
            }

            return ResponseEntity
                    .badRequest()
                    .body("Payment Verification Failed");

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}