package com.example.eventService.Service;

import com.example.categoryService.entities.CategoryDTO;
import com.example.eventService.Clients.CategoryClient;
import com.example.eventService.Clients.LocalClient;
import com.example.eventService.entities.EventDTO;
import com.example.eventService.entities.EventEntity;
import com.example.eventService.repositories.EventRepository;
import com.example.localservice.entities.LocalDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CategoryClient categoryClient;
    @Autowired
    private LocalClient localClient;

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<EventEntity> getAllEvents() {
        return eventRepository.findAll();
    }
/////////
public EventDTO getEventWithCategoryAndLocal(Long id) {
    EventEntity event = eventRepository.findById(id).orElse(null);
    if (event == null) return null;

    EventDTO dto = new EventDTO();
    dto.setId(event.getId());
    dto.setTitle(event.getTitle());
    dto.setDescription(event.getDescription());
    dto.setDatedebut(event.getDatedebut());
    dto.setDatefin(event.getDatefin());
    dto.setStatus(event.getStatus());
    dto.setCategoryId(event.getCategoryId());
    dto.setLocalId(event.getLocalId());

    // Récupération de la catégorie
    if (event.getCategoryId() != null) {
        CategoryDTO categoryDTO = categoryClient.getCategoryById(event.getCategoryId());
        dto.setCategory(categoryDTO);
    }

    // Récupération du local
    if (event.getLocalId() != null) {
        LocalDTO localDTO = localClient.getLocalById(event.getLocalId());
        dto.setLocal(localDTO);
    }

    return dto;
}

public EventDTO createEventWithCategory(EventDTO dto) {
    // Vérifie la catégorie
    CategoryDTO categoryDTO = categoryClient.getCategoryById(dto.getCategoryId());
    if (categoryDTO == null) {
        throw new RuntimeException("Catégorie non trouvée avec l'ID : " + dto.getCategoryId());
    }

    // Vérifie le local
    LocalDTO localDTO = localClient.getLocalById(dto.getLocalId());
    if (localDTO == null) {
        throw new RuntimeException("Local non trouvé avec l'ID : " + dto.getLocalId());
    }

    EventEntity event = new EventEntity();
    event.setTitle(dto.getTitle());
    event.setDescription(dto.getDescription());
    event.setDatedebut(dto.getDatedebut());
    event.setDatefin(dto.getDatefin());
    event.setStatus(dto.getStatus());
    event.setCategoryId(dto.getCategoryId());
    event.setLocalId(dto.getLocalId());

    EventEntity saved = eventRepository.save(event);

    dto.setId(saved.getId());
    dto.setCategory(categoryDTO);
    dto.setLocal(localDTO);
    return dto;
}

    public EventDTO updateEventWithCategoryAndLocal(Long id, EventDTO dto) {
        EventEntity existing = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'ID : " + id));

        // Appel au service des catégories
        CategoryDTO categoryDTO = categoryClient.getCategoryById(dto.getCategoryId());
        if (categoryDTO == null) {
            throw new RuntimeException("Catégorie non trouvée avec l'ID : " + dto.getCategoryId());
        }

        // Appel au service des locaux
        LocalDTO localDTO = localClient.getLocalById(dto.getLocalId());
        if (localDTO == null) {
            throw new RuntimeException("Local non trouvé avec l'ID : " + dto.getLocalId());
        }

        // Mise à jour de l'entité EventEntity
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setDatedebut(dto.getDatedebut());
        existing.setDatefin(dto.getDatefin());
        existing.setStatus(dto.getStatus());
        existing.setCategoryId(dto.getCategoryId());
        existing.setLocalId(dto.getLocalId()); // <-- ajoute ceci dans ton EventEntity si ce n'est pas déjà fait

        eventRepository.save(existing);

        // Préparer la réponse enrichie avec les objets complets
        dto.setId(id);
        dto.setCategory(categoryDTO);
        dto.setLocal(localDTO);
        return dto;
    }

 /* public EventEntity createEvent(EventEntity event) {
        // Vérification si la catégorie existe
        if (categoryClient.getCategoryById(event.getCategoryId()) == null) {
            throw new RuntimeException("Catégorie non trouvée avec l'ID : " + event.getCategoryId());
        }

        return eventRepository.save(event);
    }
    public EventEntity getOne(Long id) {
        return eventRepository.findById(id).orElse(null);
    }
*/
  /*  public EventEntity updateEvent(EventEntity event) {
        // Vérification si la catégorie existe
        if (categoryClient.getCategoryById(event.getCategoryId()) == null) {
            throw new RuntimeException("Catégorie non trouvée avec l'ID : " + event.getCategoryId());
        }

        return eventRepository.save(event);
    }
    */
}
