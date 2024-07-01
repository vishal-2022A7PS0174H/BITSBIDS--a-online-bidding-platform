package com.bitsbid.backend.controllers;

import com.bitsbid.backend.payload.request.ProductRequest;
import com.bitsbid.backend.payload.response.MessageResponse;
import com.bitsbid.backend.repository.BidRepository;
import com.bitsbid.backend.repository.BidderRepository;
import com.bitsbid.backend.repository.ProductRepository;
import com.bitsbid.backend.repository.UserRepository;
import com.bitsbid.backend.entities.Bid;
import com.bitsbid.backend.entities.Bidder;
import com.bitsbid.backend.entities.Product;
import com.bitsbid.backend.entities.User;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private BidderRepository bidderRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createProductWithBid(@RequestParam("file") MultipartFile file,
                                                  @ModelAttribute ProductRequest productRequest) {
        if (productRequest == null || productRequest.getName() == null || productRequest.getAskingPrice() <= 0) {
            return new ResponseEntity<>("Invalid product details", HttpStatus.BAD_REQUEST);
        }

        String fileName = null;
        try {
            fileName = storeFile(file);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        productRequest.setImages(fileName);

        User seller = userRepository.findById(productRequest.getSellerId()).orElse(null);
        if (seller == null) {
            return new ResponseEntity<>("Seller not found", HttpStatus.NOT_FOUND);
        }

        // Create a new product
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setCategory(productRequest.getCategory());
        product.setAskingPrice(productRequest.getAskingPrice());
        product.setMinBidIncrement(productRequest.getMinBidIncrement());
        product.setImages(productRequest.getImages());
        product.setSeller(seller);
        // Save the product and bid
        productRepository.save(product);

        // Create a new bid
        Bid bid = new Bid();
        bid.setSeller(seller);
        bid.setBidAmount(productRequest.getAskingPrice()); // Initial bid amount set to asking price
        bid.setBidClosingDate(productRequest.getBidClosingDate());
        bid.setProduct(product);
        bid.setBidStatus("ACTIVE"); // You may want to set an initial status
        bidRepository.save(bid);

        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessage("Product and Bid created successfully");
        messageResponse.setData(product);
        return new ResponseEntity<>(messageResponse, HttpStatus.CREATED);
    }

    private String storeFile(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path imagePath = Paths.get("src/main/resources/static/images/products");

        if (!Files.exists(imagePath)) {
            Files.createDirectories(imagePath);
        }

        try (InputStream inputStream = file.getInputStream()) {
            Path thumbnailFilePath = imagePath.resolve(fileName);
            Files.copy(inputStream, thumbnailFilePath, StandardCopyOption.REPLACE_EXISTING);
        }

        return fileName;
    }

    @GetMapping("/bid/{id}")
    public ResponseEntity<?> getBidForProduct(@PathVariable Long id) {
        Optional<Bid> optionalBid = bidRepository.findById(id);

        if (optionalBid.isPresent()) {
            Bid bid = optionalBid.get();
            return new ResponseEntity<>(bid, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Bid not found", HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @RequestParam(value = "file", required = false) MultipartFile file,
                                           @ModelAttribute ProductRequest productRequest) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        MessageResponse messageResponse = new MessageResponse();

        if (optionalProduct.isPresent()) {
            Product existingProduct = optionalProduct.get();
            if (file != null && !file.isEmpty()) {
                try {
                    String fileName = storeFile(file);
                    existingProduct.setImages(fileName);
                } catch (IOException e) {
                    System.out.println(e.getMessage());
                    return new ResponseEntity<>("Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            // Update product details
            existingProduct.setName(productRequest.getName());
            existingProduct.setDescription(productRequest.getDescription());
            existingProduct.setCategory(productRequest.getCategory());
            existingProduct.setAskingPrice(productRequest.getAskingPrice());
            existingProduct.setMinBidIncrement(productRequest.getMinBidIncrement());

            // Update bid details (assuming bid details can be updated)
            Bid bid = existingProduct.getBids();
            bid.setBidAmount(productRequest.getAskingPrice()); // Update bid amount if necessary
            bid.setBidClosingDate(productRequest.getBidClosingDate());

            // Save the updated product (and bid, due to cascade)
            productRepository.save(existingProduct);


            messageResponse.setMessage("Product and Bid Updated successfully");
            messageResponse.setData(existingProduct);
            return new ResponseEntity<>(messageResponse, HttpStatus.CREATED);
        } else {
            messageResponse.setMessage("Product and Bid Failed to update");
            return new ResponseEntity<>(messageResponse, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/finalize/{pid}/{bidder_id}/{bidder_amount}")
    public ResponseEntity<?> finalizeBidding(@PathVariable Long pid, @PathVariable Long bidder_id, @PathVariable Long bidder_amount) {
        Bid bid = bidRepository.findByProductId(pid);
        MessageResponse messageResponse = new MessageResponse();

        if (bid != null) {
            bid.setFinalizedAmount(bidder_amount);
            bid.setBidStatus("CLOSED");
            bidRepository.save(bid);

            User seller = userRepository.findById(bid.getSeller().getId()).get();

            User buyer = userRepository.findById(bidder_id).get();
            Bidder bidder = bidderRepository.findByBidAndBidder(bid, buyer);
            bidder.setStatus(true);
            bidderRepository.save(bidder);

            buyer.setCredits(buyer.getCredits()-bidder_amount);
            userRepository.save(buyer);

            seller.setCredits(seller.getCredits()+bidder_amount);
            userRepository.save(seller);

            messageResponse.setMessage("Bid Finalized Successfully");
            return new ResponseEntity<>(messageResponse, HttpStatus.CREATED);
        } else {
            messageResponse.setMessage("Bid Finalization Failed");
            return new ResponseEntity<>(messageResponse, HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to delete a product
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isPresent()) {
            productRepository.deleteById(id);
            return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to get a product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);

        return optionalProduct.map(product -> new ResponseEntity<>(product, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProductsByUser(@PathVariable Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Product> productsByUser = productRepository.findBySeller(user);

            return new ResponseEntity<>(productsByUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/notInSeller/{userId}")
    public ResponseEntity<?> getProductsNotInSeller(@PathVariable Long userId) {
        List<Product> productsNotInSeller = productRepository.findBySellerIdNot(userId);
        return new ResponseEntity<>(productsNotInSeller, HttpStatus.OK);
    }

    @GetMapping("/{pid}/images")
    public ResponseEntity<byte[]> getGalleryImages(@PathVariable Long pid) throws IOException {
        Product products = productRepository.findById(pid).get();
        Path imagePath = Paths.get("src/main/resources/static/images/products/" + products.getImages());
        Resource resource = new UrlResource(imagePath.toUri());
        if (resource.exists() && resource.isReadable()) {
            byte[] data = IOUtils.toByteArray(resource.getInputStream());
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String query, @PathVariable long id) {
        // Implement logic to search for products based on the query
        // You can use productRepository to fetch products matching the query
        List<Product> searchResults = productRepository.findByNameContainingAndSellerIdNot(query, id);
        return new ResponseEntity<>(searchResults, HttpStatus.OK);
    }
}

