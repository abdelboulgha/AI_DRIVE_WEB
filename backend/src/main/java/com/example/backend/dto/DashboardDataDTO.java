package com.example.backend.dto;

import com.example.backend.entity.AccelerometerData;
import com.example.backend.entity.GPSData;
import com.example.backend.entity.GyroscopeData;

import java.util.List;

public class DashboardDataDTO {
    private int activeDevices;
    private long totalGPSPoints;
    private long totalAccelerometerReadings;
    private long totalGyroscopeReadings;
    private List<GPSData> recentGPSData;
    private List<AccelerometerData> recentAccelerometerData;
    private List<GyroscopeData> recentGyroscopeData;
    private List<DeviceActivityDTO> deviceActivities;

    public int getActiveDevices() {
        return activeDevices;
    }

    public void setActiveDevices(int activeDevices) {
        this.activeDevices = activeDevices;
    }

    public long getTotalGPSPoints() {
        return totalGPSPoints;
    }

    public void setTotalGPSPoints(long totalGPSPoints) {
        this.totalGPSPoints = totalGPSPoints;
    }

    public long getTotalAccelerometerReadings() {
        return totalAccelerometerReadings;
    }

    public void setTotalAccelerometerReadings(long totalAccelerometerReadings) {
        this.totalAccelerometerReadings = totalAccelerometerReadings;
    }

    public long getTotalGyroscopeReadings() {
        return totalGyroscopeReadings;
    }

    public void setTotalGyroscopeReadings(long totalGyroscopeReadings) {
        this.totalGyroscopeReadings = totalGyroscopeReadings;
    }

    public List<GPSData> getRecentGPSData() {
        return recentGPSData;
    }

    public void setRecentGPSData(List<GPSData> recentGPSData) {
        this.recentGPSData = recentGPSData;
    }

    public List<AccelerometerData> getRecentAccelerometerData() {
        return recentAccelerometerData;
    }

    public void setRecentAccelerometerData(List<AccelerometerData> recentAccelerometerData) {
        this.recentAccelerometerData = recentAccelerometerData;
    }

    public List<GyroscopeData> getRecentGyroscopeData() {
        return recentGyroscopeData;
    }

    public void setRecentGyroscopeData(List<GyroscopeData> recentGyroscopeData) {
        this.recentGyroscopeData = recentGyroscopeData;
    }

    public List<DeviceActivityDTO> getDeviceActivities() {
        return deviceActivities;
    }

    public void setDeviceActivities(List<DeviceActivityDTO> deviceActivities) {
        this.deviceActivities = deviceActivities;
    }

// Getters and setters
}
