package com.example.backend.repository;

import com.example.backend.entity.AccelerometerData;
import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AccelerometerRepository extends JpaRepository<AccelerometerData, Long> {
    List<AccelerometerData> findByDeviceId(String deviceId);
    List<AccelerometerData> findByTimestampAfter(LocalDateTime timestamp);
    List<AccelerometerData> findByUser(User user);
    List<AccelerometerData> findByUserAndDeviceId(User user, String deviceId);
    List<AccelerometerData> findByUserAndTimestampAfter(User user, LocalDateTime timestamp);

    // Méthode ajoutée pour résoudre l'erreur
    List<AccelerometerData> findByVehicle(Vehicle vehicle);
    List<AccelerometerData> findByVehicleAndTimestampAfter(Vehicle vehicle, LocalDateTime timestamp);

    @Query("SELECT DISTINCT a.deviceId FROM AccelerometerData a")
    List<String> findDistinctDeviceIds();

    @Query("SELECT DISTINCT a.deviceId FROM AccelerometerData a WHERE a.user = ?1")
    List<String> findDistinctDeviceIdsByUser(User user);

    @Query("SELECT DISTINCT a.deviceId FROM AccelerometerData a WHERE a.vehicle = ?1")
    List<String> findDistinctDeviceIdsByVehicle(Vehicle vehicle);
}