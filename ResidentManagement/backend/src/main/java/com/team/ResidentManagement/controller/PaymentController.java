package com.team.ResidentManagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team.ResidentManagement.dto.request.PaymentRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-link")
    public ApiResponse<String> createPaymentLink(@RequestBody PaymentRequest request) {
        try {
            String checkoutUrl = paymentService.createPaymentLink(request);
            return ApiResponse.<String>builder()
                    .code(1000)
                    .message("Payment link created successfully")
                    .result(checkoutUrl)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<String>builder()
                    .code(9999)
                    .message("Failed to create payment link: " + e.getMessage())
                    .result(null)
                    .build();
        }
    }
}
