from sqlalchemy.orm import Session
from typing import Optional, List
from fastapi import HTTPException, status
from datetime import datetime

from app.repositories.cms_repository import (
    PageRepository, FAQRepository, BlogPostRepository, TestimonialRepository
)
from app.models.cms import Page, FAQ, BlogPost, Testimonial, FAQCategory
from app.schemas.cms import (
    PageCreate, PageUpdate, FAQCreate, FAQUpdate,
    BlogPostCreate, BlogPostUpdate, TestimonialCreate, TestimonialUpdate
)
from slugify import slugify


# ============= Page Service =============

class PageService:
    """Service pour la gestion des pages statiques"""
    
    def __init__(self, db: Session):
        self.db = db
        self.page_repo = PageRepository(db)
    
    def create_page(self, page_data: PageCreate) -> Page:
        """Crée une nouvelle page"""
        # Générer le slug si non fourni
        slug = page_data.slug or slugify(page_data.title)
        
        # Vérifier l'unicité du slug
        existing = self.page_repo.get_by_slug(slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Une page avec ce slug existe déjà"
            )
        
        # Préparer les données
        page_dict = page_data.model_dump()
        page_dict['slug'] = slug
        
        # Si la page est publiée, définir published_at
        if page_dict.get('is_published'):
            page_dict['published_at'] = datetime.now()
        
        return self.page_repo.create(**page_dict)
    
    def get_page(self, page_id: int, published_only: bool = False) -> Page:
        """Récupère une page par son ID"""
        page = self.page_repo.get_by_id(page_id)
        if not page:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Page non trouvée"
            )
        
        if published_only and not page.is_published:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Page non trouvée"
            )
        
        return page
    
    def get_page_by_slug(self, slug: str, published_only: bool = False) -> Page:
        """Récupère une page par son slug"""
        page = self.page_repo.get_by_slug(slug, published_only)
        if not page:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Page non trouvée"
            )
        return page
    
    def get_all_pages(self, published_only: bool = False) -> List[Page]:
        """Récupère toutes les pages"""
        return self.page_repo.get_all(published_only)
    
    def update_page(self, page_id: int, page_data: PageUpdate) -> Page:
        """Met à jour une page"""
        page = self.get_page(page_id)
        
        update_dict = page_data.model_dump(exclude_unset=True)
        
        # Si le slug change, vérifier l'unicité
        if 'slug' in update_dict and update_dict['slug'] != page.slug:
            existing = self.page_repo.get_by_slug(update_dict['slug'])
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Une page avec ce slug existe déjà"
                )
        
        # Si la page est publiée pour la première fois, définir published_at
        if update_dict.get('is_published') and not page.is_published:
            update_dict['published_at'] = datetime.now()
        
        updated = self.page_repo.update(page_id, **update_dict)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Page non trouvée"
            )
        return updated
    
    def delete_page(self, page_id: int) -> bool:
        """Supprime une page"""
        if not self.page_repo.delete(page_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Page non trouvée"
            )
        return True


# ============= FAQ Service =============

class FAQService:
    """Service pour la gestion des questions fréquentes"""
    
    def __init__(self, db: Session):
        self.db = db
        self.faq_repo = FAQRepository(db)
    
    def create_faq(self, faq_data: FAQCreate) -> FAQ:
        """Crée une nouvelle FAQ"""
        return self.faq_repo.create(**faq_data.model_dump())
    
    def get_faq(self, faq_id: int) -> FAQ:
        """Récupère une FAQ par son ID"""
        faq = self.faq_repo.get_by_id(faq_id)
        if not faq:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="FAQ non trouvée"
            )
        return faq
    
    def get_all_faqs(
        self,
        category: Optional[FAQCategory] = None,
        published_only: bool = False
    ) -> List[FAQ]:
        """Récupère toutes les FAQs"""
        return self.faq_repo.get_all(category, published_only)
    
    def get_faqs_by_category(
        self,
        category: FAQCategory,
        published_only: bool = False
    ) -> List[FAQ]:
        """Récupère les FAQs d'une catégorie"""
        return self.faq_repo.get_by_category(category, published_only)
    
    def update_faq(self, faq_id: int, faq_data: FAQUpdate) -> FAQ:
        """Met à jour une FAQ"""
        update_dict = faq_data.model_dump(exclude_unset=True)
        updated = self.faq_repo.update(faq_id, **update_dict)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="FAQ non trouvée"
            )
        return updated
    
    def delete_faq(self, faq_id: int) -> bool:
        """Supprime une FAQ"""
        if not self.faq_repo.delete(faq_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="FAQ non trouvée"
            )
        return True


# ============= BlogPost Service =============

