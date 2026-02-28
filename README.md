MarketFraîche Backend API

API REST pour la plateforme de marketplace agricole connectant producteurs locaux et consommateurs

Table des matières
Vue d ensemble
Technologies principales
Fonctionnalités
Prérequis
Installation
Configuration
Démarrage
API Documentation
Tests
Structure

Vue d ensemble
MarketFraîche Backend est une API REST moderne construite avec FastAPI qui alimente une plateforme de marketplace agricole

Technologies principales
Framework FastAPI 0 115 0
Base de données PostgreSQL avec SQLAlchemy 2 0
Authentification JWT JSON Web Tokens
Validation Pydantic 2 10
Migrations Alembic 1 14
Tests Pytest 8 3

Fonctionnalités
Authentification JWT avec refresh tokens
Gestion des profils Clients et Producteurs
Catalogue de produits avec catégories et tags
Gestion des commandes et paiements
Système de livraison
Avis et évaluations
Analytics et reporting
Communication et notifications

Prérequis
Python 3 11
PostgreSQL 14
pip

Installation
1 Cloner le repository
2 Créer un environnement virtuel
3 Installer les dépendances
4 Configurer la base de données

python m venv venv
venv Scripts activate
pip install r requirements txt

Configuration
Créer un fichier env

DATABASE URL postgresql postgres admin localhost 5432 marketplace db
SECRET KEY your secret key
DEBUG True

Démarrage
alembic upgrade head
uvicorn app main app reload host 0 0 0 0 port 8000

API Documentation
Swagger UI http localhost 8000 docs
ReDoc http localhost 8000 redoc

Tests
pytest
pytest cov app

Structure
app
core Configuration
models Modèles SQLAlchemy
schemas Schémas Pydantic
repositories Accès données
services Logique métier
routers Endpoints API
main py Point d entrée

Fait par Samnick Biga et bruce boni

Docker Compose
Objectif professeur
Lancer toute la stack avec une seule commande

Commande
docker-compose up

Accès
Frontend http localhost 5173
Backend API http localhost 8000
Documentation Swagger http localhost 8000 docs
