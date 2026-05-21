package com.amperfume.api.controller;

import com.amperfume.api.dto.request.CreateOrderRequest;
import com.amperfume.api.dto.response.OrderResponse;
import com.amperfume.api.dto.response.PageResponse;
import com.amperfume.api.security.SecurityUtils;
import com.amperfume.api.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req) {
        return ResponseEntity.status(201).body(orderService.createOrder(req));
    }

    @PostMapping(value = "/{id}/proof", consumes = "multipart/form-data")
    public OrderResponse uploadProof(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return orderService.uploadProof(id, file);
    }

    @GetMapping("/my")
    public PageResponse<OrderResponse> myOrders(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size) {
        return orderService.myOrders(SecurityUtils.currentUserId(), page, size);
    }

    @GetMapping("/my/{id}")
    public OrderResponse myOrder(@PathVariable Long id) {
        return orderService.myOrder(SecurityUtils.currentUserId(), id);
    }

    @PutMapping("/my/{id}/cancel")
    public OrderResponse cancelMyOrder(@PathVariable Long id) {
        return orderService.cancelMyOrder(SecurityUtils.currentUserId(), id);
    }
}
