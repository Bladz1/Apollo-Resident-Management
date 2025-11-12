package com.team.ResidentManagement.entity;

import com.team.ResidentManagement.enums.ProfileAction;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "profile_history")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    Profile profile;

    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProfileAction action;

    @CreationTimestamp
    LocalDateTime createdDate;

}
