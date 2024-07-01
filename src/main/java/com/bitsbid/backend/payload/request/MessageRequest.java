package com.bitsbid.backend.payload.request;

import lombok.Data;

@Data
public class MessageRequest {

    private Long senderId;
    private Long receiverId;
    private String content;
    private Long  productId;

    // Constructors, getters, and setters

    public MessageRequest() {
    }

    public MessageRequest(Long senderId, Long receiverId, String content) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
    }


}
