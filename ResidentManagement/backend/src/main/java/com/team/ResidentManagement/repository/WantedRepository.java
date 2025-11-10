package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.Wanted;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository truy xuất dữ liệu hồ sơ truy nã, hỗ trợ cả query động bằng Specification.
 */
@Repository
public interface WantedRepository extends JpaRepository<Wanted, String>, JpaSpecificationExecutor<Wanted> {

    /** Kiểm tra xem tên truy nã đã tồn tại. */
    boolean existsByWantedName(String wantedName);

    /** Tìm hồ sơ dựa trên tên truy nã chính xác. */
    Optional<Wanted> findByWantedName(String wantedName);

}
