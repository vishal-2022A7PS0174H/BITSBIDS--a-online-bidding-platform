package com.bitsbid.backend.payload.response;

import com.bitsbid.backend.entities.Product;
import com.bitsbid.backend.entities.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long id;
    private User sender;
    private User receiver;
    private String content;
    private LocalDateTime sentAt;
    private boolean readStatus;
    private Product product;

    // Getters and setters
}
