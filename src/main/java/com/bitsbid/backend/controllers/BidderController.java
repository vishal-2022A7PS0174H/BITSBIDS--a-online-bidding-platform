package com.bitsbid.backend.controllers;

import com.bitsbid.backend.entities.Bid;
import com.bitsbid.backend.entities.Bidder;
import com.bitsbid.backend.entities.User;
import com.bitsbid.backend.payload.request.BidderRequest;
import com.bitsbid.backend.payload.response.MessageResponse;
import com.bitsbid.backend.repository.BidRepository;
import com.bitsbid.backend.repository.BidderRepository;
import com.bitsbid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/bidders")
public class BidderController {

    @Autowired
    private BidderRepository bidderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BidRepository bidRepository;

//    @PostMapping
//    public ResponseEntity<?> createBidder(@RequestBody BidderRequest bidderRequest) {
//        if (bidderRequest == null || bidderRequest.getAmount() <= 0) {
//            return new ResponseEntity<>("Invalid bidder details", HttpStatus.BAD_REQUEST);
//        }
//
//        Optional<User> bidderUser = userRepository.findById(bidderRequest.getBidderId());
//        if (bidderUser.isEmpty()) {
//            return new ResponseEntity<>("Bidder not found", HttpStatus.NOT_FOUND);
//        }
//
//        Optional<Bid> bid = bidRepository.findById(bidderRequest.getBidId());
//        if (bid.isEmpty()) {
//            return new ResponseEntity<>("Bid not found", HttpStatus.NOT_FOUND);
//        }
//
//        Bidder bidder = new Bidder();
//        bidder.setBidder(bidderUser.get());
//        bidder.setBid(bid.get());
//        bidder.setAmount(bidderRequest.getAmount());
//        bidder.setBiddingDate(LocalDateTime.now());
//
//        // Save the bidder
//        bidderRepository.save(bidder);
//        MessageResponse messageResponse = new MessageResponse();
//        messageResponse.setMessage("Bid Places successfully");
//        return new ResponseEntity<>(messageResponse, HttpStatus.CREATED);
//    }

    @PostMapping
    public ResponseEntity<?> createBidder(@RequestBody BidderRequest bidderRequest) {
        if (bidderRequest == null || bidderRequest.getAmount() <= 0) {
            return new ResponseEntity<>("Invalid bidder details", HttpStatus.BAD_REQUEST);
        }

        Optional<User> bidderUser = userRepository.findById(bidderRequest.getBidderId());
        if (bidderUser.isEmpty()) {
            return new ResponseEntity<>("Bidder not found", HttpStatus.NOT_FOUND);
        }

        Optional<Bid> bid = bidRepository.findById(bidderRequest.getBidId());
        if (bid.isEmpty()) {
            return new ResponseEntity<>("Bid not found", HttpStatus.NOT_FOUND);
        }

        Bidder existingBidder = bidderRepository.findByBidAndBidder(bid.get(), bidderUser.get());

        if (existingBidder != null) {
            // User has already placed a bid, update with new bid amount
            double newBidAmount = bidderRequest.getAmount();
            double currentBidAmount = existingBidder.getAmount();
            double minimumBidIncrement = bid.get().getProduct().getMinBidIncrement();

            if (newBidAmount < currentBidAmount + minimumBidIncrement) {
                MessageResponse messageResponse = new MessageResponse();
                messageResponse.setMessage("Bid amount must be greater than or equal to the current highest bid plus the minimum bid increment");
                return new ResponseEntity<>(messageResponse, HttpStatus.BAD_REQUEST);
            }

            existingBidder.setAmount(newBidAmount);
            existingBidder.setBiddingDate(LocalDateTime.now());
            bidderRepository.save(existingBidder);

            MessageResponse messageResponse = new MessageResponse();
            messageResponse.setMessage("Bid updated successfully");
            return new ResponseEntity<>(messageResponse, HttpStatus.OK);
        } else {
            // User has not placed a bid, create a new bid
            Bidder newBidder = new Bidder();
            newBidder.setBidder(bidderUser.get());
            newBidder.setBid(bid.get());
            newBidder.setAmount(bidderRequest.getAmount());
            newBidder.setBiddingDate(LocalDateTime.now());

            // Save the new bidder
            bidderRepository.save(newBidder);

            MessageResponse messageResponse = new MessageResponse();
            messageResponse.setMessage("Bid placed successfully");
            return new ResponseEntity<>(messageResponse, HttpStatus.CREATED);
        }
    }


    // Endpoint to get all bidders
    @GetMapping
    public ResponseEntity<List<Bidder>> getAllBidders() {
        List<Bidder> bidders = bidderRepository.findAll();
        return new ResponseEntity<>(bidders, HttpStatus.OK);
    }

    // Endpoint to delete a bidder
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBidder(@PathVariable Long id) {
        Optional<Bidder> optionalBidder = bidderRepository.findById(id);

        if (optionalBidder.isPresent()) {
            bidderRepository.deleteById(id);
            return new ResponseEntity<>("Bidder deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Bidder not found", HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to get a bidder by ID
    @GetMapping("/{id}")
    public ResponseEntity<Bidder> getBidderById(@PathVariable Long id) {
        Optional<Bidder> optionalBidder = bidderRepository.findById(id);

        return optionalBidder.map(bidder -> new ResponseEntity<>(bidder, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Bidder>> getBidderByUserId(@PathVariable Long id) {
        User user = userRepository.findById(id).get();
        List<Bidder> bids = bidderRepository.findByBidder(user);

        return new ResponseEntity<>(bids, HttpStatus.OK);
    }

    // Add an endpoint to update a bidder if needed
}
