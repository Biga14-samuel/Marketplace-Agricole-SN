from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.core.database import get_db
from app.core.deps import get_current_user, require_admin
from app.models.auth import User
from app.models.cms import FAQCategory
from app.services.cms_service import PageService, FAQService, BlogPostService, TestimonialService
from app.schemas.cms import (
    PageCreate, PageUpdate, PageResponse,
    FAQCreate, FAQUpdate, FAQResponse,
    BlogPostCreate, BlogPostUpdate, BlogPostResponse,
    TestimonialCreate, TestimonialUpdate, TestimonialResponse
)


router = APIRouter()


# ============================================================================
# ROUTES PAGES STATIQUES
# ============================================================================

@router.post("/pages", response_model=PageResponse, status_code=status.HTTP_201_CREATED)
def create_page(
    page_data: PageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Crée une nouvelle page statique.
    
    Nécessite les droits administrateur.
    """
    service = PageService(db)
    return service.create_page(page_data)


@router.get("/pages", response_model=List[PageResponse])
def get_all_pages(
    published_only: bool = Query(False, description="Afficher uniquement les pages publiées"),
    db: Session = Depends(get_db)
):
    """
    Récupère toutes les pages statiques.
    
    Route publique, mais peut filtrer par statut de publication.
    """
    service = PageService(db)
    return service.get_all_pages(published_only)


@router.get("/pages/{page_id}", response_model=PageResponse)
def get_page(
    page_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère une page par son ID.
    
    Route publique.
    """
    service = PageService(db)
    return service.get_page(page_id, published_only=True)


@router.get("/pages/slug/{slug}", response_model=PageResponse)
def get_page_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """
    Récupère une page par son slug.
    
    Route publique, utilisée pour afficher les pages statiques sur le frontend.
    """
    service = PageService(db)
    return service.get_page_by_slug(slug, published_only=True)


@router.put("/pages/{page_id}", response_model=PageResponse)
def update_page(
    page_id: int,
    page_data: PageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Met à jour une page existante.
    
    Nécessite les droits administrateur.
    """
    service = PageService(db)
    return service.update_page(page_id, page_data)


@router.delete("/pages/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_page(
    page_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Supprime une page.
    
    Nécessite les droits administrateur.
    """
    service = PageService(db)
    service.delete_page(page_id)


# ============================================================================
# ROUTES FAQ
# ============================================================================

@router.post("/faqs", response_model=FAQResponse, status_code=status.HTTP_201_CREATED)
def create_faq(
    faq_data: FAQCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Crée une nouvelle question fréquente.
    
    Nécessite les droits administrateur.
    """
    service = FAQService(db)
    return service.create_faq(faq_data)


@router.get("/faqs", response_model=List[FAQResponse])
def get_all_faqs(
    category: Optional[FAQCategory] = Query(None, description="Filtrer par catégorie"),
    published_only: bool = Query(True, description="Afficher uniquement les FAQs publiées"),
    db: Session = Depends(get_db)
):
    """
    Récupère toutes les questions fréquentes.
    
    Route publique avec filtres optionnels.
    """
    service = FAQService(db)
    return service.get_all_faqs(category, published_only)


@router.get("/faqs/category/{category}", response_model=List[FAQResponse])
def get_faqs_by_category(
    category: FAQCategory,
    published_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Récupère les FAQs d'une catégorie spécifique.
    
    Route publique, utilisée pour afficher les FAQs par section.
    """
    service = FAQService(db)
    return service.get_faqs_by_category(category, published_only)


@router.get("/faqs/{faq_id}", response_model=FAQResponse)
def get_faq(
    faq_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère une FAQ par son ID.
    
    Route publique.
    """
    service = FAQService(db)
    return service.get_faq(faq_id)


@router.put("/faqs/{faq_id}", response_model=FAQResponse)
def update_faq(
    faq_id: int,
    faq_data: FAQUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Met à jour une FAQ existante.
    
    Nécessite les droits administrateur.
    """
    service = FAQService(db)
    return service.update_faq(faq_id, faq_data)


@router.delete("/faqs/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Supprime une FAQ.
    
    Nécessite les droits administrateur.
    """
    service = FAQService(db)
    service.delete_faq(faq_id)


# ============================================================================
# ROUTES BLOG
# ============================================================================

@router.post("/blog", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
def create_blog_post(
    post_data: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Crée un nouvel article de blog.
    
    L'utilisateur connecté devient l'auteur de l'article.
    """
    service = BlogPostService(db)
    return service.create_post(post_data, current_user.id)


@router.get("/blog", response_model=List[BlogPostResponse])
def get_all_blog_posts(
    published_only: bool = Query(True),
    author_id: Optional[int] = Query(None, description="Filtrer par auteur"),
    limit: Optional[int] = Query(None, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les articles de blog avec pagination.
    
    Route publique, affiche par défaut uniquement les articles publiés.
    """
    service = BlogPostService(db)
    return service.get_all_posts(published_only, author_id, limit, offset)


@router.get("/blog/featured", response_model=List[BlogPostResponse])
def get_featured_blog_posts(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """
    Récupère les articles de blog mis en avant.
    
    Route publique, utilisée pour la page d'accueil.
    """
    service = BlogPostService(db)
    return service.get_featured_posts(limit)


@router.get("/blog/search", response_model=List[BlogPostResponse])
def search_blog_posts(
    q: str = Query(..., min_length=3, description="Terme de recherche"),
    published_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Recherche dans les articles de blog.
    
    Route publique, recherche dans le titre, contenu et tags.
    """
    service = BlogPostService(db)
    return service.search_posts(q, published_only)


@router.get("/blog/{post_id}", response_model=BlogPostResponse)
def get_blog_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère un article par son ID.
    
    Route publique.
    """
    service = BlogPostService(db)
    return service.get_post(post_id, published_only=True)


@router.get("/blog/slug/{slug}", response_model=BlogPostResponse)
def get_blog_post_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """
    Récupère un article par son slug et incrémente le compteur de vues.
    
    Route publique, utilisée pour afficher l'article complet.
    """
    service = BlogPostService(db)
    return service.get_post_by_slug(slug, published_only=True)


@router.put("/blog/{post_id}", response_model=BlogPostResponse)
def update_blog_post(
    post_id: int,
    post_data: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Met à jour un article de blog.
    
    Seul l'auteur ou un admin peut modifier l'article.
    """
    service = BlogPostService(db)
    post = service.get_post(post_id)
    
    # Vérifier que l'utilisateur est l'auteur ou admin
    if post.author_id != current_user.id and not any(role.name == "Admin" for role in current_user.roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas la permission de modifier cet article"
        )
    
    return service.update_post(post_id, post_data)


@router.delete("/blog/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Supprime un article de blog.
    
    Seul l'auteur ou un admin peut supprimer l'article.
    """
    service = BlogPostService(db)
    post = service.get_post(post_id)
    
    # Vérifier que l'utilisateur est l'auteur ou admin
    if post.author_id != current_user.id and not any(role.name == "Admin" for role in current_user.roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas la permission de supprimer cet article"
        )
    
    service.delete_post(post_id)


# ============================================================================
# ROUTES TÉMOIGNAGES
# ============================================================================

@router.post("/testimonials", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
def create_testimonial(
    testimonial_data: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Crée un nouveau témoignage.
    
    L'utilisateur connecté est associé au témoignage.
    Le témoignage doit être approuvé par un admin avant d'être visible publiquement.
    """
    service = TestimonialService(db)
    return service.create_testimonial(testimonial_data, current_user.id)


@router.get("/testimonials", response_model=List[TestimonialResponse])
def get_all_testimonials(
    approved_only: bool = Query(True),
    featured_only: bool = Query(False),
    limit: Optional[int] = Query(None, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les témoignages.
    
    Route publique, affiche par défaut uniquement les témoignages approuvés.
    """
    service = TestimonialService(db)
    return service.get_all_testimonials(approved_only, featured_only, None, limit)


@router.get("/testimonials/featured", response_model=List[TestimonialResponse])
def get_featured_testimonials(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Récupère les témoignages mis en avant.
    
    Route publique, utilisée pour la page d'accueil.
    """
    service = TestimonialService(db)
    return service.get_featured_testimonials(limit)


@router.get("/testimonials/my", response_model=List[TestimonialResponse])
def get_my_testimonials(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère les témoignages de l'utilisateur connecté.
    
    Route protégée.
    """
    service = TestimonialService(db)
    return service.get_all_testimonials(approved_only=False, user_id=current_user.id)


@router.get("/testimonials/{testimonial_id}", response_model=TestimonialResponse)
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupère un témoignage par son ID.
    
    Route publique si approuvé.
    """
    service = TestimonialService(db)
    testimonial = service.get_testimonial(testimonial_id)
    
    if not testimonial.is_approved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Témoignage non trouvé"
        )
    
    return testimonial


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: int,
    testimonial_data: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Met à jour un témoignage.
    
    Seul l'auteur ou un admin peut modifier le témoignage.
    """
    service = TestimonialService(db)
    testimonial = service.get_testimonial(testimonial_id)
    
    # Vérifier que l'utilisateur est l'auteur ou admin
    if testimonial.user_id != current_user.id and not any(role.name == "Admin" for role in current_user.roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas la permission de modifier ce témoignage"
        )
    
    return service.update_testimonial(testimonial_id, testimonial_data)


@router.post("/testimonials/{testimonial_id}/approve", response_model=TestimonialResponse)
def approve_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Approuve un témoignage.
    
    Nécessite les droits administrateur.
    """
    service = TestimonialService(db)
    return service.approve_testimonial(testimonial_id)


@router.post("/testimonials/{testimonial_id}/reject", response_model=TestimonialResponse)
def reject_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Rejette un témoignage.
    
    Nécessite les droits administrateur.
    """
    service = TestimonialService(db)
    return service.reject_testimonial(testimonial_id)


@router.delete("/testimonials/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Supprime un témoignage.
    
    Seul l'auteur ou un admin peut supprimer le témoignage.
    """
    service = TestimonialService(db)
    testimonial = service.get_testimonial(testimonial_id)
    
    # Vérifier que l'utilisateur est l'auteur ou admin
    if testimonial.user_id != current_user.id and not any(role.name == "Admin" for role in current_user.roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas la permission de supprimer ce témoignage"
        )
    
    service.delete_testimonial(testimonial_id)