package com.team.ResidentManagement.service;

import com.team.ResidentManagement.entity.Fee;
import org.springframework.stereotype.Service;

@Service
public class WaterUsageFeePolicy implements FeePolicy{
    private final double RATE_PER_UNIT = 2;

    @Override
    public double calculateFee(Fee fee){
        return fee.getAmount() * RATE_PER_UNIT;
    }
}
