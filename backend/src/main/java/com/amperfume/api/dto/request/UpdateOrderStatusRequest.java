package com.amperfume.api.dto.request;

import com.amperfume.api.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(@NotNull OrderStatus status, String note) {}
