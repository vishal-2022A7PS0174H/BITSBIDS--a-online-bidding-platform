package com.bitsbid.backend.controllers;

import com.bitsbid.backend.entities.Message;
import com.bitsbid.backend.entities.Product;
import com.bitsbid.backend.entities.User;
import com.bitsbid.backend.payload.request.MessageRequest;
import com.bitsbid.backend.payload.response.MessageDTO;
import com.bitsbid.backend.repository.MessageRepository;
import com.bitsbid.backend.repository.ProductRepository;
import com.bitsbid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest messageRequest) {
        // Validate the request
        if (messageRequest == null || messageRequest.getContent().isBlank()) {
            return new ResponseEntity<>("Message content cannot be empty", HttpStatus.BAD_REQUEST);
        }

        // Get the sender and receiver users
        Optional<User> senderOptional = userRepository.findById(messageRequest.getSenderId());
        Optional<User> receiverOptional = userRepository.findById(messageRequest.getReceiverId());
        Product product = productRepository.findById(messageRequest.getProductId()).get();
        if (senderOptional.isEmpty() || receiverOptional.isEmpty()) {
            return new ResponseEntity<>("Sender or receiver not found", HttpStatus.NOT_FOUND);
        }

        User sender = senderOptional.get();
        User receiver = receiverOptional.get();

        // Create a new message
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(messageRequest.getContent());
        message.setProduct(product);
        message.setSentAt(LocalDateTime.now());
        message.setReadStatus(false); // Assuming the message is initially unread

        // Save the message
        messageRepository.save(message);

        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }

//    @GetMapping("/inbox/{userId}")
//    public ResponseEntity<?> getInbox(@PathVariable Long userId) {
//        // Validate the user
//        Optional<User> userOptional = userRepository.findById(userId);
//
//        if (userOptional.isEmpty()) {
//            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
//        }
//        User user = userOptional.get();
//        // Get the messages where the user is the receiver
//        List<Message> inbox = messageRepository.findByReceiverOrderBySentAtDesc(user);
//        return new ResponseEntity<>(inbox, HttpStatus.OK);
//    }

    @GetMapping("/inbox/{userId}")
    public ResponseEntity<?> getInbox(@PathVariable Long userId) {
        // Validate the user
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        User user = userOptional.get();

        // Get the messages where the user is the receiver
        List<Message> inbox = messageRepository.findByReceiverOrderBySentAtDesc(user);

        // Map the messages to a DTO (Data Transfer Object) for the response
        List<MessageDTO> inboxDTO = inbox.stream().map(this::mapToMessageDTO).collect(Collectors.toList());

        return new ResponseEntity<>(inboxDTO, HttpStatus.OK);
    }

    private MessageDTO mapToMessageDTO(Message message) {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setId(message.getId());
        messageDTO.setSender(message.getSender());
        messageDTO.setReceiver(message.getReceiver());
        messageDTO.setContent(message.getContent());
        messageDTO.setSentAt(message.getSentAt());
        messageDTO.setReadStatus(message.isReadStatus());
        messageDTO.setProduct(message.getProduct());
        return messageDTO;
    }


    @GetMapping("/history/{userId}/{selectedUserId}/{productId}")
    public ResponseEntity<?> getChatHistory(
            @PathVariable Long userId,
            @PathVariable Long selectedUserId,
            @PathVariable Long productId
    ) {
        // Validate users and product
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<User> selectedUserOptional = userRepository.findById(selectedUserId);
        Optional<Product> productOptional = productRepository.findById(productId);

        if (userOptional.isEmpty() || selectedUserOptional.isEmpty() || productOptional.isEmpty()) {
            return new ResponseEntity<>("User, selected user, or product not found", HttpStatus.NOT_FOUND);
        }

        User user = userOptional.get();
        User selectedUser = selectedUserOptional.get();
        Product product = productOptional.get();

        // Get the messages where the user is the sender or receiver, and related to the specified product
        List<Message> chatHistory = messageRepository
                .findBySenderAndReceiverOrSenderAndReceiverAndProductOrderBySentAtAsc(
                        user, selectedUser, product);

        return new ResponseEntity<>(chatHistory, HttpStatus.OK);
    }

    @GetMapping("/inbox-with-product/{userId}")
    public ResponseEntity<List<Message>> getChatHistoryWithProductName(@PathVariable Long userId) {
        List<Message> chatHistory = messageRepository.findChatHistoryWithProductName(userId);
        return new ResponseEntity<>(chatHistory, HttpStatus.OK);
    }
}
