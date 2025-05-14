package com.example.backend.repository;

import com.example.backend.entity.AccelerometerData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AccelerometerRepository extends JpaRepository<AccelerometerData, Long> {
    List<AccelerometerData> findByDeviceId(String deviceId);
    List<AccelerometerData> findByTimestampAfter(LocalDateTime timestamp);

    @Query("SELECT DISTINCT a.deviceId FROM AccelerometerData a")
    List<String> findDistinctDeviceIds();
}