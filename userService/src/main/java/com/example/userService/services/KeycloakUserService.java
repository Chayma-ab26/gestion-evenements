package com.example.userService.services;

import com.example.userService.config.keycloakConfig;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.ws.rs.core.Response;
import java.util.List;

@Service
public class KeycloakUserService {

    @Autowired
    private Keycloak keycloak;

    @Autowired
    private keycloakConfig keycloackConfig ;
//    public void createUser(String username, String password) {
//        UserRepresentation user = new UserRepresentation();
//        user.setUsername(username);
//        user.setEnabled(true);
//        user.setEmail(username + "@example.com"); // 👈 Add valid email
////        user.setFirstName("John"); // Optional
////        user.setLastName("Doe");   // Optional
//
//        CredentialRepresentation credential = new CredentialRepresentation();
//        credential.setTemporary(false);
//        credential.setType(CredentialRepresentation.PASSWORD);
//        credential.setValue(password);
//
//        user.setCredentials(List.of(credential));
//
//        Response response = keycloak.realm(keycloackConfig.getRealm()).users().create(user);
//        System.out.println("Keycloak Status: " + response.getStatus());
//        if (response.getStatus() != 201) {
//            System.out.println("Error body: " + response.readEntity(String.class)); // 👈 Helpful log
//        }
//    }
public String createUser(String username, String password, String email, String roleName) {
    UserRepresentation user = new UserRepresentation();
    user.setUsername(username);
    user.setEmail(email);
    user.setEnabled(true);

    CredentialRepresentation cred = new CredentialRepresentation();
    cred.setType(CredentialRepresentation.PASSWORD);
    cred.setValue(password);
    user.setCredentials(List.of(cred));

    Response response = keycloak.realm("EventProject").users().create(user);
    if (response.getStatus() != 201) {
        throw new RuntimeException("Erreur Keycloak: " + response.readEntity(String.class));
    }

    String location = response.getHeaderString("Location");
    String userId = location.replaceAll(".*/([^/]+)$", "$1");

    RoleRepresentation role = keycloak.realm("EventProject")
            .roles()
            .get(roleName.toUpperCase())
            .toRepresentation();

    keycloak.realm("EventProject")
            .users()
            .get(userId)
            .roles()
            .realmLevel()
            .add(List.of(role));

    return userId;
}

    public void createUser(String username, String password) {
    }
}