from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from decimal import Decimal
import json

from app.models.admin import (
    AdminAction,
    BannedUser,
    ContentModeration,
    SystemSetting,
    Commission,
    TaxRate,
    ActionType,
    ModerationStatus,
    SettingType
)

from app.schemas.admin import (
    AdminActionCreate,
    BannedUserCreate,
    UnbanUser,
    ContentModerationCreate,
    ContentModerationReview,
    SystemSettingCreate,
    SystemSettingUpdate,
    CommissionCreate,
    CommissionUpdate,
    TaxRateCreate,
    TaxRateUpdate
)

from app.repositories.admin_repository import (
    AdminActionRepository,
    BannedUserRepository,
    ContentModerationRepository,
    SystemSettingRepository,
    CommissionRepository,
    TaxRateRepository
)


class AdminActionService:
    """
    Service pour gérer le journal d'audit des actions administratives.
    
    Chaque action importante effectuée par un administrateur doit être enregistrée
    pour assurer la traçabilité, la sécurité et la conformité réglementaire.
    """
    
    @staticmethod
    def log_action(
        db: Session,
        admin_id: int,
        action_data: AdminActionCreate,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> AdminAction:
        """
        Enregistre une nouvelle action administrative dans le journal d'audit.
        
        Cette méthode est appelée automatiquement après chaque action importante.
        Par exemple, quand un admin banni un utilisateur, modifie un paramètre système,
        ou supprime du contenu.
        
        Les métadonnées comme l'adresse IP et le user agent sont capturées pour
        renforcer la sécurité et faciliter les enquêtes en cas de problème.
        """
        action = AdminAction(
            admin_id=admin_id,
            ip_address=ip_address,
            user_agent=user_agent,
            **action_data.model_dump()
        )
        
        return AdminActionRepository.create(db, action)
    
    @staticmethod
    def get_admin_activity(
        db: Session,
        admin_id: int,
        days: int = 30
    ) -> List[AdminAction]:
        """
        Récupère l'activité récente d'un administrateur.
        
        Utile pour générer des rapports d'activité ou auditer le travail d'un admin.
        Par exemple, combien d'utilisateurs a-t-il bannis ce mois-ci ? Combien de
        signalements a-t-il traités ?
        """
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        return AdminActionRepository.search(
            db,
            admin_id=admin_id,
            start_date=start_date
        )
    
    @staticmethod
    def get_entity_history(
        db: Session,
        target_entity: str,
        target_id: int
    ) -> List[AdminAction]:
        """
        Récupère l'historique complet de toutes les actions sur une entité.
        
        Par exemple, pour un utilisateur problématique, on peut voir toutes les
        interventions administratives : avertissements, suspensions, bannissements, etc.
        
        C'est comme consulter le dossier médical complet d'un patient : tout y est
        consigné pour une vue d'ensemble.
        """
        return AdminActionRepository.get_by_target(db, target_entity, target_id)
    
    @staticmethod
    def search_actions(
        db: Session,
        admin_id: Optional[int] = None,
        action_type: Optional[ActionType] = None,
        target_entity: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100,
        offset: int = 0
    ) -> Tuple[List[AdminAction], int]:
        """
        Recherche avancée dans le journal d'audit.
        
        Permet de construire des requêtes complexes pour analyser les actions administratives.
        Par exemple : "Montrez-moi tous les bannissements effectués par l'admin #5
        entre janvier et mars 2024".
        
        Retourne les résultats paginés et le nombre total pour la pagination frontend.
        """
        actions = AdminActionRepository.search(
            db,
            admin_id=admin_id,
            action_type=action_type,
            target_entity=target_entity,
            start_date=start_date,
            end_date=end_date,
            limit=limit,
            offset=offset
        )
        
        # Pour la pagination, on devrait aussi compter le total
        # (simplifié ici, à implémenter dans le repository si nécessaire)
        total = len(actions)
        
        return actions, total
    
    @staticmethod
    def get_recent_activity_feed(db: Session, hours: int = 24) -> List[AdminAction]:
        """
        Récupère un flux d'activité administrative récente.
        
        Affiché sur le tableau de bord pour que les administrateurs puissent voir
        en temps réel ce qui se passe sur la plateforme. C'est comme le fil d'actualité
        d'un réseau social, mais pour les actions administratives.
        """
        return AdminActionRepository.get_recent(db, hours)


class BannedUserService:
    """
    Service pour gérer les utilisateurs bannis.
    
    Fournit toute la logique pour bannir, débannir, et gérer les sanctions des utilisateurs
    qui enfreignent les règles de la plateforme.
    """
    
    @staticmethod
    def ban_user(
        db: Session,
        ban_data: BannedUserCreate,
        banned_by: int,
        ip_address: Optional[str] = None
    ) -> BannedUser:
        """
        Banni un utilisateur de la plateforme.
        
        Cette action est grave et doit être documentée. Le système enregistre :
        - Qui a banni (banned_by)
        - Pourquoi (reason)
        - Pour combien de temps (banned_until ou is_permanent)
        - Les preuves éventuelles (evidence)
        
        Si l'utilisateur a déjà été banni auparavant, on incrémente le compteur
        de récidives pour garder trace de son historique.
        """
        # Vérifier si l'utilisateur est déjà banni
        existing_ban = BannedUserRepository.get_by_user_id(db, ban_data.user_id)
        
        if existing_ban:
            raise ValueError("Cet utilisateur est déjà banni")
        
        # Compter les bannissements antérieurs (inactifs)
        # Cette logique devrait être dans le repository pour compter l'historique
        previous_bans = 0  # À implémenter
        
        # Créer le bannissement
        banned_user = BannedUser(
            banned_by=banned_by,
            previous_bans_count=previous_bans,
            **ban_data.model_dump()
        )
        
        result = BannedUserRepository.create(db, banned_user)
        
        # Enregistrer cette action dans le journal d'audit
        AdminActionService.log_action(
            db,
            admin_id=banned_by,
            action_data=AdminActionCreate(
                action_type=ActionType.USER_BAN,
                description=f"Utilisateur #{ban_data.user_id} banni : {ban_data.reason}",
                target_entity="user",
                target_id=ban_data.user_id,
                changes={
                    "action": "ban",
                    "is_permanent": ban_data.is_permanent,
                    "banned_until": str(ban_data.banned_until) if ban_data.banned_until else None,
                    "reason": ban_data.reason
                }
            ),
            ip_address=ip_address
        )
        
        return result
    
    @staticmethod
    def unban_user(
        db: Session,
        user_id: int,
        unban_data: UnbanUser,
        unbanned_by: int,
        ip_address: Optional[str] = None
    ) -> Optional[BannedUser]:
        """
        Débanni un utilisateur.
        
        Le bannissement n'est pas supprimé, il est désactivé. Cela permet de garder
        l'historique complet pour référence future. On enregistre aussi qui a débanni
        et pourquoi.
        """
        banned_user = BannedUserRepository.get_by_user_id(db, user_id)
        
        if not banned_user:
            return None
        
        # Désactiver le bannissement
        banned_user.is_active = False
        banned_user.unbanned_at = datetime.now(timezone.utc)
        banned_user.unbanned_by = unbanned_by
        banned_user.unban_reason = unban_data.reason
        
        result = BannedUserRepository.update(db, banned_user)
        
        # Enregistrer dans le journal d'audit
        AdminActionService.log_action(
            db,
            admin_id=unbanned_by,
            action_data=AdminActionCreate(
                action_type=ActionType.USER_UNBAN,
                description=f"Utilisateur #{user_id} débanni : {unban_data.reason}",
                target_entity="user",
                target_id=user_id,
                changes={
                    "action": "unban",
                    "reason": unban_data.reason
                }
            ),
            ip_address=ip_address
        )
        
        return result
    
    @staticmethod
    def is_user_banned(db: Session, user_id: int) -> bool:
        """
        Vérifie rapidement si un utilisateur est actuellement banni.
        
        Cette méthode est appelée fréquemment, par exemple à chaque tentative de connexion
        ou avant d'autoriser une action. Elle doit donc être très performante.
        """
        return BannedUserRepository.is_user_banned(db, user_id)
    
    @staticmethod
    def get_ban_details(db: Session, user_id: int) -> Optional[BannedUser]:
        """
        Récupère les détails complets du bannissement d'un utilisateur.
        
        Utile pour afficher à l'utilisateur banni pourquoi il ne peut pas accéder
        à la plateforme et jusqu'à quand.
        """
        return BannedUserRepository.get_by_user_id(db, user_id)
    
    @staticmethod
    def process_expired_bans(db: Session) -> int:
        """
        Traite les bannissements temporaires qui ont expiré.
        
        Cette méthode devrait être appelée régulièrement par un processus de fond
        (ex: toutes les heures via un CRON job). Elle désactive automatiquement
        les bannissements temporaires dont la date d'expiration est passée.
        
        Retourne le nombre de bannissements désactivés.
        """
        expired_bans = BannedUserRepository.get_expired(db)
        count = 0
        
        for ban in expired_bans:
            ban.is_active = False
            ban.unbanned_at = datetime.now(timezone.utc)
            ban.unban_reason = "Bannissement temporaire expiré automatiquement"
            BannedUserRepository.update(db, ban)
            count += 1
        
        return count
    
    @staticmethod
    def get_expiring_bans(db: Session, days: int = 7) -> List[BannedUser]:
        """
        Récupère les bannissements qui vont expirer bientôt.
        
        Permet de notifier les utilisateurs qu'ils pourront bientôt revenir sur
        la plateforme, ou de préparer leur réintégration (vérifications, briefing, etc.).
        """
        return BannedUserRepository.get_expiring_soon(db, days)


class ContentModerationService:
    """
    Service pour la modération de contenu généré par les utilisateurs.
    
    Gère tout le workflow de modération : signalement → examen → décision.
    """
    
    @staticmethod
    def report_content(
        db: Session,
        report_data: ContentModerationCreate,
        reported_by: int
    ) -> ContentModeration:
        """
        Signale un contenu inapproprié.
        
        Les utilisateurs peuvent signaler des avis mensongers, des messages offensants,
        ou des produits frauduleux. Le système vérifie d'abord si ce contenu n'a pas
        déjà été signalé par le même utilisateur pour éviter les doublons.
        
        Si le contenu a déjà été signalé par d'autres utilisateurs, on incrémente
        simplement le compteur et on augmente la priorité.
        """
        # Vérifier si l'utilisateur a déjà signalé ce contenu
        existing = ContentModerationRepository.get_existing_report(
            db,
            report_data.content_type,
            report_data.content_id,
            reported_by
        )
        
        if existing:
            # L'utilisateur a déjà signalé ce contenu
            # On peut soit retourner l'existant, soit lever une erreur
            raise ValueError("Vous avez déjà signalé ce contenu")
        
        # Vérifier s'il existe d'autres signalements pour ce même contenu
        existing_reports = ContentModerationRepository.get_by_content(
            db,
            report_data.content_type,
            report_data.content_id
        )
        
        if existing_reports:
            # Incrémenter le compteur du premier signalement
            first_report = existing_reports[0]
            first_report.reports_count += 1
            
            # Augmenter la priorité si beaucoup de signalements
            if first_report.reports_count >= 5:
                first_report.priority = min(10, first_report.priority + 1)
            
            ContentModerationRepository.update(db, first_report)
            return first_report
        
        # Créer un nouveau signalement
        moderation = ContentModeration(
            reported_by=reported_by,
            status=ModerationStatus.PENDING,
            priority=0,  # Priorité par défaut
            **report_data.model_dump()
        )
        
        return ContentModerationRepository.create(db, moderation)
    
    @staticmethod
    def get_moderation_queue(db: Session, limit: int = 50) -> List[ContentModeration]:
        """
        Récupère la file d'attente de modération.
        
        Les modérateurs voient ici tous les contenus signalés en attente d'examen,
        triés par priorité (les plus urgents en premier).
        """
        return ContentModerationRepository.get_pending_queue(db, limit)
    
    @staticmethod
    def review_content(
        db: Session,
        moderation_id: int,
        review_data: ContentModerationReview,
        reviewed_by: int,
        ip_address: Optional[str] = None
    ) -> Optional[ContentModeration]:
        """
        Examine et statue sur un contenu signalé.
        
        Le modérateur peut :
        - Approuver (approved) : le contenu est ok, signalement non fondé
        - Rejeter (rejected) : le contenu est effectivement problématique, suppression/masquage
        - Ignorer (dismissed) : signalement abusif
        
        La décision et les notes du modérateur sont enregistrées pour référence future.
        """
        moderation = ContentModerationRepository.get_by_id(db, moderation_id)
        
        if not moderation:
            return None
        
        # Mettre à jour le signalement
        moderation.status = review_data.status
        moderation.reviewed_by = reviewed_by
        moderation.reviewed_at = datetime.now(timezone.utc)
        moderation.moderator_notes = review_data.moderator_notes
        moderation.action_taken = review_data.action_taken
        
        result = ContentModerationRepository.update(db, moderation)
        
        # Enregistrer dans le journal d'audit
        AdminActionService.log_action(
            db,
            admin_id=reviewed_by,
            action_data=AdminActionCreate(
                action_type=ActionType.CONTENT_MODERATE,
                description=f"Modération {moderation.content_type}#{moderation.content_id} : {review_data.status}",
                target_entity=moderation.content_type,
                target_id=moderation.content_id,
                changes={
                    "status": review_data.status.value,
                    "action_taken": review_data.action_taken,
                    "notes": review_data.moderator_notes
                }
            ),
            ip_address=ip_address
        )
        
        return result
    
    @staticmethod
    def assign_to_moderator(
        db: Session,
        moderation_id: int,
        moderator_id: int
    ) -> Optional[ContentModeration]:
        """
        Assigne un signalement à un modérateur spécifique.
        
        Permet de répartir la charge de travail entre plusieurs modérateurs.
        Une fois assigné, le statut passe en "under_review".
        """
        moderation = ContentModerationRepository.get_by_id(db, moderation_id)
        
        if not moderation:
            return None
        
        moderation.reviewed_by = moderator_id
        moderation.status = ModerationStatus.UNDER_REVIEW
        
        return ContentModerationRepository.update(db, moderation)
    
    @staticmethod
    def get_moderation_stats(db: Session) -> Dict[str, Any]:
        """
        Calcule des statistiques sur la modération.
        
        Utilisé pour le tableau de bord : combien de signalements en attente,
        combien traités aujourd'hui, répartition par type de contenu, etc.
        """
        return ContentModerationRepository.get_stats(db)

"""
Cette partie contient les services pour gérer les paramètres système, les commissions
et les taux de TVA. Ces services permettent de configurer le comportement de la
plateforme sans toucher au code.
"""

class SystemSettingService:
    """
    Service pour gérer les paramètres système configurables.
    
    Au lieu de coder en dur des valeurs dans le code source, on les stocke dans
    la base de données. Cela permet de modifier le comportement de l'application
    sans redéployer, simplement en changeant une valeur dans l'interface admin.
    
    C'est comme les réglages de votre smartphone : vous pouvez activer le mode avion,
    changer la luminosité, ou désactiver le Bluetooth sans réinstaller le système.
    """
    
    @staticmethod
    def create_setting(
        db: Session,
        setting_data: SystemSettingCreate,
        created_by: int,
        ip_address: Optional[str] = None
    ) -> SystemSetting:
        """
        Crée un nouveau paramètre système.
        
        Les administrateurs peuvent créer de nouveaux paramètres selon les besoins.
        Chaque paramètre a un type (string, integer, boolean, etc.) qui détermine
        comment sa valeur sera validée et convertie.
        """
        # Vérifier que la clé n'existe pas déjà
        existing = SystemSettingRepository.get_by_key(db, setting_data.key)
        
        if existing:
            raise ValueError(f"Un paramètre avec la clé '{setting_data.key}' existe déjà")
        
        # Valider la valeur selon le type
        SystemSettingService._validate_setting_value(
            setting_data.value,
            setting_data.type,
            setting_data.allowed_values,
            setting_data.min_value,
            setting_data.max_value
        )
        
        setting = SystemSetting(
            updated_by=created_by,
            **setting_data.model_dump()
        )
        
        result = SystemSettingRepository.create(db, setting)
        
        # Enregistrer dans le journal d'audit
        
        return result
    
    @staticmethod
    def get_setting(db: Session, key: str) -> Optional[SystemSetting]:
        """Récupère un paramètre par sa clé"""
        return SystemSettingRepository.get_by_key(db, key)
    
    @staticmethod
    def get_setting_value(
        db: Session,
        key: str,
        default: Any = None
    ) -> Any:
        """
        Récupère directement la valeur d'un paramètre, convertie selon son type.
        La valeur est automatiquement convertie en boolean, integer, ou autre selon le type.
        """
        return SystemSettingRepository.get_value(db, key, default)
    
    @staticmethod
    def update_setting(
        db: Session,
        key: str,
        setting_data: SystemSettingUpdate,
        updated_by: int,
        ip_address: Optional[str] = None
    ) -> Optional[SystemSetting]:
        """
        Met à jour un paramètre système.
        
        Cette opération est sensible car elle peut affecter le comportement de toute
        l'application. C'est pourquoi on enregistre qui a modifié quoi et quand.
        """
        setting = SystemSettingRepository.get_by_key(db, key)
        
        if not setting:
            return None
        
        update_data = setting_data.model_dump(exclude_unset=True)
        
        # Si on change la valeur, la valider
        if 'value' in update_data:
            SystemSettingService._validate_setting_value(
                update_data['value'],
                setting.type,
                setting.allowed_values,
                setting.min_value,
                setting.max_value
            )
            setting.value = update_data['value']
        
        # Autres champs
        if 'description' in update_data:
            setting.description = update_data['description']
        
        if 'is_public' in update_data:
            setting.is_public = update_data['is_public']
        
        setting.updated_by = updated_by
        
        result = SystemSettingRepository.update(db, setting)
        
        # Enregistrer dans le journal d'audit
        
        return result
    
    @staticmethod
    def get_all_settings(db: Session) -> List[SystemSetting]:
        """Récupère tous les paramètres système"""
        return SystemSettingRepository.get_all(db)
    
    @staticmethod
    def get_public_settings(db: Session) -> List[SystemSetting]:
        """
        Récupère uniquement les paramètres publics.
        
        Certains paramètres peuvent être exposés publiquement via l'API, comme
        le nom du site, les modes de paiement acceptés, etc. D'autres sont sensibles
        (clés API, mots de passe) et doivent rester privés.
        """
        return SystemSettingRepository.get_public(db)
    
    @staticmethod
    def get_settings_by_category(db: Session, category: str) -> List[SystemSetting]:
        """
        Récupère les paramètres d'une catégorie spécifique.
        
        Les paramètres sont organisés en catégories (general, payment, email, etc.)
        pour faciliter leur gestion dans l'interface d'administration.
        """
        return SystemSettingRepository.get_by_category(db, category)
    
    @staticmethod
    def _validate_setting_value(
        value: str,
        setting_type: SettingType,
        allowed_values: Optional[List[str]] = None,
        min_value: Optional[Decimal] = None,
        max_value: Optional[Decimal] = None
    ) -> None:
        """
        Valide une valeur de paramètre selon son type et ses contraintes.
        
        Cette méthode privée assure que les valeurs sont cohérentes avec le type
        déclaré du paramètre. Par exemple, si un paramètre est de type "boolean",
        la valeur doit être "true" ou "false".
        """
        # Vérifier les valeurs autorisées si spécifiées
        if allowed_values and value not in allowed_values:
            raise ValueError(f"La valeur doit être parmi : {', '.join(allowed_values)}")
        
        # Validation selon le type
        if setting_type == SettingType.INTEGER:
            try:
                int_value = int(value)
                
                if min_value is not None and int_value < min_value:
                    raise ValueError(f"La valeur doit être >= {min_value}")
                
                if max_value is not None and int_value > max_value:
                    raise ValueError(f"La valeur doit être <= {max_value}")
            except ValueError as e:
                raise ValueError(f"Valeur invalide pour un entier : {str(e)}")
        
        elif setting_type == SettingType.FLOAT:
            try:
                float_value = float(value)
                
                if min_value is not None and float_value < float(min_value):
                    raise ValueError(f"La valeur doit être >= {min_value}")
                
                if max_value is not None and float_value > float(max_value):
                    raise ValueError(f"La valeur doit être <= {max_value}")
            except ValueError as e:
                raise ValueError(f"Valeur invalide pour un nombre décimal : {str(e)}")
        
        elif setting_type == SettingType.BOOLEAN:
            if value.lower() not in ['true', 'false', '1', '0', 'yes', 'no']:
                raise ValueError("Valeur invalide pour un booléen (true/false, 1/0, yes/no)")
        
        elif setting_type == SettingType.JSON:
            try:
                json.loads(value)
            except json.JSONDecodeError as e:
                raise ValueError(f"JSON invalide : {str(e)}")


class CommissionService:
    """
    Service pour gérer les taux de commission sur les ventes.
    
    Votre plateforme prélève une commission sur chaque vente. Ces taux peuvent
    varier selon le producteur (certains ont négocié des taux préférentiels) ou
    la catégorie de produits.
    """
    
    @staticmethod
    def create_commission(
        db: Session,
        commission_data: CommissionCreate,
        created_by: int,
        ip_address: Optional[str] = None
    ) -> Commission:
        """
        Crée une nouvelle règle de commission.
        
        Vous pouvez définir :
        - Un pourcentage (ex: 15% du montant de la vente)
        - Un montant fixe (ex: 2€ par commande)
        - Ou les deux (ex: 2€ + 5% du montant)
        
        Les commissions ont une période de validité, ce qui permet de planifier
        des changements à l'avance (ex: "à partir du 1er janvier, le taux passe à 20%").
        """
        # Valider qu'au moins un montant est défini
        if not commission_data.percentage and not commission_data.fixed_amount:
            raise ValueError("Au moins le pourcentage ou le montant fixe doit être défini")
        
        commission = Commission(
            created_by=created_by,
            **commission_data.model_dump()
        )
        
        result = CommissionRepository.create(db, commission)
        
        # Enregistrer dans le journal d'audit
        # (simplifié ici)
        
        return result
    
    @staticmethod
    def get_commission(db: Session, commission_id: int) -> Optional[Commission]:
        """Récupère une commission par son ID"""
        return CommissionRepository.get_by_id(db, commission_id)
    
    @staticmethod
    def calculate_commission(
        db: Session,
        producer_id: int,
        category_id: Optional[int],
        transaction_amount: Decimal
    ) -> Tuple[Decimal, Optional[Commission]]:
        """
        Calcule la commission applicable pour une vente.
        
        Cette méthode est appelée lors du traitement d'une commande pour déterminer
        combien la plateforme va prélever. Elle trouve la règle de commission la plus
        spécifique applicable et calcule le montant exact.
        
        Retourne un tuple (montant de la commission, règle utilisée).
        
        Exemple :
        ```python
        commission_amount, rule = CommissionService.calculate_commission(
            db,
            producer_id=15,
            category_id=3,
            transaction_amount=Decimal("100.00")
        )
        # commission_amount pourrait être Decimal("15.00") si le taux est 15%
        ```
        """
        # Trouver la règle de commission applicable
        commission_rule = CommissionRepository.get_active_for_producer(
            db,
            producer_id,
            category_id
        )
        
        if not commission_rule:
            # Pas de commission définie
            return Decimal("0"), None
        
        # Vérifier les seuils de transaction si définis
        if commission_rule.min_transaction_amount:
            if transaction_amount < commission_rule.min_transaction_amount:
                return Decimal("0"), commission_rule
        
        if commission_rule.max_transaction_amount:
            if transaction_amount > commission_rule.max_transaction_amount:
                # Plafonner au montant max pour le calcul
                transaction_amount = commission_rule.max_transaction_amount
        
        # Calculer la commission
        commission_amount = Decimal("0")
        
        if commission_rule.fixed_amount:
            commission_amount += commission_rule.fixed_amount
        
        if commission_rule.percentage:
            commission_amount += transaction_amount * (commission_rule.percentage / 100)
        
        # Arrondir à 2 décimales
        commission_amount = commission_amount.quantize(Decimal("0.01"))
        
        return commission_amount, commission_rule
    
    @staticmethod
    def update_commission(
        db: Session,
        commission_id: int,
        commission_data: CommissionUpdate,
        updated_by: int
    ) -> Optional[Commission]:
        """
        Met à jour une règle de commission existante.
        
        Attention : modifier une commission peut affecter les ventes en cours.
        Il est souvent préférable de créer une nouvelle règle avec une date de début
        future plutôt que de modifier une règle existante.
        """
        commission = CommissionRepository.get_by_id(db, commission_id)
        
        if not commission:
            return None
        
        update_data = commission_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(commission, field, value)
        
        return CommissionRepository.update(db, commission)
    
    @staticmethod
    def get_all_active_commissions(db: Session) -> List[Commission]:
        """Récupère toutes les commissions actuellement actives"""
        return CommissionRepository.get_all_active(db)


class TaxRateService:
    """
    Service pour gérer les taux de TVA.
    
    La TVA varie selon le pays et le type de produit. En France par exemple :
    - Produits alimentaires de base : 5.5%
    - Produits standard : 20%
    - Livres : 5.5%
    
    Ce service permet de gérer toute cette complexité de manière centralisée.
    """
    
    @staticmethod
    def create_tax_rate(
        db: Session,
        tax_rate_data: TaxRateCreate
    ) -> TaxRate:
        """
        Crée un nouveau taux de TVA.
        
        Vous définissez le pays (code ISO à 2 lettres), éventuellement la catégorie
        de produits, et le taux applicable. Comme pour les commissions, les taux ont
        une période de validité pour gérer les changements législatifs.
        """
        tax_rate = TaxRate(**tax_rate_data.model_dump())
        
        return TaxRateRepository.create(db, tax_rate)
    
    @staticmethod
    def get_tax_rate(db: Session, tax_rate_id: int) -> Optional[TaxRate]:
        """Récupère un taux de TVA par son ID"""
        return TaxRateRepository.get_by_id(db, tax_rate_id)
    
    @staticmethod
    def calculate_tax(
        db: Session,
        country: str,
        category_id: Optional[int],
        amount: Decimal
    ) -> Tuple[Decimal, Optional[TaxRate]]:
        """
        Calcule le montant de TVA applicable.
        
        Cette méthode est appelée lors du calcul du prix total d'une commande.
        Elle trouve le taux de TVA applicable et calcule le montant exact.
        
        Retourne un tuple (montant de la TVA, règle utilisée).
        
        Exemple :
        ```python
        tax_amount, rule = TaxRateService.calculate_tax(
            db,
            country="FR",
            category_id=5,
            amount=Decimal("100.00")
        )
        # tax_amount pourrait être Decimal("20.00") si le taux est 20%
        # Le prix TTC serait alors 120.00€
        ```
        """
        # Trouver le taux de TVA applicable
        tax_rate = TaxRateRepository.get_active_for_country(db, country, category_id)
        
        if not tax_rate:
            # Pas de TVA définie pour ce pays/catégorie
            return Decimal("0"), None
        
        # Calculer le montant de TVA
        tax_amount = amount * (tax_rate.rate / 100)
        
        # Arrondir à 2 décimales
        tax_amount = tax_amount.quantize(Decimal("0.01"))
        
        return tax_amount, tax_rate
    
    @staticmethod
    def get_country_tax_rates(db: Session, country: str) -> List[TaxRate]:
        """
        Récupère tous les taux de TVA d'un pays.
        
        Utile pour afficher à un utilisateur tous les taux applicables dans son pays,
        ou pour générer des rapports fiscaux.
        """
        return TaxRateRepository.get_by_country(db, country)
    
    @staticmethod
    def update_tax_rate(
        db: Session,
        tax_rate_id: int,
        tax_rate_data: TaxRateUpdate
    ) -> Optional[TaxRate]:
        """
        Met à jour un taux de TVA existant.
        
        Comme pour les commissions, il est souvent préférable de créer un nouveau
        taux avec une date de début future plutôt que de modifier un taux existant,
        pour conserver l'historique fiscal exact.
        """
        tax_rate = TaxRateRepository.get_by_id(db, tax_rate_id)
        
        if not tax_rate:
            return None
        
        update_data = tax_rate_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(tax_rate, field, value)
        
        return TaxRateRepository.update(db, tax_rate)
    
    @staticmethod
    def get_all_active_tax_rates(db: Session) -> List[TaxRate]:
        """Récupère tous les taux de TVA actuellement actifs"""
        return TaxRateRepository.get_all_active(db)