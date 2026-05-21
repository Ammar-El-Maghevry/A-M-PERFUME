package com.amperfume.api.service;

import com.amperfume.api.config.AppProperties;
import com.amperfume.api.dto.response.FileUploadResponse;
import com.amperfume.api.exception.BadRequestException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    private final Cloudinary cloudinary;
    private final AppProperties props;

    public FileUploadResponse upload(MultipartFile file, String subfolder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image uploads are allowed");
        }
        String folder = props.getCloudinary().getFolder();
        if (subfolder != null && !subfolder.isBlank()) {
            folder = folder + "/" + subfolder;
        }
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image",
                            "overwrite", true
                    ));
            return new FileUploadResponse(
                    str(result, "secure_url"),
                    str(result, "public_id"),
                    str(result, "format"),
                    asInt(result.get("width")),
                    asInt(result.get("height")),
                    asLong(result.get("bytes"))
            );
        } catch (IOException ex) {
            log.error("Cloudinary upload failed", ex);
            throw new BadRequestException("Upload failed: " + ex.getMessage());
        }
    }

    public void delete(String publicId) {
        if (publicId == null || publicId.isBlank()) return;
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException ex) {
            log.warn("Cloudinary delete failed for {}: {}", publicId, ex.getMessage());
        }
    }

    private static String str(Map<String, Object> m, String k) {
        Object v = m.get(k);
        return v == null ? null : v.toString();
    }
    private static Integer asInt(Object v) {
        return v == null ? null : ((Number) v).intValue();
    }
    private static Long asLong(Object v) {
        return v == null ? null : ((Number) v).longValue();
    }
}
