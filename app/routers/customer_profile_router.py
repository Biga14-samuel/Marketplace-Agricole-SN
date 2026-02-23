from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.routers.auth_router import get_current_user
from app.services.profile_service import CustomerProfileService, AddressService
from app.services.auth_service import AuthService
from app.schemas.profile_schema import (
    CustomerProfileCreate, CustomerProfileUpdate, CustomerProfileResponse, CustomerProfileComplete,
    AddressCreate, AddressUpdate, AddressResponse
)
from app.schemas.auth_schema import MessageResponse

router = APIRouter(prefix="/customers", tags=["Customer Profiles"])

# ============= Dependencies =============

def get_customer_service(db: Session = Depends(get_db)) -> CustomerProfileService:
    """Dependency pour obtenir le service customer"""
    return CustomerProfileService(db)


def get_address_service(db: Session = Depends(get_db)) -> AddressService:
    """Dependency pour obtenir le service address"""
    return AddressService(db)


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Dependency pour obtenir le service d'authentification"""
    return AuthService(db)


# ============= Customer Profile Endpoints =============

@router.post(
    "/profile",
    # 
    response_model=CustomerProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un profil client"
)
@router.post(
    "/me",
    response_model=CustomerProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer mon profil client (alias)"
)
def create_customer_profile(
    profile_data: CustomerProfileCreate,
    current_user=Depends(get_current_user),
    customer_service: CustomerProfileService = Depends(get_customer_service)
):
    """
    Crée un profil client pour l'utilisateur connecté.
    """
    profile = customer_service.create_profile(current_user.id, profile_data)
    return CustomerProfileResponse.model_validate(profile)


@router.get(
    "/profile",
    response_model=CustomerProfileResponse,
    summary="Obtenir mon profil client"
)
@router.get(
    "/me",
    response_model=CustomerProfileResponse,
    summary="Obtenir mon profil client (alias)"
)
def get_my_profile(
    current_user=Depends(get_current_user),
    customer_service: CustomerProfileService = Depends(get_customer_service)
):
    """
    Récupère le profil client de l'utilisateur connecté.
    """
    profile = customer_service.get_profile(current_user.id)
    return CustomerProfileResponse.model_validate(profile)


@router.get(
    "/profile/complete",
    response_model=CustomerProfileComplete,
    summary="Obtenir mon profil complet avec adresses"
)
@router.get(
    "/me/complete",
    response_model=CustomerProfileComplete,
    summary="Obtenir mon profil complet (alias)"
)
def get_my_complete_profile(
    current_user=Depends(get_current_user),
    customer_service: CustomerProfileService = Depends(get_customer_service)
):
    """
    Récupère le profil client complet avec toutes les adresses.
    """
    profile = customer_service.get_complete_profile(current_user.id)
    return CustomerProfileComplete.model_validate(profile)


@router.put(
    "/profile",
    response_model=CustomerProfileResponse,
    summary="Mettre à jour mon profil client"
)
@router.put(
    "/me",
    response_model=CustomerProfileResponse,
    summary="Mettre à jour mon profil client (alias)"
)
def update_my_profile(
    profile_data: CustomerProfileUpdate,
    current_user=Depends(get_current_user),
    customer_service: CustomerProfileService = Depends(get_customer_service)
):
    """
    Met à jour le profil client de l'utilisateur connecté.
    """
    profile = customer_service.update_profile(current_user.id, profile_data)
    return CustomerProfileResponse.model_validate(profile)


@router.delete(
    "/profile",
    response_model=MessageResponse,
    summary="Supprimer mon profil client"
)
@router.delete(
    "/me",
    response_model=MessageResponse,
    summary="Supprimer mon profil client (alias)"
)
def delete_my_profile(
    current_user=Depends(get_current_user),
    customer_service: CustomerProfileService = Depends(get_customer_service)
):
    """
    Supprime le profil client de l'utilisateur connecté.
    """
    customer_service.delete_profile(current_user.id)
    return MessageResponse(message="Profil client supprimé avec succès")


# ============= Address Endpoints =============

@router.post(
    "/addresses",
    # 
    response_model=AddressResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ajouter une adresse"
)
@router.post(
    "/me/addresses",
    response_model=AddressResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ajouter une adresse (alias)"
)
def create_address(
    address_data: AddressCreate,
    current_user=Depends(get_current_user),
    address_service: AddressService = Depends(get_address_service)
):
    """
    Crée une nouvelle adresse pour l'utilisateur connecté.
    """
    address = address_service.create_address(current_user.id, address_data)
    return AddressResponse.model_validate(address)


@router.get(
    "/addresses",
    response_model=List[AddressResponse],
    summary="Obtenir toutes mes adresses"
)
@router.get(
    "/me/addresses",
    response_model=List[AddressResponse],
    summary="Obtenir toutes mes adresses (alias)"
)
def get_my_addresses(
    current_user=Depends(get_current_user),
    address_service: AddressService = Depends(get_address_service)
):
    """
    Récupère toutes les adresses de l'utilisateur connecté.
    """
    addresses = address_service.get_user_addresses(current_user.id)
    return [AddressResponse.model_validate(addr) for addr in addresses]


@router.get(
    "/addresses/{address_id}",
    response_model=AddressResponse,
    summary="Obtenir une adresse spécifique"
)
@router.get(
    "/me/addresses/{address_id}",
    response_model=AddressResponse,
    summary="Obtenir une adresse spécifique (alias)"
)
def get_address(
    address_id: int,
    current_user=Depends(get_current_user),
    address_service: AddressService = Depends(get_address_service)
):
    """
    Récupère une adresse spécifique par son ID.
    """
    address = address_service.get_address(address_id, current_user.id)
    return AddressResponse.model_validate(address)


@router.put(
    "/addresses/{address_id}",
    response_model=AddressResponse,
    summary="Mettre à jour une adresse"
)
@router.put(
    "/me/addresses/{address_id}",
    response_model=AddressResponse,
    summary="Mettre à jour une adresse (alias)"
)
def update_address(
    address_id: int,
    address_data: AddressUpdate,
    current_user=Depends(get_current_user),
    address_service: AddressService = Depends(get_address_service)
):
    """
    Met à jour une adresse existante.
    """
    address = address_service.update_address(address_id, current_user.id, address_data)
    return AddressResponse.model_validate(address)


@router.delete(
    "/addresses/{address_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer une adresse"
)
@router.delete(
    "/me/addresses/{address_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer une adresse (alias)"
)
def delete_address(
    address_id: int,
    current_user=Depends(get_current_user),
    address_service: AddressService = Depends(get_address_service)
):
    """
    Supprime une adresse.
    """
    address_service.delete_address(address_id, current_user.id)


@router.post(
    "/addresses/{address_id}/set-default",
    response_model=AddressResponse,
    summary="Définir une adresse par défaut"
)
@router.post(
    "/me/addresses/{address_id}/set-default",
    response_model=AddressResponse,
    summary="Définir une adresse par défaut (alias)"
)
def set_default_address(
    address_id: int,
    current_user=Depends(get_current_user),
    address_service: AddressService = Depends(get_address_service)
):
    """
    Définit une adresse comme adresse par défaut pour son type.
    """
    address = address_service.set_default_address(address_id, current_user.id)
    return AddressResponse.model_validate(address)
