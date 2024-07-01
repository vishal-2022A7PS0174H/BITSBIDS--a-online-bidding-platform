package com.bitsbid.backend.repository;

import com.bitsbid.backend.entities.Bid;
import com.bitsbid.backend.entities.Bidder;
import com.bitsbid.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidderRepository extends JpaRepository<Bidder, Long> {
    Bidder findByBidAndBidder(Bid bid, User user);
    List<Bidder> findByBidder(User user);
}
