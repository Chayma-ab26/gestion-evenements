package com.example.categoryService.controllers;

import com.example.categoryService.entities.CategoryEntity;
import com.example.categoryService.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
//@CrossOrigin(origins = "http://localhost:4200")

public class CategoryController {
@Autowired
    private CategoryService categoryService;

   /* @PostMapping("/create")
    public CategoryEntity createCategory(@RequestBody CategoryEntity category) {
        return categoryService.createCategory(category);
    }*/
   @PreAuthorize("hasRole('admin')")
   @PostMapping("/create")
   public CategoryEntity createCategory(@RequestParam("name") String name,
                                        @RequestParam("description") String description) {
       CategoryEntity category = new CategoryEntity();
       category.setName(name);
       category.setDescription(description);
       return categoryService.createCategory(category);
   }
    @PreAuthorize("hasRole('admin')")
    @GetMapping("/getbyid/{id}")
    public CategoryEntity getCategoryById(@PathVariable Long id) {
        return categoryService.getOne(id);
    }
    @PreAuthorize("hasRole('admin')")
    @GetMapping("/getall")
    public List<CategoryEntity> getAllCategories() {
        return categoryService.getAllCategories();
    }
    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/delete/{id}")
    public void deleteCategoryById(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }

   /* @PutMapping("/update/{id}")
    public CategoryEntity updateCategoryById(@PathVariable Long id, @RequestBody CategoryEntity category) {
        category.setId(id);
        CategoryEntity old = categoryService.getOne(id);

        if (category.getName() == null) category.setName(old.getName());
        if (category.getDescription() == null) category.setDescription(old.getDescription());

        return categoryService.updateCategory(category);
    }*/
   @PreAuthorize("hasRole('admin')")
   @PutMapping("/update/{id}")
   public CategoryEntity updateCategoryById(
           @PathVariable Long id,
           @RequestParam(required = false) String name,
           @RequestParam(required = false) String description) {

       CategoryEntity old = categoryService.getOne(id);
       if (name == null) name = old.getName();
       if (description == null) description = old.getDescription();

       CategoryEntity category = new CategoryEntity();
       category.setId(id);
       category.setName(name);
       category.setDescription(description);

       return categoryService.updateCategory(category);
   }


}
