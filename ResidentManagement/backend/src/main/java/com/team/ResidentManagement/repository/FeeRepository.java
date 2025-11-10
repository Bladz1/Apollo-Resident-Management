package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository quản lý thông tin các khoản phí.
 */
@Repository
public interface FeeRepository extends JpaRepository<Fee, String> {

}
