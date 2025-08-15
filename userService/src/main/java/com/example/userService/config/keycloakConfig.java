package com.example.userService.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*@Configuration
public class keycloakConfig {
    @Value("${keycloak.username}")
    private String username;
    @Value("${keycloak.password}")
    private String password;
    @Value("${keycloak.server-url}")
    private String serverUrl;
    @Value("${keycloak.realm}")
    private String realm;
    @Value("${keycloak.client-id}")
    private String clientId;

    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .clientId(clientId)
                .username(username)
                .password(password)
                .build();
    }
*/
@Configuration
public class keycloakConfig {

    @Value("${keycloak.auth-server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")  // c’est le clientId (event-app)
    private String clientId;

    @Value("${keycloak.credentials.secret}")  // le secret du client event-app
    private String clientSecret;

    @Value("${keycloak.username}")
    private String username;

    @Value("${keycloak.password}")
    private String password;

    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
                .serverUrl("http://localhost:8080")
                .realm("EventProject")          // Realm : EventProject
                .clientId("event-app")    // Client : event-app
                .clientSecret("3IPc2LFiYW67zBotQFThpe3EyLGbXBzg")  // Secret du client event-app
                .username("admin")    // User admin (ex: admin)
                .password("admin")    // Mot de passe admin
              //  .grantType("password")
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)

                .build();
    }


    public String getRealm() {
        return "EventProject";
    }
}


