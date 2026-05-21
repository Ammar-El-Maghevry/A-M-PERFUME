package com.amperfume.api.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.Map;

public record SettingsUpdateRequest(@NotEmpty Map<String, String> settings) {}
