package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeRepository extends JpaRepository<Fee, String> {

}
