package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.BillMapper;
import com.team.ResidentManagement.dto.request.BillRequest;
import com.team.ResidentManagement.dto.response.BillResponse;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;
import com.team.ResidentManagement.repository.BillRepository;
import com.team.ResidentManagement.repository.FeeRepository;
import com.team.ResidentManagement.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillService {
    BillRepository billRepository;
    FeeRepository feeRepository;
    BillMapper billMapper;
    UserRepository userRepository;

    public BillResponse createBill(BillRequest request){
        var bill = billMapper.toBill(request);

        var fees = feeRepository.findAllById(request.getFees());
        bill.setFees(new HashSet<>(fees));

        bill = billRepository.save(bill);
        return billMapper.toBillResponse(bill);
    }

    public List<BillResponse> getAllBills(String userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return user.getBills()
                .stream()
                .map(billMapper::toBillResponse)
                .toList();
    }

    public void deleteBill(@PathVariable String id){
        billRepository.deleteById(id);
    }

}