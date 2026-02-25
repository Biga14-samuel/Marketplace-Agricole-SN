import os
import pytest
import logging
from typing import Generator
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient

# Désactiver TOUS les logs pendant les tests sauf les erreurs critiques
logging.getLogger('sqlalchemy').setLevel(logging.ERROR)
logging.getLogger('sqlalchemy.engine').setLevel(logging.ERROR)
logging.getLogger('sqlalchemy.pool').setLevel(logging.ERROR)
logging.getLogger('sqlalchemy.dialects').setLevel(logging.ERROR)

# Utiliser marketplace_db PostgreSQL : DATABASE_URL doit être défini dans .env
# (ex: postgresql://user:password@localhost:5432/marketplace_db)
os.environ.setdefault("SECRET_KEY", "test_secret_key_for_testing_only")

from app.main import app as application
from app.core.database import get_db, Base, engine
from app.core import deps
import app.main as main_module

from app.core.init_roles import init_roles
from app.core.init_catalog import init_catalog


@pytest.fixture(scope="function")
def test_db() -> Generator[Session, None, None]:
    """
    Session de test sur PostgreSQL marketplace_db.
    Chaque test s'exécute dans une transaction qui est annulée (rollback) à la fin,
    donc la base n'est pas modifiée de façon persistante.
    """
    connection = engine.connect()
    trans = connection.begin()
    session = Session(bind=connection, expire_on_commit=False)

    try:
        # Créer toutes les tables
        Base.metadata.create_all(bind=connection)
        
        # Initialiser les données de base
        init_roles(session)
        init_catalog(session)
        session.flush()
        
        yield session
    finally:
        session.close()
        trans.rollback()
        connection.close()


@pytest.fixture(scope="function")
def client(test_db: Session) -> Generator[TestClient, None, None]:
    """
    Client de test FastAPI avec base de données isolée.
    
    Cette fixture :
    1. Override la dépendance get_db
    2. Crée un TestClient
    3. Nettoie les overrides après le test
    
    Args:
        test_db: Session de base de données de test
        
    Yields:
        TestClient: Client pour effectuer les requêtes HTTP
    """
    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    # Override des dépendances (application = instance FastAPI depuis app.main)
    application.dependency_overrides[get_db] = override_get_db
    application.dependency_overrides[deps.get_db] = override_get_db

    # Le lifespan utilise SessionLocal() : on le fait pointer vers la même connexion
    # que test_db (même transaction PostgreSQL, rollback en fin de test)
    session_factory_for_lifespan = sessionmaker(
        bind=test_db.get_bind(),
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
    )
    original_SessionLocal = main_module.SessionLocal
    main_module.SessionLocal = session_factory_for_lifespan
    try:
        with TestClient(application) as test_client:
            yield test_client
    finally:
        main_module.SessionLocal = original_SessionLocal
        application.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user_credentials():
    """
    Credentials de test pour un utilisateur standard.
    
    Returns:
        dict: Email et mot de passe de test
    """
    return {
        "email": "test_user@marketplace.com",
        "password": "TestPassword123!"
    }


@pytest.fixture(scope="function")
def registered_user(client: TestClient, test_user_credentials: dict) -> dict:
    """
    Crée et retourne un utilisateur enregistré.
    
    Args:
        client: Client de test
        test_user_credentials: Credentials à utiliser
        
    Returns:
        dict: Informations de l'utilisateur créé
    """
    response = client.post(
        "/authentification/auth/register",
        json=test_user_credentials
    )
    assert response.status_code == 201
    
    # Connecter l'utilisateur pour récupérer ses infos
    login_response = client.post(
        "/authentification/auth/login",
        json={
            "email": test_user_credentials["email"],
            "password": test_user_credentials["password"]
        }
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    
    # Récupérer les infos utilisateur via le token
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}
    me_response = client.get("/authentification/auth/me", headers=headers)
    assert me_response.status_code == 200
    
    return me_response.json()


@pytest.fixture(scope="function")
def auth_headers(client: TestClient, test_user_credentials: dict) -> dict:
    """
    Crée un utilisateur et retourne les headers d'authentification.
    
    Cette fixture est la plus utilisée car elle fournit directement
    les headers nécessaires pour les requêtes authentifiées.
    
    Args:
        client: Client de test
        test_user_credentials: Credentials à utiliser
        
    Returns:
        dict: Headers HTTP avec le token Bearer
    """
    # Enregistrer l'utilisateur
    client.post(
        "/authentification/auth/register",
        json=test_user_credentials
    )
    
    # Se connecter
    login_response = client.post(
        "/authentification/auth/login",
        json=test_user_credentials
    )
    assert login_response.status_code == 200
    
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def auth_user_with_profile(client: TestClient, auth_headers: dict) -> dict:
    """
    Utilisateur authentifié avec un profil client créé.
    
    Args:
        client: Client de test
        auth_headers: Headers d'authentification
        
    Returns:
        dict: Informations du profil créé
    """
    profile_data = {
        "first_name": "Aubin",
        "last_name": "Biga",
        "preferences": {}
    }
    
    response = client.post(
        "/customer-profiles/customers/profile",
        headers=auth_headers,
        json=profile_data
    )
    assert response.status_code == 201
    return response.json()


@pytest.fixture(scope="function")
def producer_credentials():
    """
    Credentials pour un utilisateur producteur.
    
    Returns:
        dict: Email et mot de passe pour producteur
    """
    return {
        "email": "producer@marketplace.com",
        "password": "ProducerPass123!"
    }


@pytest.fixture(scope="function")
def producer_headers(client: TestClient, producer_credentials: dict) -> dict:
    """
    Headers d'authentification pour un producteur.
    
    Args:
        client: Client de test
        producer_credentials: Credentials du producteur
        
    Returns:
        dict: Headers HTTP avec token Bearer
    """
    # Enregistrer le producteur
    client.post(
        "/authentification/auth/register",
        json=producer_credentials
    )
    
    # Se connecter
    login_response = client.post(
        "/authentification/auth/login",
        json=producer_credentials
    )
    assert login_response.status_code == 200
    
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def producer_with_profile(client: TestClient, producer_headers: dict) -> dict:
    """
    Producteur avec profil complet créé.
    
    Args:
        client: Client de test
        producer_headers: Headers d'authentification producteur
        
    Returns:
        dict: Informations du profil producteur
    """
    profile_data = {
        "business_name": "Ferme Bio Test",
        "bio": "Production locale et biologique de légumes frais",
        "certifications": ["bio", "local"],
        "siret": "12345678901234",
        "farm_size": 5.0,
        "production_type": ["vegetables", "fruits"]
    }
    
    response = client.post(
        "/producer-profiles/producers/profile",
        headers=producer_headers,
        json=profile_data
    )
    assert response.status_code == 201
    return response.json()


# Marqueurs pytest personnalisés
def pytest_configure(config):
    """Configuration des marqueurs pytest personnalisés."""
    config.addinivalue_line(
        "markers", "slow: marque les tests lents"
    )
    config.addinivalue_line(
        "markers", "integration: tests d'intégration"
    )
    config.addinivalue_line(
        "markers", "unit: tests unitaires"
    )
