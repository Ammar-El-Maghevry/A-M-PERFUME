package com.amperfume.api.dto.request;

import com.amperfume.api.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateOrderRequest(
        @Size(max = 128) String guestName,
        @Size(max = 32) String guestPhone,
        @Email @Size(max = 191) String guestEmail,
        Long addressId,
        @Valid AddressRequest newAddress,
        @NotNull PaymentMethod paymentMethod,
        /** Optional for logged-in users (uses cart). Guests must supply items. */
        @Valid List<GuestOrderItem> items,
        @Size(max = 191) String proofNote
) {
    public record GuestOrderItem(@NotNull Long productId,
                                 @NotNull @jakarta.validation.constraints.Min(1) Integer quantity) {}
}
