package com.example.backend.repository;

import com.example.backend.entity.GyroscopeData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GyroscopeRepository extends JpaRepository<GyroscopeData, Long> {
    List<GyroscopeData> findByDeviceId(String deviceId);
    List<GyroscopeData> findByTimestampAfter(LocalDateTime timestamp);

    @Query("SELECT DISTINCT g.deviceId FROM GyroscopeData g")
    List<String> findDistinctDeviceIds();
}