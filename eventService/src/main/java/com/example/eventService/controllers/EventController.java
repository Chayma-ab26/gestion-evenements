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
@CrossOrigin(origins = "*")
public class EventController {
@Autowired
    private EventService eventService;
    @PreAuthorize("hasRole('organisateur')")
    @GetMapping("/getEventWithCategoryAndLocal/{id}")
    public EventDTO getEventWithCategoryAndLocal(@PathVariable Long id) {
        return eventService.getEventWithCategoryAndLocal(id);
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

    ////////////////////////////
    /*@PostMapping("/create")
    public EventEntity createEvent(@ModelAttribute EventEntity event) {
        return eventService.createEvent(event);
    }

    @GetMapping("/getbyid/{id}")
    public EventEntity getEventById(@PathVariable Long id) {
        return eventService.getOne(id);
    }

*/
   /* @PutMapping("/update/{id}")
    public EventEntity updateEventById(@PathVariable Long id, @ModelAttribute  EventEntity event) {
        // sauvegarder l'id
        event.setId(id);
        // récupération ancienne version
        EventEntity old = eventService.getOne(id);
        if (event.getTitle() == null) event.setTitle(old.getTitle());
        if (event.getDescription() == null) event.setDescription(old.getDescription());
        if (event.getDatedebut() == null) event.setDatedebut(old.getDatedebut());
        if (event.getDatefin() == null) event.setDatefin(old.getDatefin());
        if (event.getLocation() == null) event.setLocation(old.getLocation());
        if (event.getStatus() == null) event.setStatus(old.getStatus());
        if (event.getCategoryId() == null) event.setCategoryId(old.getCategoryId());
        return eventService.updateEvent(event);
    }
*/

}