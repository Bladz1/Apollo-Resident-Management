package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.FeeMapper;
import com.team.ResidentManagement.dto.request.FeeRequest;
import com.team.ResidentManagement.dto.response.FeeResponse;
import com.team.ResidentManagement.entity.Fee;
import com.team.ResidentManagement.repository.FeeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class FeeService {
    FeeRepository feeRepository;
    FeeMapper feeMapper;

    public FeeResponse create(FeeRequest request){
        Fee fee = feeMapper.toFee(request);

        return feeMapper.toFeeResponse(feeRepository.save(fee));
    }

    public List<FeeResponse> getAll(){
        var fees = feeRepository.findAll();
        return fees.stream().map(feeMapper::toFeeResponse).toList();
    }

    public void delete(String fee){
        feeRepository.deleteById(fee);
    }
}
