package com.amperfume.api.controller;

import com.amperfume.api.dto.request.AddressRequest;
import com.amperfume.api.dto.request.ChangePasswordRequest;
import com.amperfume.api.dto.request.UpdateProfileRequest;
import com.amperfume.api.dto.response.AddressResponse;
import com.amperfume.api.dto.response.UserResponse;
import com.amperfume.api.security.SecurityUtils;
import com.amperfume.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse me() {
        return userService.me(SecurityUtils.currentUserId());
    }

    @PutMapping("/me")
    public UserResponse updateProfile(@Valid @RequestBody UpdateProfileRequest req) {
        return userService.updateProfile(SecurityUtils.currentUserId(), req);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        userService.changePassword(SecurityUtils.currentUserId(), req);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/addresses")
    public List<AddressResponse> listAddresses() {
        return userService.listAddresses(SecurityUtils.currentUserId());
    }

    @PostMapping("/me/addresses")
    public ResponseEntity<AddressResponse> createAddress(@Valid @RequestBody AddressRequest req) {
        return ResponseEntity.status(201).body(userService.createAddress(SecurityUtils.currentUserId(), req));
    }

    @PutMapping("/me/addresses/{id}")
    public AddressResponse updateAddress(@PathVariable Long id, @Valid @RequestBody AddressRequest req) {
        return userService.updateAddress(SecurityUtils.currentUserId(), id, req);
    }

    @PutMapping("/me/addresses/{id}/default")
    public AddressResponse setDefault(@PathVariable Long id) {
        return userService.setDefault(SecurityUtils.currentUserId(), id);
    }

    @DeleteMapping("/me/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        userService.deleteAddress(SecurityUtils.currentUserId(), id);
        return ResponseEntity.noContent().build();
    }
}
