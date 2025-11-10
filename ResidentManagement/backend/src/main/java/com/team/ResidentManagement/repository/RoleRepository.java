package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository quản lý bảng vai trò.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

}
