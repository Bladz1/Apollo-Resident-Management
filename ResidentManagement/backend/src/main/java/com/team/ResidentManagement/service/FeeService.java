package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.FeeMapper;
import com.team.ResidentManagement.dto.request.FeeRequest;
import com.team.ResidentManagement.dto.request.FeeUpdateRequest;
import com.team.ResidentManagement.dto.response.FeeResponse;
import com.team.ResidentManagement.entity.Fee;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;
import com.team.ResidentManagement.repository.FeeRepository;
import com.team.ResidentManagement.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class FeeService {

    FeeRepository feeRepository;
    FeeMapper feeMapper;
    UserRepository userRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public FeeResponse create(FeeRequest request){

        Fee fee = feeMapper.toFee(request);
        Fee savedFee = feeRepository.save(fee);

        if (request.getPersonalId() != null && !request.getPersonalId().isBlank()) {
            User user = userRepository.findByPersonalId(request.getPersonalId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            HashSet<Fee> fees = user.getFees() == null ? new HashSet<>() : new HashSet<>(user.getFees());
            fees.add(savedFee);
            user.setFees(fees);
            userRepository.save(user);
        }

        return feeMapper.toFeeResponse(savedFee);
    }

    public List<FeeResponse> getAll(){
        return feeRepository.findAll()
                .stream()
                .map(feeMapper::toFeeResponse)
                .toList();
    }

    public List<FeeResponse> getAllFromUser(String userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return user.getFees()
                .stream()
                .map(feeMapper::toFeeResponse)
                .toList();
    }

    public void delete(String id){
        feeRepository.deleteById(id);
    }

    public void deleteAll(){
        feeRepository.deleteAll();
    }

    public FeeResponse updateFee(FeeUpdateRequest request){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Fee fee = feeRepository.findById(request.getId()).orElseThrow(() -> new AppException(ErrorCode.FEE_NOT_FOUND));

        if (user.getFees().contains(fee)){
            fee.setAmount(0);
        }
        else throw new AppException(ErrorCode.FEE_NOT_BELONG_TO_USER);

        return feeMapper.toFeeResponse(feeRepository.save(fee));
    }
}
