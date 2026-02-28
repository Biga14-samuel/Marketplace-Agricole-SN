from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status, UploadFile, File, Form, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path
from uuid import uuid4
import shutil

from app.core.database import get_db
from app.routers.auth_router import get_current_user
from app.services.profile_service import ProducerProfileService, PickupPointService, ProducerScheduleService
from app.services.auth_service import AuthService
from app.schemas.profile_schema import (
    ProducerProfileCreate, ProducerProfileUpdate, ProducerProfileResponse, ProducerProfileComplete,
    ProducerDocumentResponse, DocumentTypeEnum,
    PickupPointCreate, PickupPointUpdate, PickupPointResponse,
    PickupSlotCreate, PickupSlotUpdate, PickupSlotResponse,
    ProducerScheduleCreate, ProducerScheduleUpdate, ProducerScheduleResponse
)
from app.schemas.auth_schema import MessageResponse

router = APIRouter(prefix="/producers", tags=["Producer Profiles"])

ALLOWED_PROFILE_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_PROFILE_IMAGE_SIZE_BYTES = 8 * 1024 * 1024  # 8MB

# ============= Dependencies =============

def get_producer_service(db: Session = Depends(get_db)) -> ProducerProfileService:
    """Dependency pour obtenir le service producer"""
    return ProducerProfileService(db)


def get_pickup_service(db: Session = Depends(get_db)) -> PickupPointService:
    """Dependency pour obtenir le service pickup"""
    return PickupPointService(db)


def get_schedule_service(db: Session = Depends(get_db)) -> ProducerScheduleService:
    """Dependency pour obtenir le service schedule"""
    return ProducerScheduleService(db)


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Dependency pour obtenir le service d'authentification"""
    return AuthService(db)


def _validate_profile_image_upload(file: UploadFile) -> str:
    filename = (file.filename or "image.bin").replace(" ", "_")
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_PROFILE_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format d'image non supporté. Utilisez JPG, PNG, WEBP ou GIF."
        )

    content_type = (file.content_type or "").lower()
    if not content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le fichier envoyé n'est pas une image valide."
        )

    return extension


async def _save_profile_image(file: UploadFile, user_id: int, image_kind: str) -> str:
    extension = _validate_profile_image_upload(file)
    target_dir = Path("uploads") / "producers" / str(user_id)
    target_dir.mkdir(parents=True, exist_ok=True)

    stored_filename = (
        f"{int(datetime.now(timezone.utc).timestamp())}-"
        f"{image_kind}-{uuid4().hex}{extension}"
    )
    target_path = target_dir / stored_filename

    file.file.seek(0, 2)
    size_bytes = file.file.tell()
    file.file.seek(0)
    if size_bytes > MAX_PROFILE_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image trop volumineuse (max 8MB)."
        )

    try:
        with target_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Impossible d'enregistrer l'image: {exc}"
        ) from exc
    finally:
        await file.close()

    return f"/uploads/producers/{user_id}/{stored_filename}"


# ============= Producer Profile Endpoints =============

