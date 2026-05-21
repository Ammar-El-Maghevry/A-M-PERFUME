package com.amperfume.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "site_settings", uniqueConstraints = {
        @UniqueConstraint(name = "uq_setting_key", columnNames = "settingKey")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String settingKey;

    @Column(columnDefinition = "TEXT")
    private String value;

    @Column(length = 255)
    private String description;

    @UpdateTimestamp
    private Instant updatedAt;
}
