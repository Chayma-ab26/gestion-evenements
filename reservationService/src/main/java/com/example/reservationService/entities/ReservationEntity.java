package com.example.reservationService.entities;

import jakarta.persistence.*;

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
    private String userKeycloakId;
    private int nbParticipants;


    public ReservationEntity() {
    }


    public ReservationEntity(Long id, LocalDateTime reservationDate, String status, Long userId, Long eventId, String userKeycloakId, int nbParticipants) {
        this.id = id;
        this.reservationDate = reservationDate;
        this.status = status;
        this.userId = userId;
        this.eventId = eventId;
        this.userKeycloakId = userKeycloakId;
        this.nbParticipants = nbParticipants;
    }

    public Long getUserId() {
        return userId;
    }

    public int getNbParticipants() {
        return nbParticipants;
    }

    public void setNbParticipants(int nbParticipants) {
        this.nbParticipants = nbParticipants;
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

    public String getUserKeycloakId() {
        return userKeycloakId;
    }

    public void setUserKeycloakId(String userKeycloakId) {
        this.userKeycloakId = userKeycloakId;
    }
}
