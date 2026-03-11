package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.SystemNews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemNewsRepository extends JpaRepository<SystemNews, String> {
    List<SystemNews> findAllByOrderByCreatedAtDesc();
}
