package com.example.backend.dto;

import java.util.List;
import java.util.Map;

public class AlertStatsDTO {
    private long totalAlerts;

    private Map<String, Long> severityStats;
    private Map<String, Long> statusStats;
    private List<TypeStatDTO> typeStats;
    private List<CarStatDTO> topCars;
    private TimeStatsDTO timeStats;

    // Getters et Setters
    public long getTotalAlerts() {
        return totalAlerts;
    }

    public void setTotalAlerts(long totalAlerts) {
        this.totalAlerts = totalAlerts;
    }

    public Map<String, Long> getSeverityStats() {
        return severityStats;
    }

    public void setSeverityStats(Map<String, Long> severityStats) {
        this.severityStats = severityStats;
    }

    public Map<String, Long> getStatusStats() {
        return statusStats;
    }

    public void setStatusStats(Map<String, Long> statusStats) {
        this.statusStats = statusStats;
    }

    public List<TypeStatDTO> getTypeStats() {
        return typeStats;
    }

    public void setTypeStats(List<TypeStatDTO> typeStats) {
        this.typeStats = typeStats;
    }

    public List<CarStatDTO> getTopCars() {
        return topCars;
    }

    public void setTopCars(List<CarStatDTO> topCars) {
        this.topCars = topCars;
    }

    public TimeStatsDTO getTimeStats() {
        return timeStats;
    }

    public void setTimeStats(TimeStatsDTO timeStats) {
        this.timeStats = timeStats;
    }

    // Classes internes
    public static class TypeStatDTO {
        private String type;
        private long count;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public static class CarStatDTO {
        private Long carId;
        private String brand;
        private String model;
        private String licensePlate;
        private long count;
        private double percentage;

        public Long getCarId() {
            return carId;
        }

        public void setCarId(Long carId) {
            this.carId = carId;
        }

        public String getBrand() {
            return brand;
        }

        public void setBrand(String brand) {
            this.brand = brand;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getLicensePlate() {
            return licensePlate;
        }

        public void setLicensePlate(String licensePlate) {
            this.licensePlate = licensePlate;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }

        public double getPercentage() {
            return percentage;
        }

        public void setPercentage(double percentage) {
            this.percentage = percentage;
        }
    }

    public static class TimeStatsDTO {
        private List<HourStatDTO> byHour;
        private List<DayStatDTO> byDay;

        public List<HourStatDTO> getByHour() {
            return byHour;
        }

        public void setByHour(List<HourStatDTO> byHour) {
            this.byHour = byHour;
        }

        public List<DayStatDTO> getByDay() {
            return byDay;
        }

        public void setByDay(List<DayStatDTO> byDay) {
            this.byDay = byDay;
        }

        public static class HourStatDTO {
            private int hour;
            private long count;

            public int getHour() {
                return hour;
            }

            public void setHour(int hour) {
                this.hour = hour;
            }

            public long getCount() {
                return count;
            }

            public void setCount(long count) {
                this.count = count;
            }
        }

        public static class DayStatDTO {
            private int day;
            private String dayName;
            private long count;

            public int getDay() {
                return day;
            }

            public void setDay(int day) {
                this.day = day;
            }

            public String getDayName() {
                return dayName;
            }

            public void setDayName(String dayName) {
                this.dayName = dayName;
            }

            public long getCount() {
                return count;
            }

            public void setCount(long count) {
                this.count = count;
            }
        }
    }
}