package com.example.backend.repository;

import com.example.backend.entity.GPSData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GPSRepository extends JpaRepository<GPSData, Long> {
    List<GPSData> findByDeviceId(String deviceId);
    List<GPSData> findByTimestampAfter(LocalDateTime timestamp);

    @Query("SELECT DISTINCT g.deviceId FROM GPSData g")
    List<String> findDistinctDeviceIds();
}