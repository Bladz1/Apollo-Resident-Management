package com.team.ResidentManagement.service;

import com.team.ResidentManagement.entity.Fee;

public interface FeePolicy {
    public double calculateFee(Fee fee);
}
