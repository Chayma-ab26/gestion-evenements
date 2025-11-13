package com.example.eventService.controllers;

import com.example.eventService.entities.EventDTO;
import com.example.eventService.entities.EventEntity;
import com.example.eventService.Service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.beans.PropertyEditorSupport;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
@Autowired
    private EventService eventService;
    @GetMapping("/getAllWithLocal")
    public List<EventDTO> getAllEventsWithLocal() {
        return eventService.getAllEventsWithLocal();
    }


    @PreAuthorize("hasRole('organisateur')")

   @PostMapping("/createWithCategoryAndLocal")
   public EventDTO createEventWithCategoryAndLocal(@ModelAttribute EventDTO dto) {
       return eventService.createEventWithCategory(dto);
   }

    @PreAuthorize("hasRole('organisateur')")

    @PutMapping("/updateWithCategoryAndLocal/{id}")
    public EventDTO updateEventWithCategoryAndLocal(@PathVariable Long id, @ModelAttribute  EventDTO dto) {
        return eventService.updateEventWithCategoryAndLocal(id, dto);
    }
    @PreAuthorize("hasRole('organisateur')")

    @DeleteMapping("/delete/{id}")
    public void deleteEventById(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
    @PreAuthorize("hasRole('organisateur')")

    @GetMapping("/getall")
    public List<EventEntity> getAllEvents() {
        return eventService.getAllEvents();
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
    @GetMapping("/getbyid/{id}")
    public EventEntity getEventById(@PathVariable Long id) {
        return eventService.getOne(id);
    }


}