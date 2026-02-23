from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from typing import Optional, Dict
from datetime import date, timedelta
from decimal import Decimal

from app.repositories.analytics_repository import (
    ProductViewRepository, SearchQueryRepository, DashboardMetricRepository,
    SalesReportRepository, InventoryReportRepository
)
from app.schemas.analytics import (
    ProductViewCreate, SearchQueryCreate, DashboardMetricCreate,
    SalesReportCreate
)
from app.models.analytics import EntityType, MetricName, MetricPeriod
from app.models.orders import Order, OrderStatus, OrderItem
from app.models.products import Product, StockMovement


# ============================================================================
# SERVICE PRODUCTVIEW
# ============================================================================

class ProductViewService:
    """
    Service pour gérer le tracking des vues de produits.
    
    Ce service enregistre chaque consultation de produit et fournit des
    analyses sur les produits les plus consultés, l'évolution du trafic, etc.
    """
    
    def __init__(self, db: Session):
        self.repository = ProductViewRepository(db)
        self.db = db
    
    def track_view(self, view_data: ProductViewCreate):
        """
        Enregistre une vue de produit.
        
        Cette méthode est appelée chaque fois qu'un utilisateur consulte
        la page d'un produit. Elle permet de construire des statistiques
        précises sur l'intérêt porté à chaque produit.
        """
        # Vérifier que le produit existe
        product = self.db.query(Product).filter(Product.id == view_data.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produit non trouvé"
            )
        
        return self.repository.create(
            product_id=view_data.product_id,
            user_id=view_data.user_id,
            session_id=view_data.session_id,
            referrer=view_data.referrer
        )
    
    def get_product_stats(self, product_id: int, start_date: Optional[date] = None,
                         end_date: Optional[date] = None):
        """
        Récupère les statistiques de vue d'un produit.
        
        Cette méthode agrège différentes métriques pour donner une vue
        complète de la popularité d'un produit : nombre total de vues,
        visiteurs uniques, évolution dans le temps.
        """
        if not end_date:
            end_date = date.today()
        if not start_date:
            start_date = end_date - timedelta(days=30)
        
        total_views = self.repository.get_product_views_count(
            product_id, start_date, end_date
        )
        
        unique_viewers = self.repository.get_unique_viewers(
            product_id, start_date, end_date
        )
        
        views_by_date = self.repository.get_views_by_date(
            product_id, start_date, end_date
        )
        
        return {
            "product_id": product_id,
            "total_views": total_views,
            "unique_viewers": unique_viewers,
            "views_by_date": views_by_date,
            "period": {"start_date": start_date, "end_date": end_date}
        }
    
    def get_top_products(self, limit: int = 10, start_date: Optional[date] = None,
                        end_date: Optional[date] = None):
        """
        Récupère les produits les plus consultés.
        
        Cette analyse aide à identifier les produits qui attirent le plus
        l'attention, ce qui peut informer les décisions marketing et
        merchandising.
        """
        if not end_date:
            end_date = date.today()
        if not start_date:
            start_date = end_date - timedelta(days=7)
        
        top_products = self.repository.get_top_viewed_products(
            limit, start_date, end_date
        )
        
        # Enrichir avec les informations du produit
        results = []
        for product_id, view_count in top_products:
            product = self.db.query(Product).filter(Product.id == product_id).first()
            if product:
                results.append({
                    "product_id": product_id,
                    "product_name": product.name,
                    "view_count": view_count
                })
        
        return results


# ============================================================================
# SERVICE SEARCHQUERY
# ============================================================================

