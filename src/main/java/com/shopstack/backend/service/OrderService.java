package com.shopstack.backend.service;

import com.shopstack.backend.dto.OrderItemResponse;
import com.shopstack.backend.dto.OrderResponse;
import com.shopstack.backend.entity.Cart;
import com.shopstack.backend.entity.CartItem;
import com.shopstack.backend.entity.Order;
import com.shopstack.backend.entity.OrderItem;
import com.shopstack.backend.entity.OrderStatus;
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

    @Autowired
    private NotificationService notificationService;


    // =========================================================
    // PLACE ORDER
    // =========================================================

    @Transactional
    public OrderResponse placeOrder(String email) {

        // 1. Find customer
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // 2. Find customer's cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found")
                );


        // 3. Check if cart is empty
        if (cart.getItems() == null ||
                cart.getItems().isEmpty()) {

            throw new RuntimeException("Cart is empty");
        }


        // 4. Check stock before changing anything
        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {

                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName()
                );
            }
        }


        // 5. Create order
        Order order = new Order();

        order.setUser(user);

        order.setStatus(
                OrderStatus.PLACED
        );

        order.setOrderDate(
                LocalDateTime.now()
        );


        List<OrderItem> orderItems =
                new ArrayList<>();

        double totalAmount = 0;


        // 6. Create order items
        for (CartItem cartItem : cart.getItems()) {

            Product product =
                    cartItem.getProduct();

            int quantity =
                    cartItem.getQuantity();

            double price =
                    product.getPrice();

            double subtotal =
                    price * quantity;

            totalAmount += subtotal;


            OrderItem orderItem =
                    new OrderItem();

            orderItem.setOrder(order);

            orderItem.setProduct(product);

            orderItem.setQuantity(quantity);

            // Store price at time of purchase
            orderItem.setPrice(price);

            orderItems.add(orderItem);


            // 7. Reduce stock
            product.setStock(
                    product.getStock() - quantity
            );
        }


        order.setTotalAmount(
                totalAmount
        );

        order.setItems(
                orderItems
        );


        // 8. Save order
        Order savedOrder =
                orderRepository.save(order);


        // 9. Notify vendors
        notificationService.notifyVendors(
                savedOrder
        );


        // 10. Clear cart
        cart.getItems().clear();

        cartRepository.save(cart);


        // 11. Return response
        return convertToResponse(
                savedOrder
        );
    }


    // =========================================================
    // CONVERT ORDER TO RESPONSE
    // =========================================================

    private OrderResponse convertToResponse(
            Order order
    ) {

        OrderResponse response =
                new OrderResponse();


        response.setId(
                order.getId()
        );

        response.setTotalAmount(
                order.getTotalAmount()
        );

        response.setStatus(
                order.getStatus().name()
        );

        response.setOrderDate(
                order.getOrderDate()
        );


        List<OrderItemResponse> itemResponses =
                new ArrayList<>();


        for (OrderItem item :
                order.getItems()) {

            OrderItemResponse itemResponse =
                    new OrderItemResponse();


            itemResponse.setId(
                    item.getId()
            );


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
                    item.getPrice()
                            * item.getQuantity()
            );


            itemResponses.add(
                    itemResponse
            );
        }


        response.setItems(
                itemResponses
        );


        return response;
    }


    // =========================================================
    // GET CUSTOMER ORDERS
    // =========================================================

    public List<OrderResponse> getMyOrders(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        List<Order> orders =
                orderRepository
                        .findByUserOrderByOrderDateDesc(
                                user
                        );


        List<OrderResponse> responses =
                new ArrayList<>();


        for (Order order : orders) {

            responses.add(
                    convertToResponse(order)
            );
        }


        return responses;
    }


    // =========================================================
    // UPDATE ORDER STATUS
    // =========================================================

    public String updateOrderStatus(
            Long orderId,
            String email,
            OrderStatus newStatus
    ) {

        // 1. Find vendor
        User vendor =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vendor not found"
                                )
                        );


        // 2. Find order
        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                )
                        );


        // 3. Check whether vendor owns
        // at least one product in this order
        boolean vendorOwnsOrder =
                order.getItems()
                        .stream()
                        .anyMatch(item -> {

                            Product product =
                                    item.getProduct();

                            if (product.getVendor() == null) {
                                return false;
                            }

                            return product
                                    .getVendor()
                                    .getId()
                                    .equals(
                                            vendor.getId()
                                    );
                        });


        if (!vendorOwnsOrder) {

            throw new RuntimeException(
                    "Access denied. You are not the vendor for this order."
            );
        }


        // 4. Get current status
        OrderStatus currentStatus =
                order.getStatus();


        // 5. Delivered cannot be changed
        if (currentStatus ==
                OrderStatus.DELIVERED) {

            throw new RuntimeException(
                    "Delivered order cannot be updated"
            );
        }


        // 6. Cancelled cannot be changed
        if (currentStatus ==
                OrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Cancelled order cannot be updated"
            );
        }


        // 7. Validate transition
        if (!isValidTransition(
                currentStatus,
                newStatus
        )) {

            throw new RuntimeException(
                    "Invalid status transition from "
                            + currentStatus
                            + " to "
                            + newStatus
            );
        }


        // 8. Update status
        order.setStatus(
                newStatus
        );


        // 9. Save
        orderRepository.save(order);


        return "Order status updated to "
                + newStatus;
    }


    // =========================================================
    // VALID STATUS TRANSITIONS
    // =========================================================

    private boolean isValidTransition(
            OrderStatus current,
            OrderStatus next
    ) {

        return switch (current) {

            case PLACED ->
                    next == OrderStatus.CONFIRMED
                            || next == OrderStatus.CANCELLED;


            case CONFIRMED ->
                    next == OrderStatus.PROCESSING
                            || next == OrderStatus.CANCELLED;


            case PROCESSING ->
                    next == OrderStatus.SHIPPED;


            case SHIPPED ->
                    next == OrderStatus.OUT_FOR_DELIVERY;


            case OUT_FOR_DELIVERY ->
                    next == OrderStatus.DELIVERED;


            case DELIVERED,
                 CANCELLED ->
                    false;
        };
    }


    // =========================================================
    // GET VENDOR ORDERS
    // =========================================================

    public List<OrderResponse> getVendorOrders(
            String email
    ) {

        // 1. Find vendor
        User vendor =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vendor not found"
                                )
                        );


        // 2. Get all orders
        List<Order> allOrders =
                orderRepository.findAll();


        List<OrderResponse> responses =
                new ArrayList<>();


        // 3. Keep only orders containing
        // products belonging to this vendor
        for (Order order : allOrders) {

            boolean vendorOwnsOrder =
                    order.getItems()
                            .stream()
                            .anyMatch(item -> {

                                Product product =
                                        item.getProduct();

                                if (product.getVendor() == null) {
                                    return false;
                                }

                                return product
                                        .getVendor()
                                        .getId()
                                        .equals(
                                                vendor.getId()
                                        );
                            });


            if (vendorOwnsOrder) {

                responses.add(
                        convertToResponse(order)
                );
            }
        }


        return responses;
    }
}