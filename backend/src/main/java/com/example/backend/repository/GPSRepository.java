package com.example.backend.repository;

import com.example.backend.entity.GPSData;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GPSRepository extends JpaRepository<GPSData, Long> {
    List<GPSData> findByDeviceId(String deviceId);
    List<GPSData> findByTimestampAfter(LocalDateTime timestamp);
    List<GPSData> findByUser(User user);
    List<GPSData> findByUserAndDeviceId(User user, String deviceId);
    List<GPSData> findByUserAndTimestampAfter(User user, LocalDateTime timestamp);

    @Query("SELECT DISTINCT g.deviceId FROM GPSData g")
    List<String> findDistinctDeviceIds();

    @Query("SELECT DISTINCT g.deviceId FROM GPSData g WHERE g.user = ?1")
    List<String> findDistinctDeviceIdsByUser(User user);
}