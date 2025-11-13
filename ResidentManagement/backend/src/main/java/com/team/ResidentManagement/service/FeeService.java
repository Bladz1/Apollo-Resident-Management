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

import java.util.List;

/**
 * Nghiệp vụ quản lý các khoản phí và thao tác thanh toán của cư dân.
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class FeeService {

    /** Repository khoản phí. */
    FeeRepository feeRepository;
    /** Mapper chuyển đổi Fee. */
    FeeMapper feeMapper;
    /** Repository người dùng để ràng buộc phí. */
    UserRepository userRepository;

    /**
     * Tạo khoản phí mới (chỉ dành cho admin).
     */
    @PreAuthorize("{hasRole('ADMIN')}")
    public FeeResponse create(FeeRequest request){
        Fee fee = feeMapper.toFee(request);

        return feeMapper.toFeeResponse(feeRepository.save(fee));
    }

    /**
     * Lấy toàn bộ khoản phí trong hệ thống.
     */
    public List<FeeResponse> getAll(){
        return feeRepository.findAll()
                .stream()
                .map(feeMapper::toFeeResponse)
                .toList();
    }

    /**
     * Lấy danh sách phí gắn với một người dùng cụ thể.
     */
    public List<FeeResponse> getAllFromUser(String userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return user.getFees()
                .stream()
                .map(feeMapper::toFeeResponse)
                .toList();
    }

    /** Xoá một khoản phí theo ID. */
    public void delete(String id){
        feeRepository.deleteById(id);
    }

    /** Xoá toàn bộ khoản phí. */
    public void deleteAll(){
        feeRepository.deleteAll();
    }

    /**
     * Cập nhật trạng thái thanh toán của phí cho người dùng hiện tại.
     */
    public FeeResponse updateFee(FeeUpdateRequest request){
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Fee fee = feeRepository.findById(request.getId()).orElseThrow(() -> new AppException(ErrorCode.FEE_NOT_FOUND));

        if (user.getFees().contains(fee)){
            // Khi cư dân xác nhận đã đóng phí, đặt amount về 0 để biểu thị đã thanh toán.
            fee.setAmount(0);
        }
        else throw new AppException(ErrorCode.FEE_NOT_BELONG_TO_USER);

        return feeMapper.toFeeResponse(feeRepository.save(fee));
    }
}
