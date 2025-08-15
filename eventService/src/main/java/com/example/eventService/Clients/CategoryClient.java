package com.example.eventService.Clients;

import com.example.categoryService.entities.CategoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "categoryService")
public interface CategoryClient {
    @GetMapping("/categories/getbyid/{id}")
    CategoryDTO getCategoryById(@PathVariable Long id);
}
