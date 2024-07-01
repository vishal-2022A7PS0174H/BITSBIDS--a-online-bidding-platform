package com.bitsbid.backend.payload.request;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class ProductRequest {

    private String name;
    private String description;
    private String category;
    private double askingPrice;
    private double minBidIncrement;
    private String images;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:00")
    private LocalDateTime bidClosingDate;
    private Long sellerId;
}
