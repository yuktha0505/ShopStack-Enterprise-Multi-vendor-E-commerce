package com.shopstack.backend.service;

import com.shopstack.backend.dto.OrderItemResponse;
import com.shopstack.backend.dto.OrderResponse;
import com.shopstack.backend.entity.Cart;
import com.shopstack.backend.entity.CartItem;
import com.shopstack.backend.entity.Order;
import com.shopstack.backend.entity.OrderItem;
import com.shopstack.backend.entity.Product;
import com.shopstack.backend.entity.User;
import com.shopstack.backend.repository.CartRepository;
import com.shopstack.backend.repository.OrderRepository;
import com.shopstack.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;


    @Transactional
    public OrderResponse placeOrder(String email) {

        // 1. Find customer
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        // 2. Find customer's cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));


        // 3. Check if cart is empty
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }


        // 4. Check stock for every item BEFORE changing anything
        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {

                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName()
                );
            }
        }


        // 5. Create Order
        Order order = new Order();

        order.setUser(user);
        order.setStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());


        List<OrderItem> orderItems = new ArrayList<>();

        double totalAmount = 0;


        // 6. Create OrderItems and reduce stock
        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            int quantity = cartItem.getQuantity();

            double price = product.getPrice();

            double subtotal = price * quantity;

            totalAmount += subtotal;


            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);

            // Store price at time of purchase
            orderItem.setPrice(price);

            orderItems.add(orderItem);


            // 7. Reduce stock
            product.setStock(product.getStock() - quantity);
        }


        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);


        // 8. Save order
        Order savedOrder = orderRepository.save(order);


        // 9. Clear cart
        cart.getItems().clear();

        cartRepository.save(cart);


        // 10. Convert to response
        return convertToResponse(savedOrder);
    }


    private OrderResponse convertToResponse(Order order) {

        OrderResponse response = new OrderResponse();

        response.setId(order.getId());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setOrderDate(order.getOrderDate());


        List<OrderItemResponse> itemResponses = new ArrayList<>();

        for (OrderItem item : order.getItems()) {

            OrderItemResponse itemResponse = new OrderItemResponse();

            itemResponse.setId(item.getId());

            itemResponse.setProductId(
                    item.getProduct().getId()
            );

            itemResponse.setProductName(
                    item.getProduct().getName()
            );

            itemResponse.setImageUrl(
                    item.getProduct().getImageUrl()
            );

            itemResponse.setQuantity(
                    item.getQuantity()
            );

            itemResponse.setPrice(
                    item.getPrice()
            );

            itemResponse.setSubtotal(
                    item.getPrice() * item.getQuantity()
            );

            itemResponses.add(itemResponse);
        }


        response.setItems(itemResponses);

        return response;
    }


    public List<OrderResponse> getMyOrders(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders =
                orderRepository.findByUserOrderByOrderDateDesc(user);

        List<OrderResponse> responses = new ArrayList<>();

        for (Order order : orders) {
            responses.add(convertToResponse(order));
        }

        return responses;
    }
}