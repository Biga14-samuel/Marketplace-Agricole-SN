Voici le texte brut pour le frontend, sans mise en forme, ni caractères spéciaux, ni symboles de ponctuation complexes :

MarketFraîche Frontend

Interface utilisateur moderne pour la marketplace agricole

Table des matières
Vue d ensemble
Technologies
Prérequis
Installation
Configuration
Démarrage
Build
Structure

Vue d ensemble
Application Vue js 3 avec TypeScript pour la plateforme MarketFraîche

Technologies
Framework Vue 3 5 Composition API
Language TypeScript 5 6
Build Vite 6 0
Routing Vue Router 4 5
State Pinia 2 3
HTTP Axios 1 13
UI Tailwind CSS 3 4
Icons Heroicons

Prérequis
Node js 18
npm ou yarn

Installation
cd frontend
npm install

Configuration
Créer env

VITE API URL http localhost 8000
VITE APP NAME MarketFraîche

Démarrage
npm run dev

Application sur http localhost 5173

Build
Production
npm run build

Preview
npm run preview

Structure
src
modules Modules fonctionnels
auth Authentification
catalog Catalogue produits
orders Commandes
shared Composants partagés
stores Pinia stores
router Configuration routes
App vue Composant racine

Tests
npm run test

Scripts
npm run dev Serveur de développement
npm run build Build production
npm run preview Preview du build
npm run lint Linter
npm run type check Vérification TypeScript

Fait par Samnick Biga et Boni bruce
