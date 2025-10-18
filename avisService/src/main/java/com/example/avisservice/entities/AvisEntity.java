package com.example.avisservice.entities;

import jakarta.persistence.*;


@Entity
@Table(name = "avis")
public class AvisEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int note;
    private String commentaire;
    private Long userId;
    private Long eventId;
    private String userKeycloakId;
    public AvisEntity() {
    }

    public AvisEntity(Long id, int note, String commentaire, Long userId, Long eventId,String userKeycloakId) {
        this.id = id;
        this.note = note;
        this.commentaire = commentaire;
        this.userId = userId;
        this.eventId = eventId;
        this.userKeycloakId = userKeycloakId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNote() {
        return note;
    }

    public void setNote(int note) {
        this.note = note;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public String getUserKeycloakId() {
        return userKeycloakId;
    }

    public void setUserKeycloakId(String userKeycloakId) {
        this.userKeycloakId = userKeycloakId;
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
}
