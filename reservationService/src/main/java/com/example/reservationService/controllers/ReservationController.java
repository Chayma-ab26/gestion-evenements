package com.example.reservationService.controllers;

import com.example.eventService.entities.EventDTO;
import com.example.reservationService.clients.EventClient;
import com.example.reservationService.entities.ReservationDTO;
import com.example.reservationService.entities.ReservationEntity;
import org.springframework.web.bind.WebDataBinder;
import com.example.reservationService.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.beans.PropertyEditorSupport;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = "*")

public class ReservationController {
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private EventClient eventClient;

    @PostMapping("/createWithEventAndUser")
    public ReservationEntity createReservation(@ModelAttribute  ReservationDTO dto) {
        return reservationService.createReservation(dto);
    }
    @PutMapping("/update/{id}")
    public ReservationEntity updateReservation(@PathVariable Long id, @ModelAttribute  ReservationDTO dto) {
        return reservationService.updateReservation(id, dto);
    }

    @GetMapping("/getbyid/{id}")
    public ReservationEntity getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }



   /* @GetMapping("/event/{id}")
    public EventDTO getEventById(@PathVariable Long id) {
        return eventClient.getEventById(id);
    }

    @PostMapping("/create")
    public ReservationEntity createReservation(@ModelAttribute ReservationEntity reservation) {
        return reservationService.createReservation(reservation);
    }

    @GetMapping("/getbyid/{id}")
    public ReservationEntity getReservationById(@PathVariable Long id) {
        return reservationService.getOne(id);
    }
*/

/*
    @PutMapping("/update/{id}")
    public ReservationEntity updateReservationById(@PathVariable Long id, @ModelAttribute  ReservationEntity reservation) {
        reservation.setId(id);
        ReservationEntity old = reservationService.getOne(id);

        if (reservation.getStatus() == null) reservation.setStatus(old.getStatus());
        if (reservation.getReservationDate() == null) reservation.setReservationDate(old.getReservationDate());

        return reservationService.updateReservation(reservation);
    }
*/
@GetMapping("/getall")
public List<ReservationEntity> getAllReservations() {
    return reservationService.getAllReservations();
}
    @PutMapping("/updatestatus/{id}")
    public ReservationEntity updateStatus(@PathVariable Long id, @RequestParam String status) {
        return reservationService.updateStatus(id, status);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteReservationById(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(LocalDateTime.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                try {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                    setValue(LocalDateTime.parse(text, formatter));
                } catch (Exception e) {
                    throw new IllegalArgumentException("Format de date invalide : yyyy-MM-dd'T'HH:mm:ss");
                }
            }
        });

    }

}



