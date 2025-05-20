package com.example.backend.controller;

import com.example.backend.entity.*;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensor")
@CrossOrigin(origins = "*")
public class SensorDataController {

    private final SensorDataService sensorDataService;
    private final AuthService authService;
    private VehicleRepository vehicleRepository;

    @Autowired
    public SensorDataController(SensorDataService sensorDataService, AuthService authService, VehicleRepository vehicleRepository) {
        this.sensorDataService = sensorDataService;
        this.authService = authService;
        this.vehicleRepository=vehicleRepository;
    }


    @PostMapping("/accelerometer")
    public ResponseEntity<AccelerometerData> saveAccelerometerData(
            @RequestBody AccelerometerData data,
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        AccelerometerData savedData = sensorDataService.saveAccelerometerData(data, user);
        return new ResponseEntity<>(savedData, HttpStatus.CREATED);
    }

    @GetMapping("/accelerometer")
    public ResponseEntity<List<AccelerometerData>> getAllAccelerometerData(
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        List<AccelerometerData> data = sensorDataService.getAccelerometerDataByUser(user);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/accelerometer/{deviceId}")
    public ResponseEntity<List<AccelerometerData>> getAccelerometerDataByDeviceId(
            @PathVariable String deviceId,
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        List<AccelerometerData> data = sensorDataService.getAccelerometerDataByUserAndDeviceId(user, deviceId);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @PostMapping("/gps")
    public ResponseEntity<GPSData> saveGPSData(
            @RequestBody GPSData data,
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        GPSData savedData = sensorDataService.saveGPSData(data, user);
        return new ResponseEntity<>(savedData, HttpStatus.CREATED);
    }

    // Ajoutez cette méthode dans SensorDataController.java
    @GetMapping("/accelerometer/vehicle/{vehicleId}")
    public ResponseEntity<List<AccelerometerData>> getAccelerometerDataByVehicleId(@PathVariable Long vehicleId) {
        try {
            // Récupérer le véhicule par ID
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

            // Récupérer les données d'accéléromètre pour ce véhicule
            List<AccelerometerData> data = sensorDataService.getAccelerometerDataByVehicle(vehicle);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/gps/vehicle/{vehicleId}")
    public ResponseEntity<List<GPSData>> getGPSDataByVehicleId(@PathVariable Long vehicleId) {
        try {
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

            List<GPSData> data = sensorDataService.getGPSDataByVehicle(vehicle);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/gyroscope/vehicle/{vehicleId}")
    public ResponseEntity<List<GyroscopeData>> getGyroscopeDataByVehicleId(@PathVariable Long vehicleId) {
        try {
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

            List<GyroscopeData> data = sensorDataService.getGyroscopeDataByVehicle(vehicle);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/gps")
    public ResponseEntity<List<GPSData>> getAllGPSData(
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        List<GPSData> data = sensorDataService.getGPSDataByUser(user);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/gps/{deviceId}")
    public ResponseEntity<List<GPSData>> getGPSDataByDeviceId(
            @PathVariable String deviceId,
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        List<GPSData> data = sensorDataService.getGPSDataByUserAndDeviceId(user, deviceId);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @PostMapping("/gyroscope")
    public ResponseEntity<GyroscopeData> saveGyroscopeData(
            @RequestBody GyroscopeData data,
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        GyroscopeData savedData = sensorDataService.saveGyroscopeData(data, user);
        return new ResponseEntity<>(savedData, HttpStatus.CREATED);
    }

    @GetMapping("/gyroscope")
    public ResponseEntity<List<GyroscopeData>> getAllGyroscopeData(
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        List<GyroscopeData> data = sensorDataService.getGyroscopeDataByUser(user);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/gyroscope/{deviceId}")
    public ResponseEntity<List<GyroscopeData>> getGyroscopeDataByDeviceId(
            @PathVariable String deviceId,
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        List<GyroscopeData> data = sensorDataService.getGyroscopeDataByUserAndDeviceId(user, deviceId);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}