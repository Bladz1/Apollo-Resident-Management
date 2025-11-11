package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository cho phép thao tác CRUD với bảng quyền.
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {

}
