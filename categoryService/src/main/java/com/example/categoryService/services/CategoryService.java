package com.example.categoryService.services;

import com.example.categoryService.entities.CategoryEntity;
import com.example.categoryService.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryEntity createCategory(CategoryEntity category) {
        return categoryRepository.save(category);
    }

    public CategoryEntity getOne(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public CategoryEntity updateCategory(CategoryEntity category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }
}