class BlogPostService:
    """Service pour la gestion des articles de blog"""
    
    def __init__(self, db: Session):
        self.db = db
        self.post_repo = BlogPostRepository(db)
    
    def create_post(self, post_data: BlogPostCreate, author_id: int) -> BlogPost:
        """Crée un nouvel article"""
        # Générer le slug si non fourni
        slug = post_data.slug or slugify(post_data.title)
        
        # Vérifier l'unicité du slug
        existing = self.post_repo.get_by_slug(slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un article avec ce slug existe déjà"
            )
        
        # Préparer les données
        post_dict = post_data.model_dump()
        post_dict['slug'] = slug
        post_dict['author_id'] = author_id
        
        # Si l'article est publié, définir published_at
        if post_dict.get('is_published'):
            post_dict['published_at'] = datetime.now()
        
        return self.post_repo.create(**post_dict)
    
    def get_post(self, post_id: int, published_only: bool = False) -> BlogPost:
        """Récupère un article par son ID"""
        post = self.post_repo.get_by_id(post_id, published_only)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article non trouvé"
            )
        return post
    
    def get_post_by_slug(self, slug: str, published_only: bool = False) -> BlogPost:
        """Récupère un article par son slug et incrémente les vues"""
        post = self.post_repo.get_by_slug(slug, published_only)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article non trouvé"
            )
        
        # Incrémenter les vues si publié
        if post.is_published:
            self.post_repo.increment_views(post.id)
        
        return post
    
    def get_all_posts(
        self,
        published_only: bool = False,
        author_id: Optional[int] = None,
        limit: Optional[int] = None,
        offset: int = 0
    ) -> List[BlogPost]:
        """Récupère tous les articles"""
        return self.post_repo.get_all(published_only, author_id, limit, offset)
    
    def get_featured_posts(self, limit: int = 5) -> List[BlogPost]:
        """Récupère les articles mis en avant"""
        return self.post_repo.get_featured(limit)
    
    def search_posts(self, search_term: str, published_only: bool = True) -> List[BlogPost]:
        """Recherche dans les articles"""
        return self.post_repo.search(search_term, published_only)
    
    def update_post(self, post_id: int, post_data: BlogPostUpdate) -> BlogPost:
        """Met à jour un article"""
        post = self.get_post(post_id)
        
        update_dict = post_data.model_dump(exclude_unset=True)
        
        # Si le slug change, vérifier l'unicité
        if 'slug' in update_dict and update_dict['slug'] != post.slug:
            existing = self.post_repo.get_by_slug(update_dict['slug'])
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Un article avec ce slug existe déjà"
                )
        
        # Si l'article est publié pour la première fois, définir published_at
        if update_dict.get('is_published') and not post.is_published:
            update_dict['published_at'] = datetime.now()
        
        updated = self.post_repo.update(post_id, **update_dict)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article non trouvé"
            )
        return updated
    
    def delete_post(self, post_id: int) -> bool:
        """Supprime un article"""
        if not self.post_repo.delete(post_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Article non trouvé"
            )
        return True


# ============= Testimonial Service =============

class TestimonialService:
    """Service pour la gestion des témoignages"""
    
    def __init__(self, db: Session):
        self.db = db
        self.testimonial_repo = TestimonialRepository(db)
    
    def create_testimonial(self, testimonial_data: TestimonialCreate, user_id: Optional[int] = None) -> Testimonial:
        """Crée un nouveau témoignage"""
        testimonial_dict = testimonial_data.model_dump()
        if user_id:
            testimonial_dict['user_id'] = user_id
        
        return self.testimonial_repo.create(**testimonial_dict)
    
    def get_testimonial(self, testimonial_id: int) -> Testimonial:
        """Récupère un témoignage par son ID"""
        testimonial = self.testimonial_repo.get_by_id(testimonial_id)
        if not testimonial:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Témoignage non trouvé"
            )
        return testimonial
    
    def get_all_testimonials(
        self,
        approved_only: bool = False,
        featured_only: bool = False,
        user_id: Optional[int] = None,
        limit: Optional[int] = None
    ) -> List[Testimonial]:
        """Récupère tous les témoignages"""
        return self.testimonial_repo.get_all(approved_only, featured_only, user_id, limit)
    
    def get_featured_testimonials(self, limit: int = 10) -> List[Testimonial]:
        """Récupère les témoignages mis en avant"""
        return self.testimonial_repo.get_featured(limit)
    
    def update_testimonial(self, testimonial_id: int, testimonial_data: TestimonialUpdate) -> Testimonial:
        """Met à jour un témoignage"""
        update_dict = testimonial_data.model_dump(exclude_unset=True)
        updated = self.testimonial_repo.update(testimonial_id, **update_dict)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Témoignage non trouvé"
            )
        return updated
    
    def approve_testimonial(self, testimonial_id: int) -> Testimonial:
        """Approuve un témoignage"""
        testimonial = self.testimonial_repo.approve(testimonial_id)
        if not testimonial:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Témoignage non trouvé"
            )
        return testimonial
    
    def reject_testimonial(self, testimonial_id: int) -> Testimonial:
        """Rejette un témoignage"""
        testimonial = self.testimonial_repo.reject(testimonial_id)
        if not testimonial:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Témoignage non trouvé"
            )
        return testimonial
    
    def delete_testimonial(self, testimonial_id: int) -> bool:
        """Supprime un témoignage"""
        if not self.testimonial_repo.delete(testimonial_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Témoignage non trouvé"
            )
        return True
