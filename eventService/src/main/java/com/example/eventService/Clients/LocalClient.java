package com.example.eventService.Clients;

import com.example.localservice.entities.LocalDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "localService")
public interface LocalClient {
    @GetMapping("/locals/getbyid/{id}")
    LocalDTO getLocalById(@PathVariable("id") Long id);
}
