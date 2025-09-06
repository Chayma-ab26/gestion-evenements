package com.example.avisservice.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "eventService")
public interface EventClient {

    @GetMapping("/events/{id}")
    Object getEventById(@PathVariable("id") Long id);
}

