package com.example.reservationService.clients;

import com.example.userService.entities.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "userService")
public interface UserClient {
    @GetMapping("/users/getbyid/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);
}