class SearchQueryService:
    """
    Service pour gérer le tracking des recherches.
    
    Ce service enregistre chaque recherche effectuée et fournit des analyses
    sur les termes populaires, les recherches sans résultats, et l'efficacité
    de l'algorithme de recherche.
    """
    
    def __init__(self, db: Session):
        self.repository = SearchQueryRepository(db)
    
    def track_search(self, search_data: SearchQueryCreate):
        """
        Enregistre une recherche effectuée par un utilisateur.
        
        Cette méthode capture non seulement le terme recherché mais aussi
        si l'utilisateur a trouvé et cliqué sur un résultat, ce qui permet
        de mesurer la pertinence des résultats de recherche.
        """
        return self.repository.create(
            query=search_data.query,
            results_count=search_data.results_count,
            user_id=search_data.user_id,
            clicked_product_id=search_data.clicked_product_id
        )
    
    def get_popular_searches(self, limit: int = 20, days: int = 30):
        """
        Récupère les termes de recherche les plus populaires.
        
        Cette analyse révèle ce que les utilisateurs cherchent le plus
        souvent, ce qui peut informer la stratégie de contenu et le
        développement du catalogue.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        results = self.repository.get_popular_searches(limit, start_date, end_date)
        
        return [
            {
                "query": query,
                "search_count": count,
                "click_through_rate": round(ctr, 2)
            }
            for query, count, ctr in results
        ]
    
    def get_failed_searches(self, limit: int = 20, days: int = 30):
        """
        Récupère les recherches qui n'ont retourné aucun résultat.
        
        Ces données sont précieuses car elles révèlent ce que les utilisateurs
        cherchent mais ne trouvent pas, identifiant ainsi des opportunités
        d'enrichir le catalogue.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        results = self.repository.get_failed_searches(limit, start_date, end_date)
        
        return [
            {"query": query, "search_count": count}
            for query, count in results
        ]
    
    def get_search_analytics(self, days: int = 30):
        """
        Récupère des statistiques générales sur les recherches.
        
        Cette analyse donne une vue d'ensemble de l'efficacité du système
        de recherche avec des métriques comme le taux de succès et le
        taux de clic.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        return self.repository.get_search_analytics(start_date, end_date)


# ============================================================================
# SERVICE DASHBOARDMETRIC
# ============================================================================

class DashboardMetricService:
    """
    Service pour gérer les métriques pré-calculées des dashboards.
    
    Ce service calcule et stocke des métriques agrégées pour permettre
    un affichage rapide des tableaux de bord sans recalcul constant.
    """
    
    def __init__(self, db: Session):
        self.repository = DashboardMetricRepository(db)
        self.db = db
    
    def create_or_update_metric(self, metric_data: DashboardMetricCreate):
        """
        Crée ou met à jour une métrique de tableau de bord.
        
        Cette méthode est généralement appelée par un job automatisé qui
        recalcule périodiquement les métriques importantes pour tous les
        produits, producteurs et catégories.
        """
        return self.repository.create(
            entity_type=metric_data.entity_type,
            entity_id=metric_data.entity_id,
            metric_name=metric_data.metric_name,
            value=metric_data.value,
            period=metric_data.period,
            metric_date=metric_data.date
        )
    
    def get_entity_dashboard(self, entity_type: EntityType, entity_id: int,
                            period: MetricPeriod, days: int = 30):
        """
        Récupère toutes les métriques d'une entité pour son dashboard.
        
        Cette méthode construit un dashboard complet en récupérant toutes
        les métriques disponibles (vues, ventes, revenus) pour l'entité
        sur la période demandée.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        metrics_dict = self.repository.get_metrics_summary(
            entity_type, entity_id, period, start_date, end_date
        )
        
        return {
            "entity_type": entity_type,
            "entity_id": entity_id,
            "period": period,
            "start_date": start_date,
            "end_date": end_date,
            "metrics": metrics_dict
        }
    
    def calculate_product_metrics(self, product_id: int, metric_date: date,
                                 period: MetricPeriod = MetricPeriod.DAY):
        """
        Calcule toutes les métriques d'un produit pour une date donnée.
        
        Cette méthode analyse les données brutes (vues, commandes) et
        calcule les métriques agrégées qui seront stockées pour affichage
        rapide dans les dashboards.
        """
        # Calculer les dates de début et fin selon la période
        if period == MetricPeriod.DAY:
            start = metric_date
            end = metric_date
        elif period == MetricPeriod.WEEK:
            start = metric_date - timedelta(days=metric_date.weekday())
            end = start + timedelta(days=6)
        elif period == MetricPeriod.MONTH:
            start = metric_date.replace(day=1)
            if metric_date.month == 12:
                end = metric_date.replace(day=31)
            else:
                end = (metric_date.replace(month=metric_date.month + 1, day=1) - timedelta(days=1))
        else:  # YEAR
            start = metric_date.replace(month=1, day=1)
            end = metric_date.replace(month=12, day=31)
        
        # Calculer les vues
        view_repo = ProductViewRepository(self.db)
        total_views = view_repo.get_product_views_count(product_id, start, end)
        
        # Calculer les ventes
        total_sales = self.db.query(func.sum(OrderItem.quantity)).join(Order).filter(
            OrderItem.product_id == product_id,
            Order.status.in_([OrderStatus.COMPLETED]),
            Order.created_at >= start,
            Order.created_at <= end + timedelta(days=1)
        ).scalar() or 0
        
        # Calculer le revenu
        total_revenue = self.db.query(func.sum(OrderItem.subtotal)).join(Order).filter(
            OrderItem.product_id == product_id,
            Order.status.in_([OrderStatus.COMPLETED]),
            Order.created_at >= start,
            Order.created_at <= end + timedelta(days=1)
        ).scalar() or Decimal(0)
        
        # Créer ou mettre à jour les métriques
        self.repository.create(
            EntityType.PRODUCT, product_id, MetricName.VIEWS,
            Decimal(total_views), period, metric_date
        )
        
        self.repository.create(
            EntityType.PRODUCT, product_id, MetricName.SALES,
            Decimal(total_sales), period, metric_date
        )
        
        self.repository.create(
            EntityType.PRODUCT, product_id, MetricName.REVENUE,
            total_revenue, period, metric_date
        )
        
        # Calculer le taux de conversion si il y a des vues
        if total_views > 0:
            conversion_rate = (Decimal(total_sales) / Decimal(total_views)) * 100
            self.repository.create(
                EntityType.PRODUCT, product_id, MetricName.CONVERSION_RATE,
                conversion_rate, period, metric_date
            )
        
        return {
            "product_id": product_id,
            "date": metric_date,
            "period": period,
            "views": total_views,
            "sales": total_sales,
            "revenue": float(total_revenue)
        }


