package com.example.reservationService.services;

import com.example.reservationService.entities.ReservationEntity;
import com.example.reservationService.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    public ReservationEntity createReservationFromEntity(ReservationEntity reservation) {
        return reservationRepository.save(reservation);
    }

    public ReservationEntity updateReservationEntity(ReservationEntity reservation) {
        return reservationRepository.save(reservation);
    }

    public ReservationEntity getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
    }

    public List<ReservationEntity> getAllReservations() {
        return reservationRepository.findAll();
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    public ReservationEntity updateStatus(Long id, String status) {
        ReservationEntity reservation = getReservationById(id);
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }
}
