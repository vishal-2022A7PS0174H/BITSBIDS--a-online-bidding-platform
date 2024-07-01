package com.bitsbid.backend.repository;

import com.bitsbid.backend.entities.Product;
import com.bitsbid.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
   List<Product> findBySeller(User user);
   List<Product> findBySellerIdNot(Long seller_id);

   List<Product> findByNameContainingAndSellerIdNot(String productName, Long seller_id);
}
