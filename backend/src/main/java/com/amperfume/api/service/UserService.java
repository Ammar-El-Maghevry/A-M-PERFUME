package com.amperfume.api.service;

import com.amperfume.api.dto.request.AddressRequest;
import com.amperfume.api.dto.request.ChangePasswordRequest;
import com.amperfume.api.dto.request.UpdateProfileRequest;
import com.amperfume.api.dto.response.AddressResponse;
import com.amperfume.api.dto.response.UserResponse;
import com.amperfume.api.entity.Address;
import com.amperfume.api.entity.User;
import com.amperfume.api.exception.BadRequestException;
import com.amperfume.api.exception.NotFoundException;
import com.amperfume.api.repository.AddressRepository;
import com.amperfume.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse me(Long userId) {
        return UserResponse.from(loadUser(userId));
    }

    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest req) {
        User u = loadUser(userId);
        u.setFullName(req.fullName().trim());
        u.setPhone(req.phone() == null ? null : req.phone().trim());
        return UserResponse.from(userRepository.save(u));
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest req) {
        User u = loadUser(userId);
        if (!passwordEncoder.matches(req.currentPassword(), u.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }
        u.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        userRepository.save(u);
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> listAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescIdAsc(userId).stream()
                .map(AddressResponse::from).toList();
    }

    @Transactional
    public AddressResponse createAddress(Long userId, AddressRequest req) {
        User u = loadUser(userId);
        boolean makeDefault = Boolean.TRUE.equals(req.isDefault())
                || addressRepository.findByUserIdOrderByIsDefaultDescIdAsc(userId).isEmpty();
        if (makeDefault) addressRepository.clearDefaultsForUser(userId);
        Address a = Address.builder()
                .user(u)
                .label(req.label())
                .fullName(req.fullName())
                .phone(req.phone())
                .city(req.city())
                .neighborhood(req.neighborhood())
                .details(req.details())
                .lat(req.lat())
                .lng(req.lng())
                .isDefault(makeDefault)
                .build();
        return AddressResponse.from(addressRepository.save(a));
    }

    @Transactional
    public AddressResponse updateAddress(Long userId, Long id, AddressRequest req) {
        Address a = loadAddress(userId, id);
        a.setLabel(req.label());
        a.setFullName(req.fullName());
        a.setPhone(req.phone());
        a.setCity(req.city());
        a.setNeighborhood(req.neighborhood());
        a.setDetails(req.details());
        a.setLat(req.lat());
        a.setLng(req.lng());
        if (Boolean.TRUE.equals(req.isDefault())) {
            addressRepository.clearDefaultsForUser(userId);
            a.setDefault(true);
        }
        return AddressResponse.from(addressRepository.save(a));
    }

    @Transactional
    public AddressResponse setDefault(Long userId, Long id) {
        Address a = loadAddress(userId, id);
        addressRepository.clearDefaultsForUser(userId);
        a.setDefault(true);
        return AddressResponse.from(addressRepository.save(a));
    }

    @Transactional
    public void deleteAddress(Long userId, Long id) {
        Address a = loadAddress(userId, id);
        addressRepository.delete(a);
    }

    private User loadUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private Address loadAddress(Long userId, Long id) {
        return addressRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Address not found"));
    }
}
