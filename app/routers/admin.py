from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session

from app.core import deps
from app.models.auth import User
from app.schemas.admin import (
    # Admin Actions
    AdminAction,
    AdminActionWithAdmin,
    # Banned Users
    BannedUser,
    BannedUserCreate,
    UnbanUser,
    # Content Moderation
    ContentModeration,
    ContentModerationCreate,
    ContentModerationReview,
    ContentModerationWithDetails,
    ModerationQueue,
    # System Settings
    SystemSetting,
    SystemSettingCreate,
    SystemSettingUpdate,
    SystemSettingPublic,
    # Commissions
    Commission,
    CommissionCreate,
    CommissionUpdate,
    # Tax Rates
    TaxRate,
    TaxRateCreate,
    TaxRateUpdate,
    # Stats
    ActionTypeEnum
)
from app.services.admin_service import (
    AdminActionService,
    BannedUserService,
    ContentModerationService,
    SystemSettingService,
    CommissionService,
    TaxRateService
)

router = APIRouter()


def require_admin(current_user: User = Depends(deps.get_current_active_user)) -> User:
    """
    Dépendance pour vérifier que l'utilisateur est un administrateur.
    
    Tous les endpoints de ce module nécessitent des privilèges administratifs.
    Cette fonction est utilisée comme dépendance pour protéger les routes.
    """
    if current_user.role not in ["admin", "superadmin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    return current_user


# ==================== JOURNAL D'AUDIT ====================

@router.get("/actions", response_model=List[AdminAction])
def get_admin_actions(
    *,
    db: Session = Depends(deps.get_db),
    admin_id: Optional[int] = Query(None, description="Filtrer par administrateur"),
    action_type: Optional[ActionTypeEnum] = Query(None, description="Filtrer par type d'action"),
    target_entity: Optional[str] = Query(None, description="Filtrer par type d'entité"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(require_admin)
):
    """
    Récupère le journal d'audit des actions administratives.
    
    Permet de voir tout ce qui a été fait par les administrateurs : qui a fait quoi,
    quand, et sur quelles entités. Essential pour la traçabilité et la sécurité.
    
    **Filtres disponibles :**
    - admin_id : Voir uniquement les actions d'un admin spécifique
    - action_type : Filtrer par type (bannissement, modération, etc.)
    - target_entity : Filtrer par type d'entité ciblée (user, product, order)
    
    **Cas d'usage :**
    - Auditer l'activité d'un administrateur suspect
    - Voir l'historique complet d'actions sur un utilisateur
    - Générer des rapports mensuels d'activité administrative
    """
    actions, total = AdminActionService.search_actions(
        db,
        admin_id=admin_id,
        action_type=action_type,
        target_entity=target_entity,
        limit=limit,
        offset=offset
    )
    
    return actions


@router.get("/actions/{action_id}", response_model=AdminActionWithAdmin)
def get_admin_action(
    *,
    db: Session = Depends(deps.get_db),
    action_id: int,
    current_user: User = Depends(require_admin)
):
    """
    Récupère les détails complets d'une action administrative.
    
    Affiche toutes les informations enregistrées pour une action spécifique,
    y compris les modifications effectuées (avant/après) et les métadonnées.
    """
    # Cette route serait implémentée avec le repository approprié
    # Simplifié ici pour l'exemple
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/actions/recent", response_model=List[AdminAction])
def get_recent_admin_actions(
    *,
    db: Session = Depends(deps.get_db),
    hours: int = Query(24, ge=1, le=168, description="Nombre d'heures à remonter"),
    current_user: User = Depends(require_admin)
):
    """
    Récupère les actions administratives récentes.
    
    Affiché sur le tableau de bord pour voir en temps réel ce qui se passe.
    Par défaut, affiche les dernières 24 heures.
    """
    return AdminActionService.get_recent_activity_feed(db, hours)


# ==================== UTILISATEURS BANNIS ====================

@router.post("/bans", response_model=BannedUser, status_code=status.HTTP_201_CREATED)
def ban_user(
    *,
    db: Session = Depends(deps.get_db),
    ban_data: BannedUserCreate,
    request: Request,
    current_user: User = Depends(require_admin)
):
    """
    Banni un utilisateur de la plateforme.
    
    Cette action grave doit être justifiée et documentée. Le système enregistre
    automatiquement qui a banni, quand, pourquoi, et pour combien de temps.
    
    **Types de bannissement :**
    - **Temporaire** : L'utilisateur est suspendu jusqu'à une date précise
    - **Permanent** : L'utilisateur est banni définitivement
    
    **Informations requises :**
    - Raison du bannissement (minimum 10 caractères)
    - Type de violation (spam, harassment, fraud, etc.)
    - Durée (si temporaire) ou permanent
    - Preuves optionnelles (URLs, captures d'écran)
    
    **Ce qui se passe après :**
    - L'utilisateur est immédiatement déconnecté
    - Toutes ses sessions actives sont invalidées
    - Il ne peut plus se reconnecter jusqu'à la fin du ban
    - Un email de notification est envoyé (à implémenter)
    """
    try:
        # Récupérer l'IP du requérant pour l'audit
        ip_address = request.client.host if request.client else None
        
        return BannedUserService.ban_user(
            db,
            ban_data,
            banned_by=current_user.id,
            ip_address=ip_address
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/bans", response_model=List[BannedUser])
def get_banned_users(
    *,
    db: Session = Depends(deps.get_db),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(require_admin)
):
    """
    Récupère la liste de tous les utilisateurs actuellement bannis.
    
    Affiche les bannissements actifs avec leurs détails : raison, durée, qui a banni.
    Utile pour gérer et suivre les sanctions en cours.
    """
    # Cette route utiliserait BannedUserRepository.get_all_active
    # Simplifié ici
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.post("/bans/{user_id}/unban", response_model=BannedUser)
def unban_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    unban_data: UnbanUser,
    request: Request,
    current_user: User = Depends(require_admin)
):
    """
    Débanni un utilisateur.
    
    Lève une sanction avant son expiration naturelle. Requiert une justification
    qui sera enregistrée dans le journal pour référence future.
    
    **Raisons courantes de débannissement :**
    - Appel accepté suite à contestation
    - Erreur de jugement initial
    - Circonstances atténuantes découvertes
    - Bonne conduite démontrée depuis le ban
    """
    ip_address = request.client.host if request.client else None
    
    result = BannedUserService.unban_user(
        db,
        user_id,
        unban_data,
        unbanned_by=current_user.id,
        ip_address=ip_address
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cet utilisateur n'est pas banni"
        )
    
    return result


@router.get("/bans/expiring", response_model=List[BannedUser])
def get_expiring_bans(
    *,
    db: Session = Depends(deps.get_db),
    days: int = Query(7, ge=1, le=30, description="Nombre de jours avant expiration"),
    current_user: User = Depends(require_admin)
):
    """
    Récupère les bannissements temporaires qui expirent bientôt.
    
    Permet de préparer la réintégration des utilisateurs ou de les notifier
    de leur retour prochain. Par défaut, affiche ceux qui expirent dans 7 jours.
    """
    return BannedUserService.get_expiring_bans(db, days)


# ==================== MODÉRATION DE CONTENU ====================

@router.post("/moderation", response_model=ContentModeration, status_code=status.HTTP_201_CREATED)
def report_content(
    *,
    db: Session = Depends(deps.get_db),
    report_data: ContentModerationCreate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Signale un contenu inapproprié.
    
    Les utilisateurs (et les admins) peuvent signaler des contenus problématiques :
    - Avis mensongers ou faux
    - Messages offensants ou harcelants
    - Produits frauduleux
    - Photos inappropriées
    
    **Le processus :**
    1. L'utilisateur signale le contenu en indiquant la raison
    2. Le signalement entre dans la file d'attente de modération
    3. Un modérateur examine le contenu et prend une décision
    4. L'action prise est enregistrée pour référence
    
    Si plusieurs utilisateurs signalent le même contenu, la priorité augmente
    automatiquement pour traitement urgent.
    """
    try:
        return ContentModerationService.report_content(
            db,
            report_data,
            reported_by=current_user.id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )


@router.get("/moderation/queue", response_model=List[ContentModerationWithDetails])
def get_moderation_queue(
    *,
    db: Session = Depends(deps.get_db),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(require_admin)
):
    """
    Récupère la file d'attente de modération.
    
    Affiche tous les contenus signalés en attente d'examen, triés par priorité.
    Les signalements les plus urgents (ceux avec plusieurs rapports) apparaissent
    en premier.
    
    **Interface de modération :**
    Pour chaque signalement, le modérateur voit :
    - Le contenu signalé (texte, image, produit)
    - Qui l'a signalé et pourquoi
    - Combien de fois il a été signalé
    - L'historique du créateur du contenu
    """
    return ContentModerationService.get_moderation_queue(db, limit)


@router.post("/moderation/{moderation_id}/review", response_model=ContentModeration)
def review_content(
    *,
    db: Session = Depends(deps.get_db),
    moderation_id: int,
    review_data: ContentModerationReview,
    request: Request,
    current_user: User = Depends(require_admin)
):
    """
    Examine et statue sur un contenu signalé.
    
    Le modérateur prend une décision après avoir examiné le contenu et le contexte :
    
    **Décisions possibles :**
    - **Approved** : Le contenu est ok, le signalement n'était pas fondé
    - **Rejected** : Le contenu viole les règles, il est supprimé/masqué
    - **Dismissed** : Le signalement était abusif ou malveillant
    
    **Actions prises :**
    - Suppression du contenu
    - Avertissement de l'auteur
    - Bannissement en cas de récidive
    - Aucune action si signalement non fondé
    
    Toutes les décisions sont enregistrées avec les notes du modérateur pour
    permettre une révision en cas de contestation.
    """
    ip_address = request.client.host if request.client else None
    
    result = ContentModerationService.review_content(
        db,
        moderation_id,
        review_data,
        reviewed_by=current_user.id,
        ip_address=ip_address
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Signalement non trouvé"
        )
    
    return result


@router.get("/moderation/stats", response_model=ModerationQueue)
def get_moderation_stats(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(require_admin)
):
    """
    Récupère des statistiques sur la modération.
    
    Affichées sur le tableau de bord administrateur :
    - Nombre de signalements en attente
    - Nombre de signalements haute priorité
    - Répartition par type de contenu
    - Signalement le plus ancien non traité
    
    Permet de surveiller la charge de travail et d'allouer des ressources.
    """
    stats = ContentModerationService.get_moderation_stats(db)
    
    # Transformer en format ModerationQueue
    # Simplifié ici
    return {
        "total_pending": stats.get("pending", 0),
        "high_priority": 0,  # À calculer
        "by_content_type": stats.get("by_content_type", {}),
        "oldest_pending": None  # À implémenter
    }


# ==================== PARAMÈTRES SYSTÈME ====================

@router.post("/settings", response_model=SystemSetting, status_code=status.HTTP_201_CREATED)
def create_system_setting(
    *,
    db: Session = Depends(deps.get_db),
    setting_data: SystemSettingCreate,
    request: Request,
    current_user: User = Depends(require_admin)
):
    """
    Crée un nouveau paramètre système.
    
    Les paramètres système permettent de configurer le comportement de l'application
    sans modifier le code. Exemples :
    
    **Paramètres généraux :**
    - site_name : "Ma Plateforme Locale"
    - maintenance_mode : true/false
    - registration_enabled : true/false
    
    **Paramètres de paiement :**
    - stripe_enabled : true/false
    - min_order_amount : 10.00
    - max_order_amount : 1000.00
    
    **Paramètres de sécurité :**
    - max_login_attempts : 5
    - session_timeout_minutes : 60
    - password_min_length : 8
    
    Chaque paramètre a un type (string, integer, boolean, json) qui détermine
    comment sa valeur est validée et convertie.
    """
    try:
        ip_address = request.client.host if request.client else None
        
        return SystemSettingService.create_setting(
            db,
            setting_data,
            created_by=current_user.id,
            ip_address=ip_address
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/settings", response_model=List[SystemSetting])
def get_all_settings(
    *,
    db: Session = Depends(deps.get_db),
    category: Optional[str] = Query(None, description="Filtrer par catégorie"),
    current_user: User = Depends(require_admin)
):
    """
    Récupère tous les paramètres système.
    
    Permet de voir et gérer tous les paramètres de configuration de la plateforme.
    Peut être filtré par catégorie pour faciliter la navigation.
    """
    if category:
        return SystemSettingService.get_settings_by_category(db, category)
    
    return SystemSettingService.get_all_settings(db)


@router.get("/settings/public", response_model=List[SystemSettingPublic])
def get_public_settings(
    *,
    db: Session = Depends(deps.get_db)
):
    """
    Récupère les paramètres système publics.
    
    Cette route est accessible sans authentification et retourne uniquement
    les paramètres marqués comme publics (is_public=true).
    
    **Exemples de paramètres publics :**
    - Nom du site
    - Modes de paiement acceptés
    - Devise utilisée
    - Pays de livraison disponibles
    
    **Jamais public :**
    - Clés API
    - Mots de passe
    - Paramètres de sécurité internes
    """
    return SystemSettingService.get_public_settings(db)


@router.get("/settings/{key}", response_model=SystemSetting)
def get_setting(
    *,
    db: Session = Depends(deps.get_db),
    key: str,
    current_user: User = Depends(require_admin)
):
    """
    Récupère un paramètre système spécifique par sa clé.
    """
    setting = SystemSettingService.get_setting(db, key)
    
    if not setting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Paramètre '{key}' non trouvé"
        )
    
    return setting


@router.put("/settings/{key}", response_model=SystemSetting)
def update_setting(
    *,
    db: Session = Depends(deps.get_db),
    key: str,
    setting_data: SystemSettingUpdate,
    request: Request,
    current_user: User = Depends(require_admin)
):
    """
    Met à jour un paramètre système.
    
    **Attention :** Modifier certains paramètres peut affecter immédiatement
    le comportement de l'application. Certains paramètres nécessitent un
    redémarrage de l'application pour prendre effet (requires_restart=true).
    
    La modification est enregistrée dans le journal d'audit avec l'ancienne
    et la nouvelle valeur pour traçabilité.
    """
    try:
        ip_address = request.client.host if request.client else None
        
        result = SystemSettingService.update_setting(
            db,
            key,
            setting_data,
            updated_by=current_user.id,
            ip_address=ip_address
        )
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Paramètre '{key}' non trouvé"
            )
        
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ==================== COMMISSIONS ====================

@router.post("/commissions", response_model=Commission, status_code=status.HTTP_201_CREATED)
def create_commission(
    *,
    db: Session = Depends(deps.get_db),
    commission_data: CommissionCreate,
    request: Request,
    current_user: User = Depends(require_admin)
):
    """
    Crée une nouvelle règle de commission.
    
    Définit combien la plateforme prélève sur chaque vente. Les commissions peuvent
    varier selon :
    - **Le producteur** : Certains ont négocié des taux préférentiels
    - **La catégorie** : Les produits frais peuvent avoir un taux différent des secs
    - **Les deux** : Combinaison producteur + catégorie pour maximum de flexibilité
    
    **Modèles de commission :**
    - **Pourcentage** : 15% du montant de la vente
    - **Montant fixe** : 2€ par commande
    - **Hybride** : 2€ + 5% du montant
    
    **Période de validité :**
    Les commissions ont des dates de début et de fin, ce qui permet de planifier
    des changements à l'avance (ex: "à partir du 1er janvier, le taux passe à 20%").
    """
    try:
        ip_address = request.client.host if request.client else None
        
        return CommissionService.create_commission(
            db,
            commission_data,
            created_by=current_user.id,
            ip_address=ip_address
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/commissions", response_model=List[Commission])
def get_all_commissions(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(require_admin)
):
    """
    Récupère toutes les règles de commission actives.
    
    Affiche toutes les commissions actuellement en vigueur pour gestion et révision.
    """
    return CommissionService.get_all_active_commissions(db)


@router.get("/commissions/{commission_id}", response_model=Commission)
def get_commission(
    *,
    db: Session = Depends(deps.get_db),
    commission_id: int,
    current_user: User = Depends(require_admin)
):
    """
    Récupère les détails d'une règle de commission spécifique.
    """
    commission = CommissionService.get_commission(db, commission_id)
    
    if not commission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commission non trouvée"
        )
    
    return commission


@router.put("/commissions/{commission_id}", response_model=Commission)
def update_commission(
    *,
    db: Session = Depends(deps.get_db),
    commission_id: int,
    commission_data: CommissionUpdate,
    current_user: User = Depends(require_admin)
):
    """
    Met à jour une règle de commission existante.
    
    **Recommandation :** Il est souvent préférable de créer une nouvelle règle
    avec une date de début future plutôt que de modifier une règle existante,
    pour conserver l'historique exact des taux appliqués.
    """
    result = CommissionService.update_commission(
        db,
        commission_id,
        commission_data,
        updated_by=current_user.id
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commission non trouvée"
        )
    
    return result


# ==================== TAUX DE TVA ====================

@router.post("/tax-rates", response_model=TaxRate, status_code=status.HTTP_201_CREATED)
def create_tax_rate(
    *,
    db: Session = Depends(deps.get_db),
    tax_rate_data: TaxRateCreate,
    current_user: User = Depends(require_admin)
):
    """
    Crée un nouveau taux de TVA.
    
    Définit le taux de TVA applicable selon le pays et la catégorie de produits.
    
    **Exemples de taux en France :**
    - Produits alimentaires de base : 5.5%
    - Produits standard : 20%
    - Livres : 5.5%
    - Alcool : 20%
    
    **Gestion des changements législatifs :**
    Les taux ont des dates de validité pour gérer les modifications de législation.
    Par exemple, si un pays change sa TVA le 1er janvier, vous créez un nouveau
    taux avec valid_from = 2025-01-01 et l'ancien taux avec valid_until = 2024-12-31.
    """
    return TaxRateService.create_tax_rate(db, tax_rate_data)


@router.get("/tax-rates", response_model=List[TaxRate])
def get_all_tax_rates(
    *,
    db: Session = Depends(deps.get_db),
    country: Optional[str] = Query(None, min_length=2, max_length=2, description="Code pays ISO 2 lettres"),
    current_user: User = Depends(require_admin)
):
    """
    Récupère tous les taux de TVA actifs.
    
    Peut être filtré par pays pour voir uniquement les taux d'un pays spécifique.
    """
    if country:
        return TaxRateService.get_country_tax_rates(db, country.upper())
    
    return TaxRateService.get_all_active_tax_rates(db)


@router.get("/tax-rates/{tax_rate_id}", response_model=TaxRate)
def get_tax_rate(
    *,
    db: Session = Depends(deps.get_db),
    tax_rate_id: int,
    current_user: User = Depends(require_admin)
):
    """
    Récupère les détails d'un taux de TVA spécifique.
    """
    tax_rate = TaxRateService.get_tax_rate(db, tax_rate_id)
    
    if not tax_rate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Taux de TVA non trouvé"
        )
    
    return tax_rate


@router.put("/tax-rates/{tax_rate_id}", response_model=TaxRate)
def update_tax_rate(
    *,
    db: Session = Depends(deps.get_db),
    tax_rate_id: int,
    tax_rate_data: TaxRateUpdate,
    current_user: User = Depends(require_admin)
):
    """
    Met à jour un taux de TVA existant.
    
    **Recommandation :** Comme pour les commissions, privilégiez la création d'un
    nouveau taux plutôt que la modification pour conserver l'historique fiscal exact.
    """
    result = TaxRateService.update_tax_rate(db, tax_rate_id, tax_rate_data)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Taux de TVA non trouvé"
        )
    
    return result