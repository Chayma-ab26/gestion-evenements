package com.example.localservice.repositories;

import com.example.localservice.entities.LocalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalRepository extends JpaRepository<LocalEntity,Long> {
}
