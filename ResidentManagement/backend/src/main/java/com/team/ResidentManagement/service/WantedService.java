package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.WantedMapper;
import com.team.ResidentManagement.dto.request.WantedCrimePatchRequest;
import com.team.ResidentManagement.dto.request.WantedRequest;
import com.team.ResidentManagement.dto.request.WantedUpdateRequest;
import com.team.ResidentManagement.dto.response.WantedResponse;
import com.team.ResidentManagement.entity.Wanted;
import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;
import com.team.ResidentManagement.repository.WantedRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Dịch vụ xử lý hồ sơ truy nã và cập nhật danh sách tội danh.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class WantedService {

    /** Repository truy nã. */
    WantedRepository wantedRepository;
    /** Mapper chuyển đổi dữ liệu truy nã. */
    WantedMapper wantedMapper;

    /**
     * Tạo mới hồ sơ truy nã.
     */
    public WantedResponse create(WantedRequest request) {
        Wanted wanted = wantedMapper.toWanted(request);

        return wantedMapper.toWantedResponse(wantedRepository.save(wanted));
    }

    /**
     * Lấy danh sách toàn bộ hồ sơ truy nã.
     */
    public List<WantedResponse> getAll(){
        return wantedRepository.findAll()
                .stream()
                .map(wantedMapper::toWantedResponse)
                .toList();
    }

    /**
     * Lấy chi tiết một hồ sơ truy nã theo ID.
     */
    public WantedResponse getWantedByWantedId(String wantedId){
        Wanted wanted = wantedRepository.findById(wantedId).orElseThrow(() -> new AppException(ErrorCode.WANTED_NOT_FOUND));

        return wantedMapper.toWantedResponse(wanted);
    }

    /** Xoá hồ sơ truy nã theo ID (chưa hiện thực). */
    public void deleteWantedById(String wantedId){}

    /** Xoá toàn bộ hồ sơ truy nã. */
    public void deleteAll() {wantedRepository.deleteAll();}

    /**
     * Cập nhật thông tin cơ bản của hồ sơ truy nã.
     */
    @Transactional
    public WantedResponse updateWanted(String id, WantedUpdateRequest request) {
        Wanted wanted =  wantedRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.WANTED_NOT_FOUND));

        if (request.getBounty() != null) {
            wanted.setBounty(request.getBounty());
        }

        if (request.getLastSeen() != null) {
            wanted.setLastSeen(request.getLastSeen());
        }

        if (request.getImageUrl() != null) {
            wanted.setImageUrl(request.getImageUrl());
        }

        return wantedMapper.toWantedResponse(wantedRepository.save(wanted));
    }

    /**
     * Thêm/bớt danh sách tội danh cho hồ sơ truy nã.
     */
    @Transactional
    public WantedResponse patchCrimes(String id, WantedCrimePatchRequest request) {

        Wanted wanted = wantedRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.WANTED_NOT_FOUND));

        if (wanted.getBounty() == null) wanted.setCrime(new HashSet<>());
        Set<String> crimes = wanted.getCrime();

        Set<String> add = null;
        if (request.getAddCrimes() != null) {
            add = new LinkedHashSet<>();
            for (String crime : request.getAddCrimes()) {
                if (crime != null) {
                    String normalizedCrime = crime.trim();
                    if (!normalizedCrime.isEmpty()) add.add(normalizedCrime);
                }
            }
        }

        Set<String> remove = null;
        if (request.getRemoveCrimes() != null) {
            remove = new LinkedHashSet<>();
            for (String crime : request.getRemoveCrimes()) {
                if (crime != null) {
                    String normalizedCrime = crime.trim();
                    if (!normalizedCrime.isEmpty()) remove.add(normalizedCrime);
                }
            }
        }

        if (Boolean.TRUE.equals(request.getClearCrimes())) {
            crimes.clear();
        }

        if (remove != null && !remove.isEmpty()) {
            crimes.removeAll(remove);
        }

        if (add != null && !add.isEmpty()) {
            crimes.addAll(add);
        }

        return wantedMapper.toWantedResponse(wantedRepository.save(wanted));
    }
}
