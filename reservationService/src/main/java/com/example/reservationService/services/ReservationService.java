package com.example.reservationService.services;

import com.example.reservationService.clients.EventClient;
import com.example.reservationService.clients.UserClient;
import com.example.reservationService.entities.ReservationDTO;
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
    private UserClient userClient;

    @Autowired
    private EventClient eventClient;

    public ReservationEntity createReservation(ReservationDTO dto) {
        ReservationEntity reservation = new ReservationEntity();
        reservation.setReservationDate(dto.getReservationDate());
        reservation.setEventId(dto.getEventId());
        reservation.setUserId(dto.getUserId());
        if (dto.getStatus() != null) {
            reservation.setStatus(dto.getStatus());
        } else {
            reservation.setStatus("pending"); // ou "en attente", "confirmée", selon ton besoin
        }

        return reservationRepository.save(reservation);
    }
    public ReservationEntity updateReservation(Long id, ReservationDTO dto) {
        ReservationEntity reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        reservation.setEventId(dto.getEventId());
        reservation.setUserId(dto.getUserId());
        reservation.setReservationDate(dto.getReservationDate());
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
        if (reservation == null) {
            throw new RuntimeException("Réservation non trouvée avec l'id : " + id);
        }
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }
    /*public ReservationEntity createReservation(ReservationEntity reservation) {
        return reservationRepository.save(reservation);
    }*/
   /* public ReservationEntity createReservation(ReservationEntity reservation) {
        if (userClient.getUserById(reservation.getUserId()) == null) {
            throw new RuntimeException("Utilisateur non trouvé avec l'ID : " + reservation.getUserId());
        }
        if (eventClient.getEventById(reservation.getEventId()) == null) {
            throw new RuntimeException("Événement non trouvé avec l'ID : " + reservation.getEventId());
        }
        return reservationRepository.save(reservation);
    }
*/


   /* public ReservationEntity getOne(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }*/


}
