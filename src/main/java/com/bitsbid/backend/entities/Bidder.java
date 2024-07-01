package com.bitsbid.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bidders")
public class Bidder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User bidder;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bid_id")
    private Bid bid;

    private double amount;

    private LocalDateTime biddingDate;

    private boolean status;
}
