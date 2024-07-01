package com.bitsbid.backend.repository;

import com.bitsbid.backend.entities.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid, Long> {

    Bid findByProductId(Long productId);
}
