# 📦 Guide d'Installation - MarketFraîche

Ce guide détaille toutes les étapes pour installer et configurer le projet sur une nouvelle machine.

---

## 🔧 Prérequis Système

### Logiciels à installer

1. **Python 3.11+**
   - Télécharger depuis [python.org](https://www.python.org/downloads/)
   - Vérifier l'installation : `python --version`

2. **Node.js 18+ et npm**
   - Télécharger depuis [nodejs.org](https://nodejs.org/)
   - Vérifier l'installation : `node --version` et `npm --version`

3. **PostgreSQL 14+**
   - Télécharger depuis [postgresql.org](https://www.postgresql.org/download/)
   - Vérifier l'installation : `psql --version`

4. **Git**
   - Télécharger depuis [git-scm.com](https://git-scm.com/)
   - Vérifier l'installation : `git --version`

---

## 📥 Installation du Projet

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd marketplace-agricole
```

### 2. Configuration de la Base de Données

#### Créer la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans le shell PostgreSQL
CREATE DATABASE marketplace_db;
CREATE USER postgres WITH PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE marketplace_db TO postgres;
\q
```

#### Configurer le fichier `.env` (Backend)

Créer un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL=postgresql://postgres:admin@localhost:5432/marketplace_db

# Security
SECRET_KEY=your_super_secret_key_here_change_in_production_min_32_chars_long_random_string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# App
APP_NAME="Marketplace Agricole"
DEBUG=True
API_V1_PREFIX=/api/v1
PYTHONPATH=

# Development settings
SKIP_EMAIL_VERIFICATION=False

VITE_API_BASE_URL=http://localhost:8000

# Autres configurations
VITE_APP_NAME=Marché Local

# Email Configuration (SMTP)
MAIL_USERNAME=votre_email@gmail.com
MAIL_PASSWORD=votre_app_password
MAIL_FROM=votre_email@gmail.com
MAIL_FROM_NAME=MarketFraîche
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
USE_CREDENTIALS=True
VALIDATE_CERTS=True

# Frontend URL for email links
FRONTEND_URL=http://localhost:5173
```

**⚠️ Important pour Gmail :**
- Activer l'authentification à 2 facteurs
- Générer un "App Password" : https://myaccount.google.com/apppasswords
- Utiliser ce mot de passe dans `MAIL_PASSWORD`

### 3. Installation Backend (Python/FastAPI)

```bash
# Créer un environnement virtuel
python -m venv .venv

# Activer l'environnement virtuel
# Sur Windows PowerShell :
.venv\Scripts\Activate.ps1
# Sur Windows CMD :
.venv\Scripts\activate.bat
# Sur Linux/Mac :
source .venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations de base de données
alembic upgrade head

# Initialiser les données de base (rôles, catalogue)
python -c "from app.core.init_roles import init_roles; init_roles()"
python -c "from app.core.init_catalog import init_catalog; init_catalog()"
```

### 4. Installation Frontend (Vue.js)

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env
```

Créer un fichier `frontend/.env` :

```env
# Configuration de l'API Backend
VITE_API_URL=http://localhost:8000

# Configuration de l'application
VITE_APP_NAME=MarketFraîche
VITE_APP_VERSION=1.5.0

# Configuration de l'authentification
VITE_TOKEN_REFRESH_INTERVAL=840000
VITE_AUTO_REFRESH_TOKENS=true

# Mode de développement
VITE_DEV_MODE=true
```

---

## 🚀 Démarrage du Projet

### Terminal 1 : Backend

```bash
# À la racine du projet, avec .venv activé
python -m uvicorn app.main:app --reload
```

Le backend sera accessible sur : http://localhost:8000
Documentation API : http://localhost:8000/docs

### Terminal 2 : Frontend

```bash
# Dans le dossier frontend
cd frontend
npm run dev
```

Le frontend sera accessible sur : http://localhost:5173

---

## 📚 Structure des Dépendances

### Backend (Python)

```
fastapi==0.115.0              # Framework web
uvicorn[standard]==0.32.0     # Serveur ASGI
sqlalchemy==2.0.36            # ORM
psycopg2-binary==2.9.10       # Driver PostgreSQL
alembic==1.14.0               # Migrations
pydantic==2.10.3              # Validation
python-jose[cryptography]     # JWT
passlib[bcrypt]               # Hashing passwords
pytest==8.3.4                 # Tests
```

### Frontend (Node.js)

```
vue@3.5.13                    # Framework
vue-router@4.5.0              # Routing
pinia@2.3.0                   # State management
axios@1.13.4                  # HTTP client
tailwindcss@3.4.0             # CSS framework
typescript@5.6.2              # TypeScript
vite@6.0.5                    # Build tool
```

---

## 🔍 Vérification de l'Installation

### 1. Tester le Backend

```bash
# Vérifier que le serveur répond
curl http://localhost:8000/api/v1/health

# Ou ouvrir dans le navigateur
http://localhost:8000/docs
```

### 2. Tester le Frontend

Ouvrir http://localhost:5173 dans le navigateur

### 3. Tester la connexion complète

1. Créer un compte sur http://localhost:5173/auth/register
2. Se connecter sur http://localhost:5173/auth/login
3. Vérifier que le profil s'affiche correctement

---

## 🛠️ Commandes Utiles

### Backend

```bash
# Créer une nouvelle migration
alembic revision --autogenerate -m "description"

# Appliquer les migrations
alembic upgrade head

# Revenir en arrière
alembic downgrade -1

# Lancer les tests
pytest

# Supprimer tous les utilisateurs (dev)
python delete_all_users_auto.py
```

### Frontend

```bash
# Développement
npm run dev

# Build production
npm run build

# Vérification TypeScript
npm run type-check

# Linting
npm run lint

# Tests
npm run test
```

---

## 🐛 Résolution de Problèmes

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est démarré
# Windows : Services > PostgreSQL
# Linux : sudo systemctl status postgresql

# Vérifier les credentials dans .env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/marketplace_db
```

### Erreur CORS

Vérifier que `app/main.py` contient :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Erreur d'import Python

```bash
# Réinstaller les dépendances
pip install -r requirements.txt --force-reinstall
```

### Erreur npm

```bash
# Nettoyer et réinstaller
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Notes Importantes

1. **Ne jamais commit les fichiers `.env`** - Ils contiennent des secrets
2. **Changer le `SECRET_KEY`** en production
3. **Utiliser un App Password Gmail** pour les emails
4. **PostgreSQL doit être démarré** avant le backend
5. **Le backend doit être démarré** avant le frontend

---

## 🎯 Checklist d'Installation

- [ ] Python 3.11+ installé
- [ ] Node.js 18+ installé
- [ ] PostgreSQL 14+ installé
- [ ] Git installé
- [ ] Projet cloné
- [ ] Base de données créée
- [ ] Fichier `.env` (racine) configuré
- [ ] Fichier `frontend/.env` configuré
- [ ] Environnement virtuel Python créé et activé
- [ ] Dépendances Python installées
- [ ] Migrations appliquées
- [ ] Données initiales créées
- [ ] Dépendances npm installées
- [ ] Backend démarré (port 8000)
- [ ] Frontend démarré (port 5173)
- [ ] Test de création de compte réussi

---

## 📞 Support

En cas de problème, vérifier :
1. Les logs du backend (terminal 1)
2. Les logs du frontend (terminal 2)
3. La console du navigateur (F12)
4. Les fichiers `.env` sont bien configurés
