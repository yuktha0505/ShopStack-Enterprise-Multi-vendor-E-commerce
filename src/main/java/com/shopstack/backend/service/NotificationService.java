package com.shopstack.backend.service;

import com.shopstack.backend.entity.Notification;
import com.shopstack.backend.entity.Order;
import com.shopstack.backend.entity.OrderItem;
import com.shopstack.backend.entity.Product;
import com.shopstack.backend.entity.User;
import com.shopstack.backend.repository.NotificationRepository;
import com.shopstack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;


    // ==========================================
    // NOTIFY VENDORS
    // ==========================================

    public void notifyVendors(Order order) {

        Set<Long> notifiedVendorIds = new HashSet<>();

        for (OrderItem orderItem : order.getItems()) {

            Product product = orderItem.getProduct();

            User vendor = product.getVendor();

            if (vendor == null) {
                continue;
            }

            if (notifiedVendorIds.contains(vendor.getId())) {
                continue;
            }

            Notification notification = new Notification();

            notification.setUser(vendor);

            notification.setMessage(
                    "New order received! Order #"
                            + order.getId()
                            + " has been placed."
            );

            notification.setRead(false);

            notification.setCreatedAt(
                    LocalDateTime.now()
            );

            notificationRepository.save(notification);

            notifiedVendorIds.add(vendor.getId());
        }
    }


    // ==========================================
    // GET USER NOTIFICATIONS
    // ==========================================

    public List<Notification> getMyNotifications(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user);
    }


    // ==========================================
    // GET UNREAD COUNT
    // ==========================================

    public long getUnreadCount(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        return notificationRepository
                .countByUserAndReadFalse(user);
    }


    // ==========================================
    // MARK AS READ
    // ==========================================

    public void markAsRead(
            Long notificationId,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Notification not found"
                                )
                        );


        // Security check:
        // A vendor must only be able to modify
        // their own notification.

        if (!notification.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to modify this notification"
            );
        }


        notification.setRead(true);

        notificationRepository.save(notification);
    }
}