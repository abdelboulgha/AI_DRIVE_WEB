package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // Constructeurs
    public AccelerometerData() {
    }

    public AccelerometerData(float x, float y, float z, String deviceId, LocalDateTime timestamp, User user) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.user = user;
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

    // Nouveaux getters et setters pour user
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @JsonProperty("timestamp")
    public void setTimestampFromString(String timestamp) {
        if (timestamp != null && !timestamp.isEmpty()) {
            try {
                this.timestamp = LocalDateTime.parse(timestamp);
            } catch (Exception e) {
                // En cas d'erreur, utilisez la date actuelle
                this.timestamp = LocalDateTime.now();
            }
        }
    }
}