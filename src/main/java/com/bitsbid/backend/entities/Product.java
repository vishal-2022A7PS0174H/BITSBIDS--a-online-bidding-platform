package com.bitsbid.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String category;

    private double askingPrice;

    private double minBidIncrement;

    private String images; // Storing image paths

    @OneToOne(mappedBy = "product")
    private Bid bids;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User seller;

}
