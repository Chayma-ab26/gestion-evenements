package com.example.reservationService.clients;

import com.example.eventService.entities.EventDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "eventService")
public interface EventClient {
    @GetMapping("/events/getbyid/{id}")
    EventDTO getEventById(@PathVariable("id") Long id);
}
