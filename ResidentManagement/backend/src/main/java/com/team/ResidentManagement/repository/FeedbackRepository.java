package com.team.ResidentManagement.repository;

import com.team.ResidentManagement.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, String> {
    public List<Feedback> findByUserId(String userId);
}
