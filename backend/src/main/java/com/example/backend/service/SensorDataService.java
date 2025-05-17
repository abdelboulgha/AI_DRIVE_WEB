package com.example.backend.service;

import com.example.backend.entity.AccelerometerData;
import com.example.backend.entity.GPSData;
import com.example.backend.entity.GyroscopeData;
import com.example.backend.entity.User;
import com.example.backend.repository.AccelerometerRepository;
import com.example.backend.repository.GPSRepository;
import com.example.backend.repository.GyroscopeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SensorDataService {

    private final AccelerometerRepository accelerometerRepository;
    private final GPSRepository gpsRepository;
    private final GyroscopeRepository gyroscopeRepository;

    @Autowired
    public SensorDataService(AccelerometerRepository accelerometerRepository,
                             GPSRepository gpsRepository,
                             GyroscopeRepository gyroscopeRepository) {
        this.accelerometerRepository = accelerometerRepository;
        this.gpsRepository = gpsRepository;
        this.gyroscopeRepository = gyroscopeRepository;
    }

    // Méthodes pour l'accéléromètre
    public AccelerometerData saveAccelerometerData(AccelerometerData data, User user) {
        // Toujours définir le timestamp côté serveur, quelles que soient les données reçues
        data.setTimestamp(LocalDateTime.now());
        data.setUser(user);
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

    // Méthodes pour le GPS
    public GPSData saveGPSData(GPSData data, User user) {
        if (data.getTimestamp() == null) {
            data.setTimestamp(LocalDateTime.now());
        }
        data.setUser(user);
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

    // Méthodes pour le gyroscope
    public GyroscopeData saveGyroscopeData(GyroscopeData data, User user) {
        if (data.getTimestamp() == null) {
            data.setTimestamp(LocalDateTime.now());
        }
        data.setUser(user);
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
}