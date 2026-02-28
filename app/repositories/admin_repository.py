from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func

from app.models.admin import (
    AdminAction,
    BannedUser,
    ContentModeration,
    SystemSetting,
    Commission,
    TaxRate,
    ActionType,
    ModerationStatus
)


class AdminActionRepository:
    """
    Repository pour le journal d'audit des actions administratives.
    
    Ces méthodes permettent d'enregistrer chaque action importante effectuée par
    les administrateurs et de les retrouver facilement pour l'audit et le débogage.
    """
    
    @staticmethod
    def create(db: Session, action: AdminAction) -> AdminAction:
        """
        Enregistre une nouvelle action administrative dans le journal d'audit.
        Chaque action est horodatée automatiquement.
        """
        db.add(action)
        db.commit()
        db.refresh(action)
        return action
    
    @staticmethod
    def get_by_id(db: Session, action_id: int) -> Optional[AdminAction]:
        """Récupère une action spécifique par son ID"""
        return db.query(AdminAction).filter(AdminAction.id == action_id).first()
    
    @staticmethod
    def get_by_admin(
        db: Session,
        admin_id: int,
        limit: int = 100,
        offset: int = 0
    ) -> List[AdminAction]:
        """
        Récupère toutes les actions effectuées par un administrateur spécifique.
        Utile pour auditer l'activité d'un admin ou générer des rapports.
        """
        return db.query(AdminAction).filter(
            AdminAction.admin_id == admin_id
        ).order_by(
            AdminAction.created_at.desc()
        ).offset(offset).limit(limit).all()
    
    @staticmethod
    def get_by_action_type(
        db: Session,
        action_type: ActionType,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[AdminAction]:
        """
        Récupère toutes les actions d'un type spécifique dans une période donnée.
        Par exemple, tous les bannissements du dernier mois.
        """
        query = db.query(AdminAction).filter(AdminAction.action_type == action_type)
        
        if start_date:
            query = query.filter(AdminAction.created_at >= start_date)
        
        if end_date:
            query = query.filter(AdminAction.created_at <= end_date)
        
        return query.order_by(AdminAction.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_by_target(
        db: Session,
        target_entity: str,
        target_id: int
    ) -> List[AdminAction]:
        """
        Récupère toutes les actions effectuées sur une entité spécifique.
        Par exemple, tout ce qui a été fait sur l'utilisateur #123.
        """
        return db.query(AdminAction).filter(
            and_(
                AdminAction.target_entity == target_entity,
                AdminAction.target_id == target_id
            )
        ).order_by(AdminAction.created_at.desc()).all()
    
    @staticmethod
    def get_recent(
        db: Session,
        hours: int = 24,
        limit: int = 50
    ) -> List[AdminAction]:
        """
        Récupère les actions administratives récentes.
        Utile pour afficher un flux d'activité sur le tableau de bord admin.
        """
        since = datetime.now(timezone.utc) - timedelta(hours=hours)
        
        return db.query(AdminAction).filter(
            AdminAction.created_at >= since
        ).order_by(AdminAction.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def search(
        db: Session,
        admin_id: Optional[int] = None,
        action_type: Optional[ActionType] = None,
        target_entity: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[AdminAction]:
        """
        Recherche avancée dans le journal d'audit avec plusieurs filtres combinables.
        Permet de construire des requêtes complexes pour l'analyse.
        """
        query = db.query(AdminAction)
        
        if admin_id:
            query = query.filter(AdminAction.admin_id == admin_id)
        
        if action_type:
            query = query.filter(AdminAction.action_type == action_type)
        
        if target_entity:
            query = query.filter(AdminAction.target_entity == target_entity)
        
        if start_date:
            query = query.filter(AdminAction.created_at >= start_date)
        
        if end_date:
            query = query.filter(AdminAction.created_at <= end_date)
        
        return query.order_by(
            AdminAction.created_at.desc()
        ).offset(offset).limit(limit).all()
    
    @staticmethod
    def count_by_admin(db: Session, admin_id: int) -> int:
        """Compte le nombre total d'actions effectuées par un administrateur"""
        return db.query(AdminAction).filter(AdminAction.admin_id == admin_id).count()


class BannedUserRepository:
    """
    Repository pour la gestion des utilisateurs bannis.
    
    Permet de bannir, débannir, et rechercher des utilisateurs bannis avec
    différents critères. Maintient également l'historique des bannissements.
    """
    
    @staticmethod
    def create(db: Session, banned_user: BannedUser) -> BannedUser:
        """
        Enregistre un nouveau bannissement.
        Si l'utilisateur avait déjà été banni auparavant, incrémente le compteur.
        """
        db.add(banned_user)
        db.commit()
        db.refresh(banned_user)
        return banned_user
    
    @staticmethod
    def get_by_id(db: Session, ban_id: int) -> Optional[BannedUser]:
        """Récupère un bannissement par son ID"""
        return db.query(BannedUser).filter(BannedUser.id == ban_id).first()
    
    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[BannedUser]:
        """
        Récupère le bannissement actif d'un utilisateur.
        Retourne None si l'utilisateur n'est pas banni.
        """
        return db.query(BannedUser).filter(
            and_(
                BannedUser.user_id == user_id,
                BannedUser.is_active == True
            )
        ).first()
    
    @staticmethod
    def is_user_banned(db: Session, user_id: int) -> bool:
        """
        Vérifie rapidement si un utilisateur est actuellement banni.
        Plus performant que get_by_user_id si on a juste besoin d'un booléen.
        """
        return db.query(BannedUser).filter(
            and_(
                BannedUser.user_id == user_id,
                BannedUser.is_active == True
            )
        ).first() is not None
    
    @staticmethod
    def get_all_active(
        db: Session,
        limit: int = 100,
        offset: int = 0
    ) -> List[BannedUser]:
        """
        Récupère tous les bannissements actifs.
        Utile pour afficher la liste des utilisateurs bannis dans l'interface admin.
        """
        return db.query(BannedUser).filter(
            BannedUser.is_active == True
        ).order_by(BannedUser.created_at.desc()).offset(offset).limit(limit).all()
    
    @staticmethod
    def get_expiring_soon(
        db: Session,
        days: int = 7
    ) -> List[BannedUser]:
        """
        Récupère les bannissements temporaires qui expirent bientôt.
        Permet de notifier les utilisateurs ou de préparer leur réintégration.
        """
        expiry_threshold = datetime.now(timezone.utc) + timedelta(days=days)
        
        return db.query(BannedUser).filter(
            and_(
                BannedUser.is_active == True,
                ~BannedUser.is_permanent,
                BannedUser.banned_until <= expiry_threshold
            )
        ).order_by(BannedUser.banned_until).all()
    
    @staticmethod
    def get_expired(db: Session) -> List[BannedUser]:
        """
        Récupère les bannissements temporaires qui ont expiré mais sont toujours marqués actifs.
        Un processus de fond devrait désactiver ces bannissements régulièrement.
        """
        now = datetime.now(timezone.utc)
        
        return db.query(BannedUser).filter(
            and_(
                BannedUser.is_active == True,
                ~BannedUser.is_permanent,
                BannedUser.banned_until <= now
            )
        ).all()
    
    @staticmethod
    def update(db: Session, banned_user: BannedUser) -> BannedUser:
        """Met à jour un bannissement existant"""
        db.commit()
        db.refresh(banned_user)
        return banned_user
    
    @staticmethod
    def deactivate(db: Session, ban_id: int) -> bool:
        """
        Désactive un bannissement (débannir l'utilisateur).
        Retourne True si le bannissement a été désactivé, False s'il n'existait pas.
        """
        ban = BannedUserRepository.get_by_id(db, ban_id)
        
        if not ban:
            return False
        
        ban.is_active = False
        ban.unbanned_at = datetime.now(timezone.utc)
        db.commit()
        
        return True
    
    @staticmethod
    def count_active_bans(db: Session) -> int:
        """Compte le nombre total d'utilisateurs actuellement bannis"""
        return db.query(BannedUser).filter(BannedUser.is_active == True).count()


class ContentModerationRepository:
    """
    Repository pour la modération de contenu.
    
    Gère les signalements de contenu inapproprié et leur traitement par les modérateurs.
    """
    
    @staticmethod
    def create(db: Session, moderation: ContentModeration) -> ContentModeration:
        """Crée un nouveau signalement de contenu"""
        db.add(moderation)
        db.commit()
        db.refresh(moderation)
        return moderation
    
    @staticmethod
    def get_by_id(db: Session, moderation_id: int) -> Optional[ContentModeration]:
        """Récupère un signalement par son ID"""
        return db.query(ContentModeration).filter(
            ContentModeration.id == moderation_id
        ).first()
    
    @staticmethod
    def get_by_content(
        db: Session,
        content_type: str,
        content_id: int
    ) -> List[ContentModeration]:
        """
        Récupère tous les signalements concernant un contenu spécifique.
        Un même contenu peut être signalé par plusieurs utilisateurs.
        """
        return db.query(ContentModeration).filter(
            and_(
                ContentModeration.content_type == content_type,
                ContentModeration.content_id == content_id
            )
        ).order_by(ContentModeration.created_at.desc()).all()
    
    @staticmethod
    def get_existing_report(
        db: Session,
        content_type: str,
        content_id: int,
        reported_by: int
    ) -> Optional[ContentModeration]:
        """
        Vérifie si un utilisateur a déjà signalé ce contenu.
        Évite les doublons de signalements par le même utilisateur.
        """
        return db.query(ContentModeration).filter(
            and_(
                ContentModeration.content_type == content_type,
                ContentModeration.content_id == content_id,
                ContentModeration.reported_by == reported_by
            )
        ).first()
    
    @staticmethod
    def get_by_status(
        db: Session,
        status: ModerationStatus,
        limit: int = 100,
        offset: int = 0
    ) -> List[ContentModeration]:
        """
        Récupère tous les signalements ayant un statut donné.
        Utilisé pour afficher la file d'attente de modération.
        """
        return db.query(ContentModeration).filter(
            ContentModeration.status == status
        ).order_by(
            ContentModeration.priority.desc(),
            ContentModeration.created_at
        ).offset(offset).limit(limit).all()
    
    @staticmethod
    def get_pending_queue(db: Session, limit: int = 50) -> List[ContentModeration]:
        """
        Récupère la file d'attente de modération triée par priorité.
        Les signalements urgents (haute priorité) apparaissent en premier.
        """
        return db.query(ContentModeration).filter(
            ContentModeration.status.in_([
                ModerationStatus.PENDING,
                ModerationStatus.UNDER_REVIEW
            ])
        ).order_by(
            ContentModeration.priority.desc(),
            ContentModeration.created_at
        ).limit(limit).all()
    
    @staticmethod
    def get_by_content_type(
        db: Session,
        content_type: str,
        status: Optional[ModerationStatus] = None
    ) -> List[ContentModeration]:
        """
        Récupère les signalements d'un type de contenu spécifique.
        Par exemple, tous les avis signalés.
        """
        query = db.query(ContentModeration).filter(
            ContentModeration.content_type == content_type
        )
        
        if status:
            query = query.filter(ContentModeration.status == status)
        
        return query.order_by(ContentModeration.created_at.desc()).all()
    
    @staticmethod
    def increment_reports_count(
        db: Session,
        content_type: str,
        content_id: int
    ) -> None:
        """
        Incrémente le compteur de signalements pour un contenu.
        Appelé quand plusieurs utilisateurs signalent le même contenu.
        """
        db.query(ContentModeration).filter(
            and_(
                ContentModeration.content_type == content_type,
                ContentModeration.content_id == content_id
            )
        ).update({"reports_count": ContentModeration.reports_count + 1})
        db.commit()
    
    @staticmethod
    def update(db: Session, moderation: ContentModeration) -> ContentModeration:
        """Met à jour un signalement de contenu"""
        db.commit()
        db.refresh(moderation)
        return moderation
    
    @staticmethod
    def count_by_status(db: Session, status: ModerationStatus) -> int:
        """Compte le nombre de signalements avec un statut donné"""
        return db.query(ContentModeration).filter(
            ContentModeration.status == status
        ).count()
    
    @staticmethod
    def get_stats(db: Session) -> Dict[str, Any]:
        """
        Calcule des statistiques globales sur la modération.
        Utilisé pour le tableau de bord administrateur.
        """
        total = db.query(ContentModeration).count()
        pending = ContentModerationRepository.count_by_status(db, ModerationStatus.PENDING)
        under_review = ContentModerationRepository.count_by_status(db, ModerationStatus.UNDER_REVIEW)
        approved = ContentModerationRepository.count_by_status(db, ModerationStatus.APPROVED)
        rejected = ContentModerationRepository.count_by_status(db, ModerationStatus.REJECTED)
        
        # Répartition par type de contenu
        by_type = db.query(
            ContentModeration.content_type,
            func.count(ContentModeration.id).label('count')
        ).filter(
            ContentModeration.status == ModerationStatus.PENDING
        ).group_by(ContentModeration.content_type).all()
        
        return {
            "total": total,
            "pending": pending,
            "under_review": under_review,
            "approved": approved,
            "rejected": rejected,
            "by_content_type": {item[0]: item[1] for item in by_type}
        }


class SystemSettingRepository:
    """
    Repository pour les paramètres système configurables.
    
    Permet de stocker et récupérer les paramètres de configuration sans
    avoir à modifier le code source et redéployer l'application.
    """
    
    @staticmethod
    def create(db: Session, setting: SystemSetting) -> SystemSetting:
        """Crée un nouveau paramètre système"""
        db.add(setting)
        db.commit()
        db.refresh(setting)
        return setting
    
    @staticmethod
    def get_by_id(db: Session, setting_id: int) -> Optional[SystemSetting]:
        """Récupère un paramètre par son ID"""
        return db.query(SystemSetting).filter(SystemSetting.id == setting_id).first()
    
    @staticmethod
    def get_by_key(db: Session, key: str) -> Optional[SystemSetting]:
        """
        Récupère un paramètre par sa clé.
        C'est la méthode la plus utilisée car on accède généralement aux paramètres par leur nom.
        """
        return db.query(SystemSetting).filter(SystemSetting.key == key).first()
    
    @staticmethod
    def get_value(db: Session, key: str, default: Any = None) -> Any:
        """
        Récupère directement la valeur d'un paramètre, convertie selon son type.
        Retourne la valeur par défaut si le paramètre n'existe pas.
        """
        setting = SystemSettingRepository.get_by_key(db, key)
        
        if not setting:
            return default
        
        # Conversion selon le type
        if setting.type == "boolean":
            return setting.value.lower() in ['true', '1', 'yes']
        elif setting.type == "integer":
            return int(setting.value)
        elif setting.type == "float":
            return float(setting.value)
        elif setting.type == "json":
            import json
            return json.loads(setting.value)
        else:
            return setting.value
    
    @staticmethod
    def get_all(db: Session) -> List[SystemSetting]:
        """Récupère tous les paramètres système"""
        return db.query(SystemSetting).order_by(SystemSetting.category, SystemSetting.key).all()
    
    @staticmethod
    def get_public(db: Session) -> List[SystemSetting]:
        """
        Récupère uniquement les paramètres publics.
        Utilisé pour exposer certains paramètres via l'API publique.
        """
        return db.query(SystemSetting).filter(
            SystemSetting.is_public
        ).order_by(SystemSetting.category, SystemSetting.key).all()
    
    @staticmethod
    def get_by_category(db: Session, category: str) -> List[SystemSetting]:
        """
        Récupère tous les paramètres d'une catégorie.
        Utile pour organiser l'interface d'administration.
        """
        return db.query(SystemSetting).filter(
            SystemSetting.category == category
        ).order_by(SystemSetting.key).all()
    
    @staticmethod
    def update(db: Session, setting: SystemSetting) -> SystemSetting:
        """Met à jour un paramètre système"""
        db.commit()
        db.refresh(setting)
        return setting
    
    @staticmethod
    def update_value(db: Session, key: str, value: str, updated_by: int) -> Optional[SystemSetting]:
        """
        Met à jour rapidement la valeur d'un paramètre existant.
        Retourne None si le paramètre n'existe pas.
        """
        setting = SystemSettingRepository.get_by_key(db, key)
        
        if not setting:
            return None
        
        setting.value = value
        setting.updated_by = updated_by
        
        return SystemSettingRepository.update(db, setting)
    
    @staticmethod
    def delete(db: Session, setting: SystemSetting) -> None:
        """Supprime un paramètre système"""
        db.delete(setting)
        db.commit()


class CommissionRepository:
    """
    Repository pour la gestion des commissions.
    
    Gère les taux de commission appliqués aux ventes selon différents critères.
    """
    
    @staticmethod
    def create(db: Session, commission: Commission) -> Commission:
        """Crée une nouvelle règle de commission"""
        db.add(commission)
        db.commit()
        db.refresh(commission)
        return commission
    
    @staticmethod
    def get_by_id(db: Session, commission_id: int) -> Optional[Commission]:
        """Récupère une commission par son ID"""
        return db.query(Commission).filter(Commission.id == commission_id).first()
    
    @staticmethod
    def get_active_for_producer(
        db: Session,
        producer_id: int,
        category_id: Optional[int] = None
    ) -> Optional[Commission]:
        """
        Trouve la commission applicable pour un producteur et une catégorie.
        
        Ordre de priorité :
        1. Commission spécifique au producteur ET à la catégorie
        2. Commission spécifique au producteur (toutes catégories)
        3. Commission spécifique à la catégorie (tous producteurs)
        4. Commission par défaut (NULL pour les deux)
        """
        now = date.today()
        
        # Recherche par priorité décroissante
        queries = [
            # 1. Producteur + Catégorie spécifiques
            db.query(Commission).filter(
                and_(
                    Commission.producer_id == producer_id,
                    Commission.category_id == category_id,
                    Commission.is_active,
                    Commission.valid_from <= now,
                    or_(Commission.valid_until.is_(None), Commission.valid_until >= now)
                )
            ),
            # 2. Producteur spécifique, toutes catégories
            db.query(Commission).filter(
                and_(
                    Commission.producer_id == producer_id,
                    Commission.category_id.is_(None),
                    Commission.is_active,
                    Commission.valid_from <= now,
                    or_(Commission.valid_until.is_(None), Commission.valid_until >= now)
                )
            ),
        ]
        
        if category_id:
            # 3. Catégorie spécifique, tous producteurs
            queries.append(
                db.query(Commission).filter(
                    and_(
                        Commission.producer_id.is_(None),
                        Commission.category_id == category_id,
                        Commission.is_active,
                        Commission.valid_from <= now,
                        or_(Commission.valid_until.is_(None), Commission.valid_until >= now)
                    )
                )
            )
        
        # 4. Commission par défaut
        queries.append(
            db.query(Commission).filter(
                and_(
                    Commission.producer_id.is_(None),
                    Commission.category_id.is_(None),
                    Commission.is_active,
                    Commission.valid_from <= now,
                    or_(Commission.valid_until.is_(None), Commission.valid_until >= now)
                )
            )
        )
        
        # Retourner la première commission trouvée
        for query in queries:
            commission = query.first()
            if commission:
                return commission
        
        return None
    
    @staticmethod
    def get_all_active(db: Session) -> List[Commission]:
        """Récupère toutes les commissions actives"""
        now = date.today()
        
        return db.query(Commission).filter(
            and_(
                Commission.is_active,
                Commission.valid_from <= now,
                or_(Commission.valid_until.is_(None), Commission.valid_until >= now)
            )
        ).all()
    
    @staticmethod
    def update(db: Session, commission: Commission) -> Commission:
        """Met à jour une commission"""
        db.commit()
        db.refresh(commission)
        return commission
    
    @staticmethod
    def delete(db: Session, commission: Commission) -> None:
        """Supprime une commission"""
        db.delete(commission)
        db.commit()


class TaxRateRepository:
    """
    Repository pour la gestion des taux de TVA.
    
    Gère les différents taux de TVA selon les pays et catégories de produits.
    """
    
    @staticmethod
    def create(db: Session, tax_rate: TaxRate) -> TaxRate:
        """Crée un nouveau taux de TVA"""
        db.add(tax_rate)
        db.commit()
        db.refresh(tax_rate)
        return tax_rate
    
    @staticmethod
    def get_by_id(db: Session, tax_rate_id: int) -> Optional[TaxRate]:
        """Récupère un taux de TVA par son ID"""
        return db.query(TaxRate).filter(TaxRate.id == tax_rate_id).first()
    
    @staticmethod
    def get_active_for_country(
        db: Session,
        country: str,
        category_id: Optional[int] = None
    ) -> Optional[TaxRate]:
        """
        Trouve le taux de TVA applicable pour un pays et une catégorie.
        
        Ordre de priorité :
        1. Taux spécifique au pays ET à la catégorie
        2. Taux par défaut du pays (toutes catégories)
        """
        now = date.today()
        
        # 1. Recherche avec catégorie spécifique
        if category_id:
            tax_rate = db.query(TaxRate).filter(
                and_(
                    TaxRate.country == country.upper(),
                    TaxRate.category_id == category_id,
                    TaxRate.is_active,
                    TaxRate.valid_from <= now,
                    or_(TaxRate.valid_until.is_(None), TaxRate.valid_until >= now)
                )
            ).first()
            
            if tax_rate:
                return tax_rate
        
        # 2. Taux par défaut du pays
        return db.query(TaxRate).filter(
            and_(
                TaxRate.country == country.upper(),
                TaxRate.category_id.is_(None),
                TaxRate.is_active,
                TaxRate.valid_from <= now,
                or_(TaxRate.valid_until.is_(None), TaxRate.valid_until >= now)
            )
        ).first()
    
    @staticmethod
    def get_by_country(db: Session, country: str) -> List[TaxRate]:
        """Récupère tous les taux de TVA d'un pays"""
        now = date.today()
        
        return db.query(TaxRate).filter(
            and_(
                TaxRate.country == country.upper(),
                TaxRate.is_active,
                TaxRate.valid_from <= now,
                or_(TaxRate.valid_until.is_(None), TaxRate.valid_until >= now)
            )
        ).all()
    
    @staticmethod
    def get_all_active(db: Session) -> List[TaxRate]:
        """Récupère tous les taux de TVA actifs"""
        now = date.today()
        
        return db.query(TaxRate).filter(
            and_(
                TaxRate.is_active,
                TaxRate.valid_from <= now,
                or_(TaxRate.valid_until.is_(None), TaxRate.valid_until >= now)
            )
        ).order_by(TaxRate.country, TaxRate.category_id).all()
    
    @staticmethod
    def update(db: Session, tax_rate: TaxRate) -> TaxRate:
        """Met à jour un taux de TVA"""
        db.commit()
        db.refresh(tax_rate)
        return tax_rate
    
    @staticmethod
    def delete(db: Session, tax_rate: TaxRate) -> None:
        """Supprime un taux de TVA"""
        db.delete(tax_rate)
        db.commit()