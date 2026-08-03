package com.shopstack.backend.service;

import com.shopstack.backend.dto.ProductRequest;
import com.shopstack.backend.dto.ProductResponse;
import com.shopstack.backend.entity.Product;
import com.shopstack.backend.entity.User;
import com.shopstack.backend.repository.ProductRepository;
import com.shopstack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public String addProduct(String email, ProductRequest request) {

        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setVendor(vendor);

        productRepository.save(product);

        return "Product Added Successfully";
    }

    public List<ProductResponse> getAllProducts() {

        List<Product> products = productRepository.findAll();

        List<ProductResponse> responseList = new ArrayList<>();

        for (Product product : products) {

            ProductResponse response = new ProductResponse();

            response.setId(product.getId());
            response.setName(product.getName());
            response.setDescription(product.getDescription());
            response.setPrice(product.getPrice());
            response.setStock(product.getStock());
            response.setCategory(product.getCategory());
            response.setImageUrl(product.getImageUrl());
            response.setVendorName(product.getVendor().getName());

            responseList.add(response);
        }

        return responseList;
    }

    public List<ProductResponse> getMyProducts(String email) {

        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        List<Product> products = productRepository.findByVendor(vendor);

        List<ProductResponse> responseList = new ArrayList<>();

        for (Product product : products) {

            ProductResponse response = new ProductResponse();

            response.setId(product.getId());
            response.setName(product.getName());
            response.setDescription(product.getDescription());
            response.setPrice(product.getPrice());
            response.setStock(product.getStock());
            response.setCategory(product.getCategory());
            response.setImageUrl(product.getImageUrl());
            response.setVendorName(product.getVendor().getName());

            responseList.add(response);
        }

        return responseList;
    }

    public String updateProduct(Long id, String email, ProductRequest request) {

        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Product product = productRepository.findByIdAndVendor(id, vendor)
                .orElseThrow(() -> new RuntimeException("Product not found or access denied"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        productRepository.save(product);

        return "Product Updated Successfully";
    }

    public String deleteProduct(Long id, String email) {

        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Product product = productRepository.findByIdAndVendor(id, vendor)
                .orElseThrow(() -> new RuntimeException("Product not found or access denied"));

        productRepository.delete(product);

        return "Product Deleted Successfully";
    }

    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setCategory(product.getCategory());
        response.setImageUrl(product.getImageUrl());
        response.setVendorName(product.getVendor().getName());

        return response;
    }
}