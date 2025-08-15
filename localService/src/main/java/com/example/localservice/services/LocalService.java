package com.example.localservice.services;

import com.example.localservice.entities.LocalEntity;
import com.example.localservice.repositories.LocalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalService {
    @Autowired
    private LocalRepository localRepository;
    public LocalEntity createLocal(LocalEntity local) {
        return localRepository.save(local);
    }

    public LocalEntity getOne(Long id) {
        return localRepository.findById(id).orElse(null);
    }

    public LocalEntity updateLocal(LocalEntity local) {
        return localRepository.save(local);
    }

    public void deleteLocal(Long id) {
        localRepository.deleteById(id);
    }

    public List<LocalEntity> getAllLocals() {
        return localRepository.findAll();
    }

}
