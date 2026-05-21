package com.amperfume.api.dto.response;

public record FileUploadResponse(
        String url,
        String publicId,
        String format,
        Integer width,
        Integer height,
        Long bytes
) {}
