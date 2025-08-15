package com.example.categoryService.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "category_entity")

public class CategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;

    public CategoryEntity(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public CategoryEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
