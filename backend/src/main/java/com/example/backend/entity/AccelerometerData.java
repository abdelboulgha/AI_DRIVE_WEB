package com.example.backend.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "accelerometer_data")
public class AccelerometerData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private float x;
    private float y;
    private float z;
    private String deviceId;
    private LocalDateTime timestamp;

    // Constructeurs
    public AccelerometerData() {
    }

    public AccelerometerData(float x, float y, float z, String deviceId, LocalDateTime timestamp) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.deviceId = deviceId;
        this.timestamp = timestamp;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public float getZ() {
        return z;
    }

    public void setZ(float z) {
        this.z = z;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}