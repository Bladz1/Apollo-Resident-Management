package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository thao tác dữ liệu người dùng.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPersonalId(String personalId);
    Optional<User> findByPhoneNumber(String phoneNumber);

    List<User> findByStatus(String status);

    List<User> findByRolesName(String name);
}
