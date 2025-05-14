package com.example.backend.dto;

public class StatsSummaryDTO {
    private int activeDevices;
    private long totalGPSPoints;
    private long totalAccelerometerReadings;
    private long totalGyroscopeReadings;

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
}
