package com.bitsbid.backend.payload.request;

import lombok.Data;

import java.util.Date;

@Data
public class BidderRequest {

    private Long bidderId;
    private Long bidId;
    private double amount;
}

