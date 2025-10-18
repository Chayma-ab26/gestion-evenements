package com.example.reservationService.clients;

import com.example.userService.entities.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "userService")
public interface UserClient {
    @GetMapping("/users/me")
    ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String bearerToken);

}

