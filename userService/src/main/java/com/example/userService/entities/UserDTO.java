package com.example.userService.entities;

public class UserDTO {


    //copier des varible prive de user entuty
    //getter// setter

    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String username;
    private String password;
    private String role;
    private String phone;
    private String photo;
    private String keycloakid;
    public Long getId() {
        return id;
    }

    public String getKeycloakid() {
        return keycloakid;
    }

    public void setKeycloakid(String keycloakid) {
        this.keycloakid = keycloakid;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }
}
