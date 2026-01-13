package com.team.ResidentManagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(name = "username", unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String username;

    String gender;

    String password;

    LocalDate birthday;

    String email;

    String address;

    String personalId;

    String phoneNumber;

    String avatarUrl;

    String status;

    @ManyToMany
    Set<Role> roles;

    @ManyToMany
    Set<Fee> fees;
}