# ============================================================================
# SERVICE SALESREPORT
# ============================================================================

class SalesReportService:
    """
    Service pour générer et gérer les rapports de ventes.
    
    Ce service calcule automatiquement les statistiques de vente pour chaque
    producteur et génère des rapports détaillés qui servent de base pour
    les paiements et l'analyse des performances.
    """
    
    def __init__(self, db: Session):
        self.repository = SalesReportRepository(db)
        self.db = db
    
    def generate_report(self, report_data: SalesReportCreate):
        """
        Génère un rapport de ventes pour un producteur sur une période.
        
        Cette méthode analyse toutes les commandes du producteur sur la
        période spécifiée et calcule les statistiques complètes : nombre
        de commandes, revenus, commissions, etc.
        """
        # Vérifier si un rapport existe déjà pour cette période
        existing = self.repository.get_report_for_period(
            report_data.producer_id,
            report_data.period_start,
            report_data.period_end
        )
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un rapport existe déjà pour cette période"
            )
        
        # Calculer les statistiques depuis les commandes réelles
        stats = self._calculate_sales_stats(
            report_data.producer_id,
            report_data.period_start,
            report_data.period_end
        )
        
        return self.repository.create(
            producer_id=report_data.producer_id,
            period_start=report_data.period_start,
            period_end=report_data.period_end,
            **stats
        )
    
    def _calculate_sales_stats(self, producer_id: int, start_date: date, end_date: date) -> Dict:
        """
        Calcule les statistiques de vente pour un producteur sur une période.
        
        Cette méthode privée effectue les calculs complexes nécessaires
        pour générer un rapport complet. Elle analyse toutes les commandes
        complétées et agrège les données pertinentes.
        """
        # Récupérer toutes les commandes complétées du producteur
        orders = self.db.query(Order).filter(
            Order.producer_id == producer_id,
            Order.status == OrderStatus.COMPLETED,
            Order.created_at >= start_date,
            Order.created_at <= end_date + timedelta(days=1)
        ).all()
        
        total_orders = len(orders)
        total_revenue = sum(order.total_amount for order in orders)
        
        # Calculer la commission (supposons 15% de commission)
        commission_rate = Decimal('0.15')
        total_commission = total_revenue * commission_rate
        net_revenue = total_revenue - total_commission
        
        # Compter le nombre total de produits vendus
        total_products_sold = self.db.query(func.sum(OrderItem.quantity)).join(Order).filter(
            Order.producer_id == producer_id,
            Order.status == OrderStatus.COMPLETED,
            Order.created_at >= start_date,
            Order.created_at <= end_date + timedelta(days=1)
        ).scalar() or 0
        
        # Calculer le panier moyen
        average_order_value = total_revenue / total_orders if total_orders > 0 else Decimal(0)
        
        return {
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "total_commission": total_commission,
            "net_revenue": net_revenue,
            "total_products_sold": int(total_products_sold),
            "average_order_value": average_order_value
        }
    
    def get_producer_reports(self, producer_id: int, start_date: Optional[date] = None,
                            end_date: Optional[date] = None):
        """
        Récupère tous les rapports de ventes d'un producteur.
        
        Cette méthode permet à un producteur de consulter son historique
        complet de ventes pour suivre l'évolution de son activité dans
        le temps.
        """
        return self.repository.get_producer_reports(producer_id, start_date, end_date)
    
    def get_report(self, report_id: int, producer_id: Optional[int] = None):
        """
        Récupère un rapport spécifique.
        
        Si producer_id est fourni, vérifie que le rapport appartient bien
        à ce producteur pour empêcher l'accès non autorisé aux données
        d'autres producteurs.
        """
        report = self.repository.get_by_id(report_id)
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rapport non trouvé"
            )
        
        if producer_id and report.producer_id != producer_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'êtes pas autorisé à accéder à ce rapport"
            )
        
        return report


