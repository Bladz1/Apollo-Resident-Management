package com.team.ResidentManagement.entity;

import com.team.ResidentManagement.enums.ProfileStatus;
import com.team.ResidentManagement.enums.ProfileType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "profile")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User fullname;

    @Column(nullable = false)
    String title;

    @Column(nullable = false)
    String type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProfileStatus status;

    @CreationTimestamp
    LocalDateTime submittedAt;

    @Column(nullable = false)
    String email;

    @Column(nullable = false)
    String phone;

    @Column(nullable = false)
    String  address;

    @Column(nullable = true)
    String content;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<ProfileAttachment> attachments = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch =  FetchType.LAZY)
    List<ProfileHistory> history = new ArrayList<>();
}
