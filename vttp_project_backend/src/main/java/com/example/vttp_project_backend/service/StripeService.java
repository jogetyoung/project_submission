package com.example.vttp_project_backend.service;

import com.example.vttp_project_backend.models.PaymentInfo;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String STRIPE_API_KEY;

    @Value("${server.api.url}")
    private String SERVER_API_URL; //page redirected to just for payment
    
    public String createPaymentLink(PaymentInfo urls) {
        Stripe.apiKey = STRIPE_API_KEY;

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(SERVER_API_URL + urls.getSuccessUrl())
            .setCancelUrl(SERVER_API_URL + urls.getCancelUrl())
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("sgd")
                            .setUnitAmount(500L)
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName("Total")
                                    .build())
                            .build())
                    .build())
            .build();

        try {
            Session session = Session.create(params);
            return session.getId();
        } catch (StripeException ex) {
            System.out.println(ex);
        }

        return "";

    }
}
