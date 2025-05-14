package com.example.backend.controller;


import com.example.backend.entity.AccelerometerData;
import com.example.backend.entity.GPSData;
import com.example.backend.entity.GyroscopeData;
import com.example.backend.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensor")
public class SensorDataController {

    private final SensorDataService sensorDataService;

    @Autowired
    public SensorDataController(SensorDataService sensorDataService) {
        this.sensorDataService = sensorDataService;
    }

    // Endpoints pour l'accéléromètre
    @PostMapping("/accelerometer")
    public ResponseEntity<AccelerometerData> saveAccelerometerData(@RequestBody AccelerometerData data) {
        AccelerometerData savedData = sensorDataService.saveAccelerometerData(data);
        return new ResponseEntity<>(savedData, HttpStatus.CREATED);
    }

    @GetMapping("/accelerometer")
    public ResponseEntity<List<AccelerometerData>> getAllAccelerometerData() {
        List<AccelerometerData> data = sensorDataService.getAllAccelerometerData();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/accelerometer/{deviceId}")
    public ResponseEntity<List<AccelerometerData>> getAccelerometerDataByDeviceId(@PathVariable String deviceId) {
        List<AccelerometerData> data = sensorDataService.getAccelerometerDataByDeviceId(deviceId);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    // Endpoints pour le GPS
    @PostMapping("/gps")
    public ResponseEntity<GPSData> saveGPSData(@RequestBody GPSData data) {
        GPSData savedData = sensorDataService.saveGPSData(data);
        return new ResponseEntity<>(savedData, HttpStatus.CREATED);
    }

    @GetMapping("/gps")
    public ResponseEntity<List<GPSData>> getAllGPSData() {
        List<GPSData> data = sensorDataService.getAllGPSData();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/gps/{deviceId}")
    public ResponseEntity<List<GPSData>> getGPSDataByDeviceId(@PathVariable String deviceId) {
        List<GPSData> data = sensorDataService.getGPSDataByDeviceId(deviceId);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    // Endpoints pour le gyroscope
    @PostMapping("/gyroscope")
    public ResponseEntity<GyroscopeData> saveGyroscopeData(@RequestBody GyroscopeData data) {
        GyroscopeData savedData = sensorDataService.saveGyroscopeData(data);
        return new ResponseEntity<>(savedData, HttpStatus.CREATED);
    }

    @GetMapping("/gyroscope")
    public ResponseEntity<List<GyroscopeData>> getAllGyroscopeData() {
        List<GyroscopeData> data = sensorDataService.getAllGyroscopeData();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/gyroscope/{deviceId}")
    public ResponseEntity<List<GyroscopeData>> getGyroscopeDataByDeviceId(@PathVariable String deviceId) {
        List<GyroscopeData> data = sensorDataService.getGyroscopeDataByDeviceId(deviceId);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}