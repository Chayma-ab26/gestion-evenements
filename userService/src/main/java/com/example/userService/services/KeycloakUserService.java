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
    private keycloakConfig keycloakConfig;

//    public void createUser(String username, String password, String firstname, String lastname, String role) {
//        UserRepresentation user = new UserRepresentation();
//        user.setUsername(username);
//        user.setEnabled(true);
//        user.setEmail(username + "@gmail.com"); // email valide
//        // Optionnel : user.setFirstName("John"); user.setLastName("Doe");
//        user.setFirstName(firstname);
//        user.setLastName(lastname);
//        CredentialRepresentation credential = new CredentialRepresentation();
//        credential.setTemporary(false);
//        credential.setType(CredentialRepresentation.PASSWORD);
//        credential.setValue(password);
//
//        user.setCredentials(List.of(credential));
//
//        Response response = keycloak.realm(keycloakConfig.getRealm()).users().create(user);
//        System.out.println("Keycloak Status: " + response.getStatus());
//
//        if (response.getStatus() == 201) {
//            // 🔹 2. Récupérer l’ID du nouvel utilisateur
//            String location = response.getLocation().getPath();
//            String userId = location.substring(location.lastIndexOf("/") + 1);
//
//            // 🔹 3. Récupérer le rôle par son nom
//            var realmResource = keycloak.realm(keycloakConfig.getRealm());
//            var roleRepresentation = realmResource.roles().get(role).toRepresentation();
//
//            // 🔹 4. Associer le rôle à l’utilisateur
//            realmResource.users()
//                    .get(userId)
//                    .roles()
//                    .realmLevel()
//                    .add(List.of(roleRepresentation));
//
//            System.out.println("✅ Utilisateur " + username + " créé avec le rôle : " + role);
//        } else {
//            System.out.println("❌ Erreur Keycloak: " + response.readEntity(String.class));
//        }
//    }

    public String createUser(String username, String password, String firstname, String lastname, String roleName) {
        // 1️⃣ Créer l'utilisateur
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEnabled(true);
        user.setEmail((username != null ? username : "user") + "@gmail.com"); // sécurité
        user.setFirstName(firstname != null ? firstname : "");
        user.setLastName(lastname != null ? lastname : "");

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        user.setCredentials(List.of(credential));

        Response response = keycloak.realm(keycloakConfig.getRealm())
                .users()
                .create(user);

        System.out.println("Keycloak Status: " + response.getStatus());

        if (response.getStatus() != 201) {
            String error = response.readEntity(String.class);
            throw new RuntimeException("❌ Erreur lors de la création dans Keycloak: " + error);
        }

        // 2️⃣ Récupérer l'ID du nouvel utilisateur
        String location = response.getLocation().getPath();
        String userId = location.substring(location.lastIndexOf("/") + 1);

        // 3️⃣ Assigner le rôle au niveau du realm
        if (roleName != null && !roleName.isBlank()) {
            var realmResource = keycloak.realm(keycloakConfig.getRealm());
            RoleRepresentation roleRep = realmResource.roles().get(roleName).toRepresentation();

            realmResource.users()
                    .get(userId)
                    .roles()
                    .realmLevel()
                    .add(List.of(roleRep));
        }

        System.out.println("✅ Utilisateur " + username + " créé avec ID: " + userId);
        return userId; // ✅ Toujours retourner l'ID Keycloak
    }

}
