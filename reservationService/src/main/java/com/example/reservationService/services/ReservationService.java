package com.example.reservationService.services;

import com.example.reservationService.clients.UserClient;
import com.example.reservationService.entities.ReservationEntity;
import com.example.reservationService.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserClient userClient; // Client REST vers userService

    /**
     * Création d'une réservation
     */
    public ReservationEntity createReservation(ReservationEntity reservation) {
        return reservationRepository.save(reservation);
    }

    /**
     * Récupérer toutes les réservations
     */
    public List<ReservationEntity> getAllReservations() {
        return reservationRepository.findAll();
    }

    /**
     * Récupérer une réservation par ID
     */
    public ReservationEntity getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
    }

    /**
     * Supprimer une réservation
     */
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    /**
     * Mettre à jour une réservation
     */
    public ReservationEntity updateReservationEntity(ReservationEntity reservation) {
        return reservationRepository.save(reservation);
    }

    /**
     * Mettre à jour le statut d'une réservation
     */
    public ReservationEntity updateStatus(Long id, String status) {
        ReservationEntity reservation = getReservationById(id);
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }
}
