package com.shopstack.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${resend.from}")
    private String senderEmail;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendSimpleEmail(
            String to,
            String subject,
            String body
    ) {

        sendEmail(
                to,
                subject,
                "<p>" + body.replace("\n", "<br>") + "</p>"
        );
    }

    public void sendHtmlEmail(
            String to,
            String subject,
            String htmlBody
    ) {

        sendEmail(
                to,
                subject,
                htmlBody
        );
    }

    private void sendEmail(
            String to,
            String subject,
            String htmlBody
    ) {

        if (to == null || to.isBlank()) {
            System.err.println(
                    "EMAIL SENDING SKIPPED: recipient email unavailable"
            );
            return;
        }

        try {

            String jsonBody = """
                    {
                      "from": "%s",
                      "to": ["%s"],
                      "subject": "%s",
                      "html": %s
                    }
                    """.formatted(
                    escapeJson(senderEmail),
                    escapeJson(to),
                    escapeJson(subject),
                    toJsonString(htmlBody)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header(
                            "Authorization",
                            "Bearer " + resendApiKey
                    )
                    .header(
                            "Content-Type",
                            "application/json"
                    )
                    .POST(
                            HttpRequest.BodyPublishers.ofString(
                                    jsonBody
                            )
                    )
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() >= 200 &&
                    response.statusCode() < 300) {

                System.out.println(
                        "EMAIL SENT SUCCESSFULLY TO: " + to
                );

                System.out.println(
                        "RESEND RESPONSE: " + response.body()
                );

            } else {

                System.err.println(
                        "EMAIL SENDING FAILED TO: " + to
                );

                System.err.println(
                        "Resend HTTP Status: " +
                                response.statusCode()
                );

                System.err.println(
                        "Resend Response: " +
                                response.body()
                );
            }

        } catch (Exception e) {

            System.err.println(
                    "EMAIL SENDING FAILED TO: " + to
            );

            System.err.println(
                    "Reason: " + e.getMessage()
            );
        }
    }

    private String escapeJson(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }

    private String toJsonString(String value) {

        return "\"" + escapeJson(value) + "\"";
    }
}