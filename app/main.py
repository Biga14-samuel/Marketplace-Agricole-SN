from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import asyncio
import os

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.init_roles import init_roles
from app.core.init_catalog import init_catalog

# --- IMPORT DES MODÈLES (Pour enregistrement dans Base.metadata) ---
import app.models 

# --- IMPORT DES ROUTERS ---
from app.routers import (
    auth_router,
    customer_profile_router,
    producer_profile_router,
    product_router,
    order_router,
    reviews,
    communication as communication_router,
    payments as payments_router,
    promotions,
    analytics as analytics_router,
    subscriptions as subscriptions_router,
    delivery,
    wishlist,
    event,
    admin,
    cms as cms_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gère le démarrage et l'arrêt de l'application (Initialisation DB)."""
    db = SessionLocal()
    try:
        init_roles(db)
        init_catalog(db)
    finally:
        db.close()
    yield 

# Initialisation de l'API
app = FastAPI(
    title=settings.APP_NAME, 
    version="1.1.6", 
    lifespan=lifespan,
    description="Marketplace Agricole - Système de gestion et abonnements"
)

# Ajouter un middleware pour gérer les timeouts
@app.middleware("http")
async def timeout_middleware(request, call_next):
    try:
        # Timeout de 180 secondes (3 minutes) pour toutes les requêtes
        response = await asyncio.wait_for(call_next(request), timeout=180.0)
        return response
    except asyncio.TimeoutError:
        from fastapi import HTTPException
        raise HTTPException(status_code=408, detail="Request timeout")

# Affichage de debug utile pour les problèmes d'envoi d'emails (NE PAS afficher le mot de passe)
print("[startup] SKIP_EMAIL_VERIFICATION=", settings.SKIP_EMAIL_VERIFICATION)
print("[startup] MAIL_USERNAME=", settings.MAIL_USERNAME)
print("[startup] MAIL_FROM=", settings.MAIL_FROM)
print("[startup] FRONTEND_URL=", settings.FRONTEND_URL)

# --- CONFIGURATION CORS ---
# ✅ FIX CRITIQUE: Configuration CORS sécurisée
# JAMAIS allow_origins=["*"] avec allow_credentials=True (interdit par spec CORS)
allowed_origins = [
    "http://localhost:5173",  # Frontend dev Vite
    "http://localhost:5174",  # Frontend dev (port alternatif)
    "http://localhost:3000",  # Alternative frontend port
    "http://127.0.0.1:5173",  # Localhost IP
]

# En production, ajouter les domaines autorisés via variable d'environnement
if hasattr(settings, 'ALLOWED_ORIGINS') and settings.ALLOWED_ORIGINS:
    additional_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(',') if origin.strip()]
    allowed_origins.extend(additional_origins)

print(f"[CORS] Origines autorisées: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # ✅ Liste explicite au lieu de ["*"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],  # Permet au frontend de lire tous les headers de réponse
)

# --- CONFIGURATION DES FICHIERS STATIQUES ---
# Créer le dossier uploads s'il n'existe pas
UPLOADS_DIR = "uploads"
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)
    print(f"[startup] Dossier {UPLOADS_DIR} créé")

# Monter le dossier uploads pour servir les fichiers statiques
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
print("[startup] Fichiers statiques montés sur /uploads")

# --- INCLUSION DES ROUTERS ---
def include_router_with_legacy_prefix(router_obj, suffix: str, tags: list[str]):
    """
    Expose chaque route sous deux formes :
    - nouvelle: /api/v1/...
    - legacy: /...
    Cela maintient la compatibilité avec les tests/intégrations existants.
    """
    app.include_router(
        router_obj,
        prefix=f"{settings.API_V1_PREFIX}{suffix}",
        tags=tags
    )
    if settings.API_V1_PREFIX:
        app.include_router(
            router_obj,
            prefix=suffix,
            tags=tags,
            include_in_schema=False
        )

# Administration Système
include_router_with_legacy_prefix(admin.router, "/admin", ["Administration"])

# Authentification & Utilisateurs
include_router_with_legacy_prefix(auth_router.router, "/authentification", ["Authentication"])

include_router_with_legacy_prefix(customer_profile_router.router, "/customer-profiles", ["Customer Profiles"])

include_router_with_legacy_prefix(producer_profile_router.router, "/producer-profiles", ["Producer Profiles"])

# Catalogue & Commerce
include_router_with_legacy_prefix(product_router.router, "/products-catalog", ["Products & Catalog"])

include_router_with_legacy_prefix(order_router.router, "/orders", ["Orders"])

# Marketing & Finance
include_router_with_legacy_prefix(payments_router.router, "/payments", ["Payments & Invoices"])

include_router_with_legacy_prefix(promotions.router, "/promotions", ["Promotions"])

include_router_with_legacy_prefix(reviews.router, "/reviews", ["Product Reviews"])

# Communication & Analytics
include_router_with_legacy_prefix(communication_router.router, "/communication", ["Communication"])

include_router_with_legacy_prefix(analytics_router.router, "/analytics", ["Analytics"])

# Abonnements
include_router_with_legacy_prefix(subscriptions_router.router, "/subscription", ["Subscriptions"])

# Livraison & Listes
include_router_with_legacy_prefix(delivery.router, "/delivery", ["Delivery"])

include_router_with_legacy_prefix(wishlist.router, "/wishlist", ["Wishlist"])

include_router_with_legacy_prefix(event.router, "/events", ["Events"])

# CMS & Contenu
include_router_with_legacy_prefix(cms_router.router, "/cms", ["CMS & Content"])

@app.get("/", tags=["System"])
def read_root():
    return {
        "status": "online",
        "message": f"Bienvenue sur l'API de {settings.APP_NAME}",
        "docs": "/docs"
    }
