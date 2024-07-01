package com.bitsbid.backend.repository;

import com.bitsbid.backend.entities.Message;
import com.bitsbid.backend.entities.Product;
import com.bitsbid.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiverOrderBySentAtDesc(User user);

    List<Message> findBySenderAndReceiverOrSenderAndReceiverOrderBySentAtAsc(
            User sender1, User receiver1, User sender2, User receiver2
    );

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :userId OR m.receiver.id = :userId) AND m.product IS NOT NULL")
    List<Message> findChatHistoryWithProductName(@Param("userId") Long userId);

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender = :user AND m.receiver = :selectedUser AND m.product = :product) OR " +
            "(m.sender = :selectedUser AND m.receiver = :user AND m.product = :product) " +
            "ORDER BY m.sentAt ASC")
    List<Message> findBySenderAndReceiverOrSenderAndReceiverAndProductOrderBySentAtAsc(
            User user, User selectedUser, Product product
    );
}
