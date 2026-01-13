package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.Wanted;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WantedRepository extends JpaRepository<Wanted, String>, JpaSpecificationExecutor<Wanted> {

    boolean existsByWantedName(String wantedName);

    Optional<Wanted> findByWantedName(String wantedName);

}
