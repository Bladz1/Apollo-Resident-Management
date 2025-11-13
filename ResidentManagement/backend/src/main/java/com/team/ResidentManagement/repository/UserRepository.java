package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository thao tác dữ liệu người dùng.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    /** Kiểm tra sự tồn tại của username để đảm bảo duy nhất. */
    boolean existsByUsername(String username);

    /** Tìm kiếm người dùng theo username phục vụ đăng nhập. */
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
