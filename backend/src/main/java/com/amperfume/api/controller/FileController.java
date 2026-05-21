package com.amperfume.api.controller;

import com.amperfume.api.dto.response.FileUploadResponse;
import com.amperfume.api.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public FileUploadResponse upload(@RequestParam("file") MultipartFile file,
                                     @RequestParam(value = "folder", required = false) String folder) {
        return fileStorageService.upload(file, folder);
    }
}
