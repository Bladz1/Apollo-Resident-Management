package com.team.ResidentManagement.service;

import org.springframework.stereotype.Service;

import com.team.ResidentManagement.dto.request.PaymentRequest;

import lombok.RequiredArgsConstructor;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.PaymentLinkItem;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;

import java.util.Date;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class PaymentService {

        private final PayOS payOS;

        public String createPaymentLink(PaymentRequest request) throws Exception {
                long orderCode = new Date().getTime();

                PaymentLinkItem item = PaymentLinkItem.builder()
                                .name(request.getDescription() != null && request.getDescription().length() > 25
                                                ? request.getDescription().substring(0, 25)
                                                : request.getDescription())
                                .quantity(1)
                                .price((long) request.getAmount())
                                .build();

                CreatePaymentLinkRequest paymentData = CreatePaymentLinkRequest.builder()
                                .orderCode(orderCode)
                                .amount((long) request.getAmount())
                                .description(request.getDescription() != null && request.getDescription().length() > 25
                                                ? request.getDescription().substring(0, 25)
                                                : request.getDescription())
                                .returnUrl("http://localhost:3000/services/nop-phi")
                                .cancelUrl("http://localhost:3000/services/nop-phi")
                                .items(Collections.singletonList(item))
                                .build();

                CreatePaymentLinkResponse data = payOS.paymentRequests().create(paymentData);
                return data.getCheckoutUrl();
        }
}
