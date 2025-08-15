package com.example.reservationService.entities;

import com.example.eventService.entities.EventEntity;
import com.example.userService.entities.UserEntity;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

@Entity
public class ReservationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime reservationDate;
    @Column(nullable = false)
    private String status = "pending";

    private Long userId;   // userservice
    private Long eventId;  // eventservice



    public ReservationEntity() {
    }

    public ReservationEntity(Long id, LocalDateTime reservationDate, String status, Long userId, Long eventId) {
        this.id = id;
        this.reservationDate = reservationDate;
        this.status = status;
        this.userId = userId;
        this.eventId = eventId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