# ============================================================================
# SERVICE INVENTORYREPORT
# ============================================================================

class InventoryReportService:
    """
    Service pour générer et gérer les rapports d'inventaire.
    
    Ce service génère automatiquement des rapports quotidiens de stock pour
    chaque produit, permettant un suivi précis des mouvements d'inventaire.
    """
    
    def __init__(self, db: Session):
        self.repository = InventoryReportRepository(db)
        self.db = db
    
    def generate_daily_reports(self, producer_id: int, report_date: date):
        """
        Génère les rapports d'inventaire quotidiens pour tous les produits d'un producteur.
        
        Cette méthode est typiquement exécutée par un job automatisé à la
        fin de chaque journée. Elle analyse les mouvements de stock de la
        journée et génère un rapport pour chaque produit.
        """
        # Récupérer tous les produits actifs du producteur
        products = self.db.query(Product).filter(
            Product.producer_id == producer_id,
            Product.is_active
        ).all()
        
        reports = []
        for product in products:
            # Vérifier si un rapport existe déjà pour cette date
            existing = self.repository.get_report_for_date(product.id, report_date)
            if existing:
                continue
            
            # Calculer les mouvements de stock de la journée
            stats = self._calculate_inventory_stats(product.id, report_date)
            
            # Créer le rapport
            report = self.repository.create(
                producer_id=producer_id,
                product_id=product.id,
                report_date=report_date,
                **stats
            )
            reports.append(report)
        
        return reports
    
    def _calculate_inventory_stats(self, product_id: int, report_date: date) -> Dict:
        """
        Calcule les statistiques d'inventaire pour un produit sur une journée.
        
        Cette méthode analyse les mouvements de stock (ventes, réceptions,
        ajustements) pour calculer l'évolution du stock durant la journée.
        """
        # Récupérer le stock du jour précédent
        previous_report = self.repository.get_report_for_date(
            product_id, report_date - timedelta(days=1)
        )
        stock_start = previous_report.stock_end if previous_report else 0
        
        # Calculer les ventes de la journée
        stock_sold = self.db.query(func.sum(OrderItem.quantity)).join(Order).filter(
            OrderItem.product_id == product_id,
            func.date(Order.created_at) == report_date,
            Order.status.in_([OrderStatus.COMPLETED, OrderStatus.READY])
        ).scalar() or 0
        
        # Calculer les réceptions (mouvements de type IN)
        stock_received = self.db.query(func.sum(StockMovement.quantity)).filter(
            StockMovement.product_id == product_id,
            func.date(StockMovement.created_at) == report_date,
            StockMovement.type == 'in'
        ).scalar() or 0
        
        # Calculer les ajustements (mouvements de type ADJUSTMENT)
        stock_adjusted = self.db.query(func.sum(StockMovement.quantity)).filter(
            StockMovement.product_id == product_id,
            func.date(StockMovement.created_at) == report_date,
            StockMovement.type == 'adjustment'
        ).scalar() or 0
        
        # Calculer le stock final
        stock_end = stock_start + stock_received - stock_sold + stock_adjusted
        
        # Récupérer le prix du produit pour calculer la valeur du stock
        product = self.db.query(Product).filter(Product.id == product_id).first()
        stock_value = stock_end * product.price if product else None
        
        return {
            "stock_start": int(stock_start),
            "stock_received": int(stock_received),
            "stock_sold": int(stock_sold),
            "stock_adjusted": int(stock_adjusted),
            "stock_end": int(stock_end),
            "stock_value": stock_value
        }
    
    def get_product_inventory_history(self, product_id: int,
                                     start_date: Optional[date] = None,
                                     end_date: Optional[date] = None):
        """
        Récupère l'historique d'inventaire d'un produit.
        
        Cette méthode permet de visualiser l'évolution du stock d'un produit
        dans le temps, ce qui est utile pour analyser les tendances et
        planifier les réapprovisionnements.
        """
        if not end_date:
            end_date = date.today()
        if not start_date:
            start_date = end_date - timedelta(days=30)
        
        return self.repository.get_product_reports(product_id, start_date, end_date)
    
    def get_low_stock_alert(self, producer_id: int, threshold: int = 10):
        """
        Identifie les produits avec un stock faible nécessitant un réapprovisionnement.
        
        Cette méthode aide les producteurs à gérer proactivement leur inventaire
        en identifiant rapidement les produits qui approchent de la rupture
        de stock.
        """
        return self.repository.get_low_stock_products(producer_id, threshold)