package com.shopstack.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;


    // =========================================================
    // SIMPLE TEXT EMAIL
    // =========================================================

    public void sendSimpleEmail(
            String to,
            String subject,
            String body
    ) {

        try {

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setFrom(senderEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            System.out.println(
                    "EMAIL SENT SUCCESSFULLY TO: " + to
            );

        } catch (Exception e) {

            System.err.println(
                    "EMAIL SENDING FAILED TO: " + to
            );

            System.err.println(
                    "Reason: " + e.getMessage()
            );
        }
    }


    // =========================================================
    // HTML EMAIL
    // =========================================================

    public void sendHtmlEmail(
            String to,
            String subject,
            String htmlBody
    ) {

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(
                    htmlBody,
                    true
            );

            mailSender.send(message);

            System.out.println(
                    "HTML EMAIL SENT SUCCESSFULLY TO: "
                            + to
            );

        } catch (Exception e) {

            System.err.println(
                    "HTML EMAIL SENDING FAILED TO: "
                            + to
            );

            System.err.println(
                    "Reason: " + e.getMessage()
            );
        }
    }
}