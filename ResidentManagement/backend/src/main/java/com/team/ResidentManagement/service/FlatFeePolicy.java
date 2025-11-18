package com.team.ResidentManagement.service;

import com.team.ResidentManagement.entity.Fee;
import org.springframework.stereotype.Service;

@Service
public class FlatFeePolicy implements FeePolicy{
    @Override
    public double calculateFee(Fee fee){
        return 50;
    }
}
