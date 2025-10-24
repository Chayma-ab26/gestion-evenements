package com.example.reservationService.repositories;

import com.example.reservationService.entities.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity,Long> {
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    List<ReservationEntity> findByUserKeycloakId(String userKeycloakId);

}
