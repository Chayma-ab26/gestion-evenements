package com.example.avisservice.repositories;

import com.example.avisservice.entities.AvisEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvisRepository extends JpaRepository<AvisEntity, Long> {

}