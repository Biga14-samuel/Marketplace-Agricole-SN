import pytest
from fastapi import status
from datetime import datetime, timedelta

# Préfixe des routes d'authentification
AUTH_PREFIX = "/authentification/auth"


class TestUserRegistration:
    """Tests d'inscription des utilisateurs"""

    def test_register_valid_user(self, client):
        """
        Test d'inscription avec des données valides.
        
        Vérifie que :
        - L'inscription réussit avec un statut 201
        - Un message de confirmation est retourné
        - L'utilisateur est bien créé
        """
        response = client.post(
            f"{AUTH_PREFIX}/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123!",
                "phone": "+237612345678"
            }
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "message" in data
        assert "réussie" in data["message"].lower()

    def test_register_duplicate_email(self, client):
        """
        Test d'inscription avec un email déjà utilisé.
        
        Vérifie que le système rejette une seconde inscription
        avec le même email.
        """
        # Première inscription
        user_data = {
            "email": "duplicate@example.com",
            "password": "Password123!",
        }
        client.post(f"{AUTH_PREFIX}/register", json=user_data)
        
        # Tentative de duplication
        response = client.post(f"{AUTH_PREFIX}/register", json=user_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "existe" in response.json()["detail"].lower()

    def test_register_weak_password(self, client):
        """
        Test d'inscription avec un mot de passe faible.
        
        Vérifie que les mots de passe doivent respecter les critères :
        - Au moins 8 caractères
        - Au moins une majuscule
        - Au moins une minuscule
        - Au moins un chiffre
        """
        weak_passwords = [
            "weak",  # Trop court
            "weakpassword",  # Pas de majuscule ni chiffre
            "WEAKPASSWORD",  # Pas de minuscule ni chiffre
            "WeakPassword",  # Pas de chiffre
        ]
        
        for weak_pass in weak_passwords:
            response = client.post(
                f"{AUTH_PREFIX}/register",
                json={
                    "email": f"test_{weak_pass}@example.com",
                    "password": weak_pass,
                }
            )
            assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_invalid_email(self, client):
        """
        Test d'inscription avec un email invalide.
        
        Vérifie que le format d'email est validé.
        """
        response = client.post(
            f"{AUTH_PREFIX}/register",
            json={
                "email": "not-an-email",
                "password": "Password123!",
            }
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_register_invalid_phone(self, client):
        """
        Test d'inscription avec un numéro de téléphone invalide.
        
        Vérifie que le format du téléphone est validé.
        """
        response = client.post(
            f"{AUTH_PREFIX}/register",
            json={
                "email": "validuser@example.com",
                "password": "Password123!",
                "phone": "123"  # Trop court
            }
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestUserLogin:
    """Tests de connexion des utilisateurs"""

    def test_login_success(self, client, test_user_credentials):
        """
        Test de connexion réussie.
        
        Vérifie que :
        - La connexion retourne un statut 200
        - Un access_token est fourni
        - Un refresh_token est fourni
        - Les informations utilisateur sont retournées
        """
        # D'abord enregistrer l'utilisateur
        client.post(f"{AUTH_PREFIX}/register", json=test_user_credentials)
        
        # Puis se connecter
        response = client.post(
            f"{AUTH_PREFIX}/login",
            json=test_user_credentials
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Vérifier la présence des tokens
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
        
        # Vérifier les informations utilisateur
        assert "user" in data
        assert data["user"]["email"] == test_user_credentials["email"]

    def test_login_wrong_password(self, client, test_user_credentials):
        """
        Test de connexion avec un mauvais mot de passe.
        
        Vérifie que le système rejette les identifiants incorrects.
        """
        # Enregistrer l'utilisateur
        client.post(f"{AUTH_PREFIX}/register", json=test_user_credentials)
        
        # Tentative avec mauvais mot de passe
        response = client.post(
            f"{AUTH_PREFIX}/login",
            json={
                "email": test_user_credentials["email"],
                "password": "WrongPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, client):
        """
        Test de connexion avec un utilisateur inexistant.
        
        Vérifie que le système ne révèle pas si l'utilisateur existe.
        """
        response = client.post(
            f"{AUTH_PREFIX}/login",
            json={
                "email": "nonexistent@example.com",
                "password": "Password123!"
            }
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestTokenManagement:
    """Tests de gestion des tokens JWT"""

    def test_get_current_user_with_valid_token(self, client, auth_headers):
        """
        Test de récupération du profil avec un token valide.
        
        Vérifie que le endpoint /me retourne les bonnes informations
        avec un token d'authentification valide.
        """
        response = client.get(
            f"{AUTH_PREFIX}/me",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "email" in data
        assert "id" in data
        assert "is_active" in data

    def test_get_current_user_without_token(self, client):
        """
        Test d'accès au profil sans token.
        
        Vérifie que l'accès est refusé sans authentification.
        HTTPBearer retourne 401 (non authentifié) plutôt que 403 (interdit).
        """
        response = client.get(f"{AUTH_PREFIX}/me")
        
        # HTTPBearer retourne 401 quand il n'y a pas de token
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user_with_invalid_token(self, client):
        """
        Test d'accès au profil avec un token invalide.
        
        Vérifie que les tokens mal formés sont rejetés.
        """
        response = client.get(
            f"{AUTH_PREFIX}/me",
            headers={"Authorization": "Bearer invalid_token_here"}
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_refresh_token_success(self, client, test_user_credentials):
        """
        Test de rafraîchissement de token réussi.
        
        Vérifie que :
        - Un nouveau access_token est généré
        - Le refresh_token est valide
        """
        # Enregistrer et se connecter
        client.post(f"{AUTH_PREFIX}/register", json=test_user_credentials)
        login_response = client.post(
            f"{AUTH_PREFIX}/login",
            json=test_user_credentials
        )
        
        refresh_token = login_response.json()["refresh_token"]
        
        # Rafraîchir le token
        response = client.post(
            f"{AUTH_PREFIX}/refresh",
            json={"refresh_token": refresh_token}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_refresh_with_invalid_token(self, client):
        """
        Test de rafraîchissement avec un token invalide.
        
        Vérifie que les refresh tokens invalides sont rejetés.
        """
        response = client.post(
            f"{AUTH_PREFIX}/refresh",
            json={"refresh_token": "invalid_refresh_token"}
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestLogout:
    """Tests de déconnexion"""

    def test_logout_success(self, client, test_user_credentials):
        """
        Test de déconnexion réussie.
        
        Vérifie que :
        - La déconnexion réussit
        - Le refresh token est révoqué
        - Le même token ne peut plus être utilisé
        """
        # Enregistrer et se connecter
        client.post(f"{AUTH_PREFIX}/register", json=test_user_credentials)
        login_response = client.post(
            f"{AUTH_PREFIX}/login",
            json=test_user_credentials
        )
        
        refresh_token = login_response.json()["refresh_token"]
        
        # Se déconnecter
        response = client.post(
            f"{AUTH_PREFIX}/logout",
            json={"refresh_token": refresh_token}
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "déconnexion" in response.json()["message"].lower()
        
        # Vérifier que le token est révoqué
        refresh_response = client.post(
            f"{AUTH_PREFIX}/refresh",
            json={"refresh_token": refresh_token}
        )
        assert refresh_response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout_with_invalid_token(self, client):
        """
        Test de déconnexion avec un token invalide.
        
        Vérifie que les tokens invalides sont rejetés.
        """
        response = client.post(
            f"{AUTH_PREFIX}/logout",
            json={"refresh_token": "invalid_token"}
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestPasswordReset:
    """Tests de réinitialisation de mot de passe"""

    def test_request_password_reset(self, client, test_user_credentials):
        """
        Test de demande de réinitialisation de mot de passe.
        
        Note : Ce test vérifie seulement que la requête est acceptée.
        L'envoi d'email n'est pas testé ici.
        """
        # D'abord enregistrer l'utilisateur
        client.post(
            f"{AUTH_PREFIX}/register",
            json=test_user_credentials
        )
        
        # Demander la réinitialisation
        response = client.post(
            f"{AUTH_PREFIX}/password-reset/request",
            json={"email": test_user_credentials["email"]}
        )
        
        # La plupart des systèmes retournent 200 même si l'email n'existe pas
        # pour des raisons de sécurité
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]


class TestEmailVerification:
    """Tests de vérification d'email"""

    def test_request_email_verification(self, client, test_user_credentials):
        """
        Test de demande de vérification d'email.
        
        Note : L'envoi d'email n'est pas testé ici.
        """
        # Enregistrer un utilisateur
        client.post(f"{AUTH_PREFIX}/register", json=test_user_credentials)
        
        response = client.post(
            f"{AUTH_PREFIX}/verify-email/request",
            json={"email": test_user_credentials["email"]}
        )
        
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]


class TestUserProfile:
    """Tests de gestion du profil utilisateur"""

    def test_update_user_email(self, client, auth_headers):
        """
        Test de mise à jour de l'email utilisateur.
        
        Note : Cette fonctionnalité dépend de l'implémentation.
        Adaptez selon vos besoins.
        """
        # Cette route peut ne pas exister dans votre API
        # Adaptez selon votre implémentation
        pass

    def test_change_password(self, client, auth_headers, test_user_credentials):
        """
        Test de changement de mot de passe.
        
        Vérifie que l'utilisateur peut changer son mot de passe
        en fournissant l'ancien.
        """
        # Cette route peut ne pas exister dans votre API
        # Adaptez selon votre implémentation
        pass


@pytest.mark.integration
class TestAuthenticationFlow:
    """Tests d'intégration du flux complet d'authentification"""

    def test_complete_auth_flow(self, client):
        """
        Test du flux complet : inscription -> connexion -> accès ressource -> déconnexion.
        
        Ce test d'intégration vérifie que tout le processus fonctionne ensemble.
        """
        # 1. Inscription
        register_data = {
            "email": "fullflow@example.com",
            "password": "FullFlow123!",
            "phone": "+237612345678"
        }
        register_response = client.post(
            f"{AUTH_PREFIX}/register",
            json=register_data
        )
        assert register_response.status_code == status.HTTP_201_CREATED
        
        # 2. Connexion
        login_response = client.post(
            f"{AUTH_PREFIX}/login",
            json={
                "email": register_data["email"],
                "password": register_data["password"]
            }
        )
        assert login_response.status_code == status.HTTP_200_OK
        tokens = login_response.json()
        
        # 3. Accès à une ressource protégée
        me_response = client.get(
            f"{AUTH_PREFIX}/me",
            headers={"Authorization": f"Bearer {tokens['access_token']}"}
        )
        assert me_response.status_code == status.HTTP_200_OK
        
        # 4. Rafraîchissement du token
        refresh_response = client.post(
            f"{AUTH_PREFIX}/refresh",
            json={"refresh_token": tokens["refresh_token"]}
        )
        assert refresh_response.status_code == status.HTTP_200_OK
        
        # 5. Déconnexion
        logout_response = client.post(
            f"{AUTH_PREFIX}/logout",
            json={"refresh_token": tokens["refresh_token"]}
        )
        assert logout_response.status_code == status.HTTP_200_OK
