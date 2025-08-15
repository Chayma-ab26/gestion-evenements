package com.example.localservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
@EnableFeignClients
public class LocalServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LocalServiceApplication.class, args);
    }

}
