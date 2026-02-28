from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, time
from enum import Enum


# ============= Enums =============

class AddressTypeEnum(str, Enum):
    """Types d'adresses"""
    BILLING = "billing"
    DELIVERY = "delivery"


class DocumentTypeEnum(str, Enum):
    """Types de documents"""
    KBIS = "kbis"
    INSURANCE = "insurance"
    CERTIFICATION = "certification"


class DayOfWeekEnum(str, Enum):
    """Jours de la semaine"""
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"


# ============= Customer Profile Schemas =============

class CustomerProfileBase(BaseModel):
    """Schéma de base pour un profil client"""
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    avatar: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None


class CustomerProfileCreate(CustomerProfileBase):
    """Schéma pour créer un profil client"""
    pass


class CustomerProfileUpdate(BaseModel):
    """Schéma pour mettre à jour un profil client"""
    first_name: Optional[str] = Field(None, min_length=2, max_length=100)
    last_name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None


class CustomerProfileResponse(CustomerProfileBase):
    """Schéma de réponse pour un profil client"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Address Schemas =============

class AddressBase(BaseModel):
    """Schéma de base pour une adresse"""
    type: AddressTypeEnum
    street: str = Field(..., min_length=3, max_length=255)
    city: str = Field(..., min_length=2, max_length=100)
    postal_code: str = Field(..., min_length=2, max_length=20)
    country: str = Field(default="Cameroun", max_length=100)
    is_default: bool = False
    coordinates: Optional[str] = None
    additional_info: Optional[str] = None

    @field_validator('coordinates')
    @classmethod
    def validate_coordinates(cls, v):
        if v is not None:
            parts = v.split(',')
            if len(parts) != 2:
                raise ValueError('Les coordonnées doivent être au format "latitude,longitude"')
            try:
                lat, lon = float(parts[0]), float(parts[1])
                if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
                    raise ValueError('Coordonnées GPS invalides')
            except ValueError:
                raise ValueError('Les coordonnées doivent être des nombres valides')
        return v


class AddressCreate(AddressBase):
    """Schéma pour créer une adresse"""
    pass


class AddressUpdate(BaseModel):
    """Schéma pour mettre à jour une adresse"""
    type: Optional[AddressTypeEnum] = None
    street: Optional[str] = Field(None, min_length=3, max_length=255)
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    postal_code: Optional[str] = Field(None, min_length=2, max_length=20)
    country: Optional[str] = Field(None, max_length=100)
    is_default: Optional[bool] = None
    coordinates: Optional[str] = None
    additional_info: Optional[str] = None


class AddressResponse(AddressBase):
    """Schéma de réponse pour une adresse"""
    id: int
    customer_profile_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Producer Profile Schemas =============

class ProducerProfileBase(BaseModel):
    """Schéma de base pour un profil producteur"""
    business_name: str = Field(..., min_length=2, max_length=255)
    bio: Optional[str] = None
    certifications: Optional[List[str]] = None
    siret: Optional[str] = Field(None, max_length=14)
    tva_number: Optional[str] = Field(None, max_length=20)
    iban: Optional[str] = Field(None, max_length=34)
    farm_size: Optional[float] = Field(None, ge=0)
    production_type: Optional[List[str]] = None
    avatar: Optional[str] = None
    cover_image: Optional[str] = None

    @field_validator('siret')
    @classmethod
    def validate_siret(cls, v):
        if v is not None and len(v) not in [9, 14]:
            raise ValueError('Le SIRET doit contenir 9 ou 14 chiffres')
        return v

    @field_validator('iban')
    @classmethod
    def validate_iban(cls, v):
        if v is not None:
            # Validation basique de l'IBAN
            v = v.replace(' ', '').upper()
            if len(v) < 15 or len(v) > 34:
                raise ValueError('IBAN invalide (longueur incorrecte)')
        return v


class ProducerProfileCreate(ProducerProfileBase):
    """Schéma pour créer un profil producteur"""
    pass


class ProducerProfileUpdate(BaseModel):
    """Schéma pour mettre à jour un profil producteur"""
    business_name: Optional[str] = Field(None, min_length=2, max_length=255)
    bio: Optional[str] = None
    certifications: Optional[List[str]] = None
    siret: Optional[str] = Field(None, max_length=14)
    tva_number: Optional[str] = Field(None, max_length=20)
    iban: Optional[str] = Field(None, max_length=34)
    farm_size: Optional[float] = Field(None, ge=0)
    production_type: Optional[List[str]] = None
    avatar: Optional[str] = None
    cover_image: Optional[str] = None

    @field_validator('siret')
    @classmethod
    def validate_siret(cls, v):
        if v is None:
            return v
        normalized = v.replace(' ', '').strip()
        if normalized == '':
            return None
        if len(normalized) not in [9, 14]:
            raise ValueError('Le SIRET doit contenir 9 ou 14 chiffres')
        return normalized

    @field_validator('iban')
    @classmethod
    def validate_iban(cls, v):
        if v is None:
            return v
        normalized = v.replace(' ', '').strip().upper()
        if normalized == '':
            return None
        if len(normalized) < 15 or len(normalized) > 34:
            raise ValueError('IBAN invalide (longueur incorrecte)')
        return normalized


class ProducerProfileResponse(ProducerProfileBase):
    """Schéma de réponse pour un profil producteur"""
    id: int
    user_id: int
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Producer Document Schemas =============

class ProducerDocumentBase(BaseModel):
    """Schéma de base pour un document producteur"""
    type: DocumentTypeEnum
    original_filename: Optional[str] = None
    expires_at: Optional[datetime] = None


class ProducerDocumentCreate(ProducerDocumentBase):
    """Schéma pour créer un document"""
    file_path: str


class ProducerDocumentResponse(ProducerDocumentBase):
    """Schéma de réponse pour un document"""
    id: int
    producer_id: int
    file_path: str
    verified: bool
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Producer Schedule Schemas =============

class ProducerScheduleBase(BaseModel):
    """Schéma de base pour les horaires"""
    day_of_week: DayOfWeekEnum
    open_time: time
    close_time: time
    is_closed: bool = False

    @field_validator('close_time')
    @classmethod
    def validate_times(cls, v, info):
        if 'open_time' in info.data and info.data['open_time'] >= v:
            raise ValueError('L\'heure de fermeture doit être après l\'heure d\'ouverture')
        return v


class ProducerScheduleCreate(ProducerScheduleBase):
    """Schéma pour créer des horaires"""
    pass


class ProducerScheduleUpdate(BaseModel):
    """Schéma pour mettre à jour des horaires"""
    open_time: Optional[time] = None
    close_time: Optional[time] = None
    is_closed: Optional[bool] = None


class ProducerScheduleResponse(ProducerScheduleBase):
    """Schéma de réponse pour les horaires"""
    id: int
    producer_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Pickup Point Schemas =============

class PickupPointBase(BaseModel):
    """Schéma de base pour un point de retrait"""
    name: str = Field(..., min_length=2, max_length=255)
    address: str = Field(..., min_length=3)
    city: str = Field(..., min_length=2, max_length=100)
    postal_code: str = Field(..., min_length=2, max_length=20)
    coordinates: Optional[str] = None
    instructions: Optional[str] = None
    is_active: bool = True

    @field_validator('coordinates')
    @classmethod
    def validate_coordinates(cls, v):
        if v is not None:
            parts = v.split(',')
            if len(parts) != 2:
                raise ValueError('Les coordonnées doivent être au format "latitude,longitude"')
            try:
                lat, lon = float(parts[0]), float(parts[1])
                if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
                    raise ValueError('Coordonnées GPS invalides')
            except ValueError:
                raise ValueError('Les coordonnées doivent être des nombres valides')
        return v


class PickupPointCreate(PickupPointBase):
    """Schéma pour créer un point de retrait"""
    pass


class PickupPointUpdate(BaseModel):
    """Schéma pour mettre à jour un point de retrait"""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    address: Optional[str] = Field(None, min_length=3)
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    postal_code: Optional[str] = Field(None, min_length=2, max_length=20)
    coordinates: Optional[str] = None
    instructions: Optional[str] = None
    is_active: Optional[bool] = None


class PickupPointResponse(PickupPointBase):
    """Schéma de réponse pour un point de retrait"""
    id: int
    producer_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Pickup Slot Schemas =============

class PickupSlotBase(BaseModel):
    """Schéma de base pour un créneau de retrait"""
    day_of_week: DayOfWeekEnum
    start_time: time
    end_time: time
    max_orders: int = Field(default=10, ge=1, le=100)
    is_active: bool = True

    @field_validator('end_time')
    @classmethod
    def validate_times(cls, v, info):
        if 'start_time' in info.data and info.data['start_time'] >= v:
            raise ValueError("L'heure de fin doit être après l'heure de début")
        return v


class PickupSlotCreate(PickupSlotBase):
    """Schéma pour créer un créneau"""
    pass


class PickupSlotUpdate(BaseModel):
    """Schéma pour mettre à jour un créneau"""
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    max_orders: Optional[int] = Field(None, ge=1, le=100)
    is_active: Optional[bool] = None


class PickupSlotResponse(PickupSlotBase):
    """Schéma de réponse pour un créneau"""
    id: int
    pickup_point_id: int
    current_orders: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= Complete Profile Responses =============

class CustomerProfileComplete(CustomerProfileResponse):
    """Profil client complet avec adresses"""
    addresses: List[AddressResponse] = []

    model_config = ConfigDict(from_attributes=True)


class ProducerProfileComplete(ProducerProfileResponse):
    """Profil producteur complet avec tous les détails"""
    documents: List[ProducerDocumentResponse] = []
    schedules: List[ProducerScheduleResponse] = []
    pickup_points: List[PickupPointResponse] = []

    model_config = ConfigDict(from_attributes=True)
