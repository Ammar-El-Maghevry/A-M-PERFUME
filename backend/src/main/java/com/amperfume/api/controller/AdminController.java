package com.amperfume.api.controller;

import com.amperfume.api.dto.request.RejectOrderRequest;
import com.amperfume.api.dto.request.SettingsUpdateRequest;
import com.amperfume.api.dto.request.UpdateOrderStatusRequest;
import com.amperfume.api.dto.response.DashboardResponse;
import com.amperfume.api.dto.response.OrderResponse;
import com.amperfume.api.dto.response.PageResponse;
import com.amperfume.api.dto.response.UserResponse;
import com.amperfume.api.enums.OrderStatus;
import com.amperfume.api.service.AdminService;
import com.amperfume.api.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    // --- Dashboard ---
    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return adminService.dashboard();
    }

    // --- Orders ---
    @GetMapping("/orders")
    public PageResponse<OrderResponse> listOrders(@RequestParam(required = false) OrderStatus status,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "20") int size) {
        return orderService.adminList(status, page, size);
    }

    @GetMapping("/orders/{id}")
    public OrderResponse getOrder(@PathVariable Long id) {
        return orderService.adminGet(id);
    }

    @PutMapping("/orders/{id}/confirm")
    public OrderResponse confirmOrder(@PathVariable Long id) {
        return orderService.adminConfirm(id);
    }

    @PutMapping("/orders/{id}/reject")
    public OrderResponse rejectOrder(@PathVariable Long id, @Valid @RequestBody RejectOrderRequest req) {
        return orderService.adminReject(id, req);
    }

    @PutMapping("/orders/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest req) {
        return orderService.adminUpdateStatus(id, req);
    }

    // --- Customers ---
    @GetMapping("/customers")
    public PageResponse<UserResponse> listCustomers(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
        return adminService.listCustomers(page, size);
    }

    @PutMapping("/customers/{id}/toggle-active")
    public UserResponse toggleCustomerActive(@PathVariable Long id) {
        return adminService.toggleCustomerActive(id);
    }

    // --- Settings ---
    @GetMapping("/settings")
    public Map<String, String> getSettings() {
        return adminService.getSettings();
    }

    @PutMapping("/settings")
    public Map<String, String> updateSettings(@Valid @RequestBody SettingsUpdateRequest req) {
        return adminService.updateSettings(req);
    }
}
