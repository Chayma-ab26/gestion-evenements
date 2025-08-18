//package com.example.userService.services;
//
//import com.example.userService.config.keycloakConfig;
//import org.keycloak.OAuth2Constants;
//import org.keycloak.admin.client.Keycloak;
//import org.keycloak.admin.client.KeycloakBuilder;
//import org.keycloak.representations.idm.CredentialRepresentation;
//import org.keycloak.representations.idm.UserRepresentation;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import javax.ws.rs.core.Response;
//import java.util.List;
//
//@Service
//public class KeycloakUserService {
//
//    @Autowired
//    private Keycloak keycloak;
//
//    @Autowired
//    private keycloakConfig keycloackConfig ;
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
//
//}
package com.example.userService.services;

import com.example.userService.config.keycloakConfig;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
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
    private keycloakConfig keycloakConfig;

    public void createUser(String username, String password,String firstname,String lastname) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEnabled(true);
        user.setEmail(username + "@gmail.com"); // email valide
        // Optionnel : user.setFirstName("John"); user.setLastName("Doe");
        user.setFirstName(firstname);
        user.setLastName(lastname);
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);

        user.setCredentials(List.of(credential));

        Response response = keycloak.realm(keycloakConfig.getRealm()).users().create(user);

        System.out.println("Keycloak Status: " + response.getStatus());
        if (response.getStatus() != 201) {
            System.out.println("Error body: " + response.readEntity(String.class));
        }
    }
}
