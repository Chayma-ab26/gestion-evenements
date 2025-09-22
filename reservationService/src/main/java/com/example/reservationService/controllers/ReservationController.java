//package com.example.reservationService.controllers;
//
//import com.example.eventService.Service.EventService;
//import com.example.eventService.entities.EventDTO;
//import com.example.reservationService.clients.EventClient;
//import com.example.reservationService.entities.ReservationDTO;
//import com.example.reservationService.entities.ReservationEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.WebDataBinder;
//import com.example.reservationService.services.ReservationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.beans.PropertyEditorSupport;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//
//@RestController
//@RequestMapping("/reservations")
//@CrossOrigin(origins = "*")
//
//public class ReservationController {
//    @Autowired
//    private ReservationService reservationService;
//    @Autowired
//    private EventClient eventClient;
//
//
//  @PreAuthorize("hasRole('participant')")
//
//    @PostMapping("/createWithEventAndUser")
//    public ReservationEntity createReservation(@ModelAttribute  ReservationDTO dto) {
//        return reservationService.createReservation(dto);
//    }
//    @PreAuthorize("hasRole('participant')")
//
//    @PutMapping("/update/{id}")
//    public ReservationEntity updateReservation(@PathVariable Long id, @ModelAttribute  ReservationDTO dto) {
//        return reservationService.updateReservation(id, dto);
//    }
//    @PreAuthorize("hasRole('participant')")
//
//    @GetMapping("/getbyid/{id}")
//    public ReservationEntity getReservationById(@PathVariable Long id) {
//        return reservationService.getReservationById(id);
//    }
//
//
//
//
//@PreAuthorize("hasRole('participant')")
//
//@GetMapping("/getall")
//public List<ReservationEntity> getAllReservations() {
//    return reservationService.getAllReservations();
//}
//    @PutMapping("/updatestatus/{id}")
//    public ReservationEntity updateStatus(@PathVariable Long id, @RequestParam String status) {
//        return reservationService.updateStatus(id, status);
//    }
//    @PreAuthorize("hasRole('participant')")
//
//    @DeleteMapping("/delete/{id}")
//    public void deleteReservationById(@PathVariable Long id) {
//        reservationService.deleteReservation(id);
//    }
//
//    @InitBinder
//    public void initBinder(WebDataBinder binder) {
//        binder.registerCustomEditor(LocalDateTime.class, new PropertyEditorSupport() {
//            @Override
//            public void setAsText(String text) throws IllegalArgumentException {
//                try {
//                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
//                    setValue(LocalDateTime.parse(text, formatter));
//                } catch (Exception e) {
//                    throw new IllegalArgumentException("Format de date invalide : yyyy-MM-dd'T'HH:mm:ss");
//                }
//            }
//        });
//
//    }
//
//}
//
//
//

package com.example.reservationService.controllers;

import com.example.reservationService.entities.ReservationEntity;
import com.example.reservationService.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.WebDataBinder;
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

    @PostMapping("/create")
    public ReservationEntity createReservation(@ModelAttribute ReservationEntity reservation) {
        if (reservation.getReservationDate() == null) {
            reservation.setReservationDate(LocalDateTime.now());
        }
        if (reservation.getStatus() == null) {
            reservation.setStatus("pending");
        }
        return reservationService.createReservationFromEntity(reservation);
    }


    @PutMapping("/update/{id}")
    public ReservationEntity updateReservation(@PathVariable Long id,
                                               @RequestParam(required = false) Long eventId,
                                               @RequestParam(required = false) Long userId,
                                               @RequestParam(required = false) String reservationDateStr,
                                               @RequestParam(required = false) String status) {
        ReservationEntity old = reservationService.getReservationById(id);
        if (eventId != null) old.setEventId(eventId);
        if (userId != null) old.setUserId(userId);
        if (reservationDateStr != null)
            old.setReservationDate(LocalDateTime.parse(reservationDateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
        if (status != null) old.setStatus(status);
        return reservationService.updateReservationEntity(old);
    }

    @GetMapping("/getbyid/{id}")
    public ReservationEntity getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }

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
            public void setAsText(String text) {
                setValue(LocalDateTime.parse(text, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
            }
        });
    }
}