@router.post(
    "/profile",
    response_model=ProducerProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un profil producteur"
)
def create_producer_profile(
    profile_data: ProducerProfileCreate,
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    """
    Crée un profil producteur pour l'utilisateur connecté.
    """
    profile = producer_service.create_profile(current_user.id, profile_data)
    return ProducerProfileResponse.model_validate(profile)


@router.get(
    "/profile",
    response_model=ProducerProfileResponse,
    summary="Obtenir mon profil producteur"
)
def get_my_profile(
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    """
    Récupère le profil producteur de l'utilisateur connecté.
    """
    profile = producer_service.get_profile(current_user.id)
    return ProducerProfileResponse.model_validate(profile)


@router.get(
    "/profile/complete",
    response_model=ProducerProfileComplete,
    summary="Obtenir mon profil complet"
)
def get_my_complete_profile(
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    """
    Récupère le profil producteur complet avec tous les détails.
    """
    profile = producer_service.get_complete_profile(current_user.id)
    return ProducerProfileComplete.model_validate(profile)


@router.put(
    "/profile",
    response_model=ProducerProfileResponse,
    summary="Mettre à jour mon profil producteur"
)
def update_my_profile(
    profile_data: ProducerProfileUpdate,
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    """
    Met à jour le profil producteur de l'utilisateur connecté.
    """
    profile = producer_service.update_profile(current_user.id, profile_data)
    return ProducerProfileResponse.model_validate(profile)


@router.post(
    "/profile/avatar",
    response_model=ProducerProfileResponse,
    summary="Uploader la photo de profil producteur"
)
async def upload_profile_avatar(
    request: Request,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    """
    Upload la photo de profil (avatar) du producteur connecté.
    """
    public_path = await _save_profile_image(file, current_user.id, "avatar")
    public_url = str(request.base_url).rstrip('/') + public_path
    profile = producer_service.update_profile(
        current_user.id,
        ProducerProfileUpdate(avatar=public_url)
    )
    return ProducerProfileResponse.model_validate(profile)


@router.post(
    "/profile/cover-image",
    response_model=ProducerProfileResponse,
    summary="Uploader la photo de couverture producteur"
)
async def upload_profile_cover_image(
    request: Request,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    """
    Upload la photo de couverture du producteur connecté.
    """
    public_path = await _save_profile_image(file, current_user.id, "cover")
    public_url = str(request.base_url).rstrip('/') + public_path
    profile = producer_service.update_profile(
        current_user.id,
        ProducerProfileUpdate(cover_image=public_url)
    )
    return ProducerProfileResponse.model_validate(profile)


@router.get(
    "/verified",
    response_model=List[ProducerProfileResponse],
    summary="Obtenir la liste des producteurs vérifiés"
)
def get_verified_producers(
    skip: int = 0,
    limit: int = 100,
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    """
    Récupère la liste des producteurs vérifiés. (Route publique)
    """
    producers = producer_service.get_verified_producers(skip, limit)
    return [ProducerProfileResponse.model_validate(p) for p in producers]


# ============= Producer Documents & Verification =============

@router.post(
    "/documents",
    response_model=ProducerDocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Uploader un document producteur"
)
async def upload_producer_document(
    type: str = Form(...),
    file: UploadFile = File(...),
    expires_at: Optional[datetime] = Form(None),
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    """
    Uploade un document légal (kbis/insurance/certification) pour le producteur connecté.
    Le fichier est stocké sur disque puis son chemin public est enregistré en base.
    """
    try:
        document_type = DocumentTypeEnum(type)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Type de document invalide (kbis, insurance, certification)"
        )

    safe_name = (file.filename or "document.bin").replace(" ", "_")
    extension = Path(safe_name).suffix.lower()
    target_dir = Path("uploads") / "producers" / str(current_user.id)
    target_dir.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{int(datetime.now(timezone.utc).timestamp())}-{uuid4().hex}{extension or '.bin'}"
    target_path = target_dir / stored_filename

    try:
        with target_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Impossible d'enregistrer le document: {exc}"
        ) from exc
    finally:
        await file.close()

    stored_path = f"/uploads/producers/{current_user.id}/{stored_filename}"
    document = producer_service.upload_document(
        user_id=current_user.id,
        document_type=document_type,
        file_path=stored_path,
        original_filename=file.filename or safe_name,
        expires_at=expires_at
    )
    return ProducerDocumentResponse.model_validate(document)


@router.get(
    "/documents",
    response_model=List[ProducerDocumentResponse],
    summary="Lister mes documents producteur"
)
def get_producer_documents(
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    documents = producer_service.get_documents(current_user.id)
    return [ProducerDocumentResponse.model_validate(doc) for doc in documents]


@router.delete(
    "/documents/{document_id}",
    response_model=MessageResponse,
    summary="Supprimer un document producteur"
)
def delete_producer_document(
    document_id: int,
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    producer_service.delete_document(current_user.id, document_id)
    return MessageResponse(message="Document supprimé avec succès")


@router.post(
    "/verification/submit",
    response_model=MessageResponse,
    summary="Soumettre le dossier producteur"
)
def submit_producer_verification(
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    result = producer_service.submit_for_verification(current_user.id)
    return MessageResponse(message=result.get("message", "Dossier soumis"))


@router.get(
    "/verification/status",
    summary="Consulter le statut de vérification producteur"
)
def get_producer_verification_status(
    current_user=Depends(get_current_user),
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    return producer_service.get_verification_status(current_user.id)


# ============= Producer Schedule Endpoints =============

@router.post(
    "/schedules",
    response_model=ProducerScheduleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un horaire d'ouverture"
)
def create_schedule(
    schedule_data: ProducerScheduleCreate,
    current_user=Depends(get_current_user),
    schedule_service: ProducerScheduleService = Depends(get_schedule_service)
):
    """
    Crée un horaire d'ouverture pour le producteur connecté.
    """
    schedule = schedule_service.create_schedule(current_user.id, schedule_data)
    return ProducerScheduleResponse.model_validate(schedule)


@router.get(
    "/schedules",
    response_model=List[ProducerScheduleResponse],
    summary="Obtenir mes horaires"
)
def get_my_schedules(
    current_user=Depends(get_current_user),
    schedule_service: ProducerScheduleService = Depends(get_schedule_service)
):
    """
    Récupère tous les horaires du producteur connecté.
    """
    schedules = schedule_service.get_producer_schedules(current_user.id)
    return [ProducerScheduleResponse.model_validate(s) for s in schedules]


@router.post(
    "/schedule",
    response_model=ProducerScheduleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un horaire d'ouverture (alias)"
)
def create_schedule_alias(
    schedule_data: ProducerScheduleCreate,
    current_user=Depends(get_current_user),
    schedule_service: ProducerScheduleService = Depends(get_schedule_service)
):
    schedule = schedule_service.create_schedule(current_user.id, schedule_data)
    return ProducerScheduleResponse.model_validate(schedule)


@router.get(
    "/schedule",
    response_model=List[ProducerScheduleResponse],
    summary="Obtenir mes horaires (alias)"
)
def get_my_schedule_alias(
    current_user=Depends(get_current_user),
    schedule_service: ProducerScheduleService = Depends(get_schedule_service)
):
    schedules = schedule_service.get_producer_schedules(current_user.id)
    return [ProducerScheduleResponse.model_validate(s) for s in schedules]


@router.get(
    "/schedules/{schedule_id}",
    response_model=ProducerScheduleResponse,
    summary="Obtenir un horaire spécifique"
)
def get_schedule(
    schedule_id: int,
    current_user=Depends(get_current_user),
    schedule_service: ProducerScheduleService = Depends(get_schedule_service)
):
    """
    Récupère un horaire spécifique par son ID.
    """
    schedule = schedule_service.get_schedule(schedule_id, current_user.id)
    return ProducerScheduleResponse.model_validate(schedule)


@router.put(
    "/schedules/{schedule_id}",
    response_model=ProducerScheduleResponse,
    summary="Mettre à jour un horaire"
)
def update_schedule(
    schedule_id: int,
    schedule_data: ProducerScheduleUpdate,
    current_user=Depends(get_current_user),
    schedule_service: ProducerScheduleService = Depends(get_schedule_service)
):
    """
    Met à jour un horaire existant.
    """
    schedule = schedule_service.update_schedule(schedule_id, current_user.id, schedule_data)
    return ProducerScheduleResponse.model_validate(schedule)


@router.delete(
    "/schedules/{schedule_id}",
    response_model=MessageResponse,
    summary="Supprimer un horaire"
)
def delete_schedule(
    schedule_id: int,
    current_user=Depends(get_current_user),
    schedule_service: ProducerScheduleService = Depends(get_schedule_service)
):
    """
    Supprime un horaire.
    """
    schedule_service.delete_schedule(schedule_id, current_user.id)
    return MessageResponse(message="Horaire supprimé avec succès")


# ============= Pickup Point Endpoints =============

@router.post(
    "/pickup-points",
    response_model=PickupPointResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un point de retrait"
)
def create_pickup_point(
    point_data: PickupPointCreate,
    current_user=Depends(get_current_user),
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    """
    Crée un point de retrait pour le producteur connecté.
    """
    point = pickup_service.create_point(current_user.id, point_data)
    return PickupPointResponse.model_validate(point)


@router.get(
    "/pickup-points",
    response_model=List[PickupPointResponse],
    summary="Obtenir mes points de retrait"
)
def get_my_pickup_points(
    active_only: bool = False,
    current_user=Depends(get_current_user),
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    """
    Récupère tous les points de retrait du producteur connecté.
    """
    points = pickup_service.get_producer_points(current_user.id, active_only)
    return [PickupPointResponse.model_validate(p) for p in points]


@router.get(
    "/pickup-points/{point_id}",
    response_model=PickupPointResponse,
    summary="Obtenir un point de retrait"
)
def get_pickup_point(
    point_id: int,
    current_user=Depends(get_current_user),
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    """
    Récupère un point de retrait spécifique par son ID.
    """
    point = pickup_service.get_point(point_id, current_user.id)
    return PickupPointResponse.model_validate(point)


@router.put(
    "/pickup-points/{point_id}",
    response_model=PickupPointResponse,
    summary="Mettre à jour un point de retrait"
)
def update_pickup_point(
    point_id: int,
    point_data: PickupPointUpdate,
    current_user=Depends(get_current_user),
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    """
    Met à jour un point de retrait existant.
    """
    point = pickup_service.update_point(point_id, current_user.id, point_data)
    return PickupPointResponse.model_validate(point)


@router.delete(
    "/pickup-points/{point_id}",
    response_model=MessageResponse,
    summary="Supprimer un point de retrait"
)
def delete_pickup_point(
    point_id: int,
    current_user=Depends(get_current_user),
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    """
    Supprime un point de retrait.
    """
    pickup_service.delete_point(point_id, current_user.id)
    return MessageResponse(message="Point de retrait supprimé avec succès")


# ============= Pickup Slot Endpoints =============

@router.post(
    "/pickup-points/{point_id}/slots",
    response_model=PickupSlotResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un créneau de retrait"
)
def create_pickup_slot(
    point_id: int,
    slot_data: PickupSlotCreate,
    current_user=Depends(get_current_user),
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    """
    Crée un créneau horaire pour un point de retrait.
    """
    slot = pickup_service.create_slot(point_id, current_user.id, slot_data)
    return PickupSlotResponse.model_validate(slot)


@router.get(
    "/pickup-points/{point_id}/slots",
    response_model=List[PickupSlotResponse],
    summary="Obtenir les créneaux d'un point de retrait"
)
def get_pickup_slots(
    point_id: int,
    active_only: bool = False,
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    """
    Récupère tous les créneaux d'un point de retrait. (Route publique)
    """
    slots = pickup_service.get_point_slots(point_id, active_only)
    return [PickupSlotResponse.model_validate(s) for s in slots]


@router.get(
    "/pickup-points/{point_id}/slots/available",
    response_model=List[PickupSlotResponse],
    summary="Obtenir les créneaux disponibles pour un jour"
)
def get_available_slots(
    point_id: int,
    day_of_week: str,
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    """
    Récupère les créneaux disponibles pour un jour donné. (Route publique)
    """
    slots = pickup_service.get_available_slots(point_id, day_of_week)
    return [PickupSlotResponse.model_validate(s) for s in slots]


@router.get(
    "/pickup-slots/{slot_id}",
    response_model=PickupSlotResponse,
    summary="Obtenir un créneau de retrait"
)
def get_pickup_slot(
    slot_id: int,
    current_user=Depends(get_current_user),
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    slot = pickup_service.get_slot(slot_id, current_user.id)
    return PickupSlotResponse.model_validate(slot)


@router.put(
    "/pickup-slots/{slot_id}",
    response_model=PickupSlotResponse,
    summary="Mettre à jour un créneau de retrait"
)
def update_pickup_slot(
    slot_id: int,
    slot_data: PickupSlotUpdate,
    current_user=Depends(get_current_user),
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    slot = pickup_service.update_slot(slot_id, current_user.id, slot_data)
    return PickupSlotResponse.model_validate(slot)


@router.delete(
    "/pickup-slots/{slot_id}",
    response_model=MessageResponse,
    summary="Supprimer un créneau de retrait"
)
def delete_pickup_slot(
    slot_id: int,
    current_user=Depends(get_current_user),
    pickup_service: PickupPointService = Depends(get_pickup_service)
):
    pickup_service.delete_slot(slot_id, current_user.id)
    return MessageResponse(message="Créneau supprimé avec succès")


@router.get(
    "/{producer_id}",
    response_model=ProducerProfileResponse,
    summary="Obtenir un profil producteur public"
)
def get_public_producer_profile(
    producer_id: int,
    producer_service: ProducerProfileService = Depends(get_producer_service)
):
    """
    Récupère les informations publiques d'un profil producteur.
    Accessible sans authentification.
    """
    return producer_service.get_public_profile(producer_id)
