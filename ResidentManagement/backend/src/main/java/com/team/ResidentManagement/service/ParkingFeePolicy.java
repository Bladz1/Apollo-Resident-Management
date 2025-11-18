package com.team.ResidentManagement.service;

import com.team.ResidentManagement.entity.Fee;
import org.springframework.stereotype.Service;

@Service
public class ParkingFeePolicy implements FeePolicy{
    private final int HOURLY_RATE = 5;

    @Override
    public double calculateFee(Fee fee){
        return fee.getAmount() * HOURLY_RATE;
    }
}
