package com.amperfume.api.dto.response;

import com.amperfume.api.entity.Address;

import java.math.BigDecimal;

public record AddressResponse(
        Long id,
        String label,
        String fullName,
        String phone,
        String city,
        String neighborhood,
        String details,
        BigDecimal lat,
        BigDecimal lng,
        boolean isDefault
) {
    public static AddressResponse from(Address a) {
        return new AddressResponse(
                a.getId(), a.getLabel(), a.getFullName(), a.getPhone(),
                a.getCity(), a.getNeighborhood(), a.getDetails(),
                a.getLat(), a.getLng(), a.isDefault()
        );
    }
}
