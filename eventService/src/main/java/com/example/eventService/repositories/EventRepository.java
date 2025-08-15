package com.example.eventService.repositories;

import com.example.eventService.entities.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<EventEntity,Long> {
}
