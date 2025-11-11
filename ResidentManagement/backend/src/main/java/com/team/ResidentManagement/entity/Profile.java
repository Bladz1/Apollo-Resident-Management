package com.team.ResidentManagement.entity;

import com.team.ResidentManagement.enums.ProfileStatus;
import com.team.ResidentManagement.enums.ProfileType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(nullable = false)
    String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProfileType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProfileStatus status;

    @CreationTimestamp
    LocalDateTime submittedAt;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    List<ProfileAttachment> attachments;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    List<ProfileHistory> history;
}
