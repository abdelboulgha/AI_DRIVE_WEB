package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SensorDataService {

    private final AccelerometerRepository accelerometerRepository;
    private final GPSRepository gpsRepository;
    private final GyroscopeRepository gyroscopeRepository;
    private final VehicleRepository vehicleRepository;

    @Autowired
    public SensorDataService(AccelerometerRepository accelerometerRepository,
                             GPSRepository gpsRepository,
                             GyroscopeRepository gyroscopeRepository,
                             VehicleRepository vehicleRepository) {
        this.accelerometerRepository = accelerometerRepository;
        this.gpsRepository = gpsRepository;
        this.gyroscopeRepository = gyroscopeRepository;
        this.vehicleRepository = vehicleRepository;
    }

    // Méthodes pour l'accéléromètre
    public AccelerometerData saveAccelerometerData(AccelerometerData data, User user, Long vehicleId) {
        data.setTimestamp(LocalDateTime.now());
        data.setUser(user);

        if (vehicleId != null) {
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            data.setVehicle(vehicle);
        } else if (user.getVehicles() != null && !user.getVehicles().isEmpty()) {
            // Par défaut, on assigne le premier véhicule de l'utilisateur
            data.setVehicle(user.getVehicles().get(0));
        }

        return accelerometerRepository.save(data);
    }

    public AccelerometerData saveAccelerometerData(AccelerometerData data, User user) {
        data.setTimestamp(LocalDateTime.now());
        data.setUser(user);

        if (user.getVehicles() != null && !user.getVehicles().isEmpty()) {
            // Par défaut, on assigne le premier véhicule de l'utilisateur
            data.setVehicle(user.getVehicles().get(0));
        }

        return accelerometerRepository.save(data);
    }

    public List<AccelerometerData> getAllAccelerometerData() {
        return accelerometerRepository.findAll();
    }

    public List<AccelerometerData> getAccelerometerDataByUser(User user) {
        return accelerometerRepository.findByUser(user);
    }

    public List<AccelerometerData> getAccelerometerDataByDeviceId(String deviceId) {
        return accelerometerRepository.findByDeviceId(deviceId);
    }

    public List<AccelerometerData> getAccelerometerDataByUserAndDeviceId(User user, String deviceId) {
        return accelerometerRepository.findByUserAndDeviceId(user, deviceId);
    }

    public List<AccelerometerData> getAccelerometerDataByVehicle(Vehicle vehicle) {
        return accelerometerRepository.findByVehicle(vehicle);
    }

    // Méthodes pour le GPS
    public GPSData saveGPSData(GPSData data, User user, Long vehicleId) {
        if (data.getTimestamp() == null) {
            data.setTimestamp(LocalDateTime.now());
        }
        data.setUser(user);

        if (vehicleId != null) {
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            data.setVehicle(vehicle);
        } else if (user.getVehicles() != null && !user.getVehicles().isEmpty()) {
            // Par défaut, on assigne le premier véhicule de l'utilisateur
            data.setVehicle(user.getVehicles().get(0));
        }

        return gpsRepository.save(data);
    }

    public GPSData saveGPSData(GPSData data, User user) {
        if (data.getTimestamp() == null) {
            data.setTimestamp(LocalDateTime.now());
        }
        data.setUser(user);

        if (user.getVehicles() != null && !user.getVehicles().isEmpty()) {
            // Par défaut, on assigne le premier véhicule de l'utilisateur
            data.setVehicle(user.getVehicles().get(0));
        }

        return gpsRepository.save(data);
    }

    public List<GPSData> getAllGPSData() {
        return gpsRepository.findAll();
    }

    public List<GPSData> getGPSDataByUser(User user) {
        return gpsRepository.findByUser(user);
    }

    public List<GPSData> getGPSDataByDeviceId(String deviceId) {
        return gpsRepository.findByDeviceId(deviceId);
    }

    public List<GPSData> getGPSDataByUserAndDeviceId(User user, String deviceId) {
        return gpsRepository.findByUserAndDeviceId(user, deviceId);
    }

    public List<GPSData> getGPSDataByVehicle(Vehicle vehicle) {
        return gpsRepository.findByVehicle(vehicle);
    }

    // Méthodes pour le gyroscope
    public GyroscopeData saveGyroscopeData(GyroscopeData data, User user, Long vehicleId) {
        if (data.getTimestamp() == null) {
            data.setTimestamp(LocalDateTime.now());
        }
        data.setUser(user);

        if (vehicleId != null) {
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            data.setVehicle(vehicle);
        } else if (user.getVehicles() != null && !user.getVehicles().isEmpty()) {
            // Par défaut, on assigne le premier véhicule de l'utilisateur
            data.setVehicle(user.getVehicles().get(0));
        }

        return gyroscopeRepository.save(data);
    }

    public GyroscopeData saveGyroscopeData(GyroscopeData data, User user) {
        if (data.getTimestamp() == null) {
            data.setTimestamp(LocalDateTime.now());
        }
        data.setUser(user);

        if (user.getVehicles() != null && !user.getVehicles().isEmpty()) {
            // Par défaut, on assigne le premier véhicule de l'utilisateur
            data.setVehicle(user.getVehicles().get(0));
        }

        return gyroscopeRepository.save(data);
    }

    public List<GyroscopeData> getAllGyroscopeData() {
        return gyroscopeRepository.findAll();
    }

    public List<GyroscopeData> getGyroscopeDataByUser(User user) {
        return gyroscopeRepository.findByUser(user);
    }

    public List<GyroscopeData> getGyroscopeDataByDeviceId(String deviceId) {
        return gyroscopeRepository.findByDeviceId(deviceId);
    }

    public List<GyroscopeData> getGyroscopeDataByUserAndDeviceId(User user, String deviceId) {
        return gyroscopeRepository.findByUserAndDeviceId(user, deviceId);
    }

    public List<GyroscopeData> getGyroscopeDataByVehicle(Vehicle vehicle) {
        return gyroscopeRepository.findByVehicle(vehicle);
    }
}