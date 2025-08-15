package com.example.localservice.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "local_entity")

public class LocalEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String adress;
    private String type;
    private Integer capacite;
    private  String image;
    private LocalDate dateReservation;
    private String statut;
    public LocalEntity() {
    }

    public LocalEntity(Long id, String name, String adress, String type, int capacite ,String image,LocalDate dateReservation,String statut) {
        this.id = id;
        this.name = name;
        this.adress = adress;
        this.type = type;
        this.capacite = capacite;
        this.image=image;
        this.dateReservation=dateReservation;
        this.statut=statut;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAdress() {
        return adress;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }



    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getCapacite() {
        return capacite;
    }

    public void setCapacite(Integer capacite) {
        this.capacite = capacite;
    }

    public LocalDate getDateReservation() {
        return dateReservation;
    }

    public void setDateReservation(LocalDate dateReservation) {
        this.dateReservation = dateReservation;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}
