package com.example.avisservice.services;

import com.example.avisservice.entities.AvisEntity;
import com.example.avisservice.repositories.AvisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvisService {
    @Autowired
    public AvisRepository avisRepository;

    public AvisEntity createAvis(AvisEntity avis) {
        return avisRepository.save(avis);
    }

    public List<AvisEntity> getAll() {
        return avisRepository.findAll();
    }



}
