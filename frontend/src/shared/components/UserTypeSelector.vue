<template>
    <div class="user-type-selector">
        <!-- Dégradé de fond avec texture -->
        <div class="background-container">
            <div class="gradient-bg"></div>
            <div class="texture-overlay"></div>
            <div class="floating-elements">
                <div class="floating-leaf leaf-1"></div>
                <div class="floating-leaf leaf-2"></div>
                <div class="floating-leaf leaf-3"></div>
                <div class="floating-leaf leaf-4"></div>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="selector-container">
            <!-- En-tête -->
            <div class="header-section">
                <h1 class="main-title">
                    Bienvenue sur
                    <span class="brand-name">Fraîcheur & Proximité</span>
                </h1>
                <p class="subtitle">
                    Comment souhaitez-vous profiter de notre plateforme ?
                </p>
                <p class="description">
                    Choisissez votre expérience pour accéder à des fonctionnalités adaptées à vos besoins.
                </p>
            </div>

            <!-- Cartes de sélection -->
            <div class="cards-container">
                <!-- Carte Client -->
                <div :class="['card', 'customer-card', { 'selected': selectedType === UserType.CUSTOMER }]"
                    @click="selectType(UserType.CUSTOMER)" @keyup.enter="selectType(UserType.CUSTOMER)" tabindex="0">
                    <div class="card-content">
                        <!-- Icone avec animation -->
                        <div class="card-icon-wrapper">
                            <div class="card-icon customer-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    <path d="M21 12h-4a2 2 0 00-2 2v6" />
                                </svg>
                            </div>
                            <div class="pulse-ring"></div>
                        </div>

                        <h3 class="card-title">Client</h3>
                        <p class="card-description">
                            Je cherche des produits frais locaux pour ma consommation personnelle
                        </p>

                        <!-- Liste d'avantages -->
                        <ul class="advantages-list">
                            <li class="advantage-item">
                                <span class="check-icon">✓</span>
                                <span>Accès à des produits frais locaux</span>
                            </li>
                            <li class="advantage-item">
                                <span class="check-icon">✓</span>
                                <span>Livraison et retrait flexible</span>
                            </li>
                            <li class="advantage-item">
                                <span class="check-icon">✓</span>
                                <span>Suivi de commandes en temps réel</span>
                            </li>
                            <li class="advantage-item">
                                <span class="check-icon">✓</span>
                                <span>Accès aux promotions exclusives</span>
                            </li>
                        </ul>

                        <!-- Badge recommandé -->
                        <div class="recommended-badge" v-if="!selectedType">
                            Recommandé pour les particuliers
                        </div>
                    </div>

                    <!-- Indicateur de sélection -->
                    <div class="selection-indicator" v-if="selectedType === 'customer'">
                        <div class="indicator-dot"></div>
                        <span>Sélectionné</span>
                    </div>
                </div>

                <!-- Carte Producteur -->
                <div :class="['card', 'producer-card', { 'selected': selectedType === UserType.PRODUCER }]"
                    @click="selectType(UserType.PRODUCER)" @keyup.enter="selectType(UserType.PRODUCER)" tabindex="0">
                    <div class="card-content">
                        <!-- Icone avec animation -->
                        <div class="card-icon-wrapper">
                            <div class="card-icon producer-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path
                                        d="M3 6l3-3m0 0l3 3m-3-3v18m0 0l-3-3m3 3l3-3m6 3a9 9 0 10-18 0 9 9 0 0018 0z" />
                                    <path d="M12 8v8m-4-4h8" />
                                </svg>
                            </div>
                            <div class="pulse-ring"></div>
                        </div>

                        <h3 class="card-title">Producteur</h3>
                        <p class="card-description">
                            Je souhaite vendre mes produits frais directement aux consommateurs
                        </p>

                        <!-- Liste d'avantages -->
                        <ul class="advantages-list">
                            <li class="advantage-item">
                                <span class="check-icon">✓</span>
                                <span>Gestion complète de vos produits</span>
                            </li>
                            <li class="advantage-item">
                                <span class="check-icon">✓</span>
                                <span>Tableau de bord analytique</span>
                            </li>
                            <li class="advantage-item">
                                <span class="check-icon">✓</span>
                                <span>Gestion des commandes et livraisons</span>
                            </li>
                            <li class="advantage-item">
                                <span class="check-icon">✓</span>
                                <span>Accès à une communauté active</span>
                            </li>
                        </ul>

                        <!-- Badge professionnel -->
                        <div class="professional-badge">
                            Pour producteurs, agriculteurs et artisans
                        </div>
                    </div>

                    <!-- Indicateur de sélection -->
                    <div class="selection-indicator" v-if="selectedType === 'producer'">
                        <div class="indicator-dot"></div>
                        <span>Sélectionné</span>
                    </div>
                </div>
            </div>

            <!-- Bouton de confirmation -->
            <div class="action-section" v-if="selectedType">
                <button class="confirm-button" @click="confirmSelection" @mouseenter="animateButton">
                    <span class="button-text">
                        Continuer en tant que {{ selectedType === 'customer' ? 'Client' : 'Producteur' }}
                    </span>
                    <span class="button-icon">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </span>
                </button>

                <button class="secondary-button" @click="resetSelection" v-if="selectedType">
                    Changer de choix
                </button>
            </div>

            <!-- Informations complémentaires -->
            <div class="info-section">
                <p class="info-text">
                    <span class="info-icon">ℹ️</span>
                    Vous pourrez modifier ce choix ultérieurement dans vos paramètres de compte.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserType } from '@/shared/types/UserTypes'

const emit = defineEmits<{
    select: [type: UserType]
}>()

const selectedType = ref<UserType | null>(null)

const selectType = (type: UserType) => {
    selectedType.value = type
    emit('select', type)
}

const confirmSelection = () => {
    if (selectedType.value) {
        // Animation avant confirmation
        const button = document.querySelector('.confirm-button')
        button?.classList.add('confirmed')

        setTimeout(() => {
            // Émettre l'événement de confirmation
            emit('select', selectedType.value!)
        }, 500)
    }
}

const resetSelection = () => {
    selectedType.value = null
}

const animateButton = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLElement
    button.classList.add('hover-animate')
    setTimeout(() => {
        button.classList.remove('hover-animate')
    }, 300)
}
</script>

<style scoped>
.user-type-selector {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
}

/* Arrière-plan avec dégradé et texture */
.background-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
}

.gradient-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
            #f0f7ee 0%,
            #e8f4e5 25%,
            #dcedd4 50%,
            #c5e1a5 75%,
            #aed581 100%);
    animation: gradientShift 20s ease-in-out infinite alternate;
}

.texture-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 20% 80%, rgba(174, 213, 129, 0.1) 0px, transparent 2px),
        radial-gradient(circle at 40% 20%, rgba(197, 225, 165, 0.1) 0px, transparent 2px),
        radial-gradient(circle at 80% 50%, rgba(220, 237, 212, 0.1) 0px, transparent 2px);
    background-size: 300px 300px;
    opacity: 0.4;
}

/* Éléments flottants */
.floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}

.floating-leaf {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50% 50% 50% 0;
    transform: rotate(45deg);
}

.leaf-1 {
    width: 60px;
    height: 60px;
    top: 10%;
    left: 5%;
    animation: floatLeaf 25s ease-in-out infinite;
    background: rgba(174, 213, 129, 0.15);
}

.leaf-2 {
    width: 40px;
    height: 40px;
    top: 20%;
    right: 10%;
    animation: floatLeaf 30s ease-in-out infinite reverse;
    background: rgba(197, 225, 165, 0.15);
}

.leaf-3 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 15%;
    animation: floatLeaf 35s ease-in-out infinite;
    background: rgba(220, 237, 212, 0.15);
}

.leaf-4 {
    width: 50px;
    height: 50px;
    bottom: 10%;
    right: 5%;
    animation: floatLeaf 40s ease-in-out infinite reverse;
    background: rgba(240, 247, 238, 0.15);
}

/* Contenu principal */
.selector-container {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    width: 100%;
    animation: fadeInUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* En-tête */
.header-section {
    text-align: center;
    margin-bottom: 3rem;
    animation: slideDown 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.main-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #2e7d32;
    margin-bottom: 0.5rem;
    line-height: 1.2;
}

.brand-name {
    background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    font-size: 1.25rem;
    color: #558b2f;
    margin-bottom: 1rem;
    font-weight: 500;
}

.description {
    color: #7cb342;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

/* Cartes */
.cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 2.5rem;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
    overflow: hidden;
    border: 2px solid transparent;
    box-shadow:
        0 10px 40px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 24px 24px 0 0;
    background: linear-gradient(90deg, #4caf50, #8bc34a);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    border-color: rgba(76, 175, 80, 0.2);
}

.card:hover::before {
    opacity: 1;
}

.card.selected {
    border-color: #4caf50;
    background: rgba(255, 255, 255, 0.98);
    box-shadow:
        0 25px 70px rgba(76, 175, 80, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.card.selected::before {
    opacity: 1;
    background: linear-gradient(90deg, #4caf50, #2e7d32);
}

/* Icônes des cartes */
.card-icon-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
}

.card-icon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.card:hover .card-icon {
    transform: scale(1.1) rotate(5deg);
}

.customer-icon {
    background: linear-gradient(135deg, #4caf50, #8bc34a);
    color: white;
}

.producer-icon {
    background: linear-gradient(135deg, #ff9800, #ffb74d);
    color: white;
}

.card-icon svg {
    width: 40px;
    height: 40px;
    stroke-width: 1.5;
}

.pulse-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: inherit;
    opacity: 0.6;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Titres et descriptions des cartes */
.card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2e7d32;
    margin-bottom: 0.75rem;
    text-align: center;
}

.card-description {
    color: #558b2f;
    text-align: center;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

/* Liste d'avantages */
.advantages-list {
    margin: 1.5rem 0;
}

.advantage-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    color: #424242;
    transition: transform 0.3s ease;
}

.card:hover .advantage-item:hover {
    transform: translateX(5px);
}

.check-icon {
    width: 20px;
    height: 20px;
    background: #4caf50;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    flex-shrink: 0;
}

/* Badges */
.recommended-badge,
.professional-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 1rem;
}

.recommended-badge {
    background: rgba(76, 175, 80, 0.1);
    color: #2e7d32;
    border: 1px solid rgba(76, 175, 80, 0.3);
}

.professional-badge {
    background: rgba(255, 152, 0, 0.1);
    color: #ef6c00;
    border: 1px solid rgba(255, 152, 0, 0.3);
}

/* Indicateur de sélection */
.selection-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(76, 175, 80, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    color: #2e7d32;
    font-weight: 500;
    animation: slideInRight 0.3s ease-out;
}

.indicator-dot {
    width: 8px;
    height: 8px;
    background: #4caf50;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
}

/* Section d'action */
.action-section {
    text-align: center;
    margin: 2rem 0;
    animation: fadeIn 0.5s ease-out;
}

.confirm-button {
    background: linear-gradient(135deg, #4caf50, #2e7d32);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow:
        0 10px 30px rgba(76, 175, 80, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
}

.confirm-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
}

.confirm-button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow:
        0 20px 40px rgba(76, 175, 80, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.confirm-button:hover::before {
    left: 100%;
}

.confirm-button:active {
    transform: translateY(-1px) scale(1.02);
}

.confirm-button.confirmed {
    animation: successPulse 0.5s ease-out;
}

.button-icon {
    transition: transform 0.3s ease;
}

.confirm-button:hover .button-icon {
    transform: translateX(5px);
}

.button-icon svg {
    width: 20px;
    height: 20px;
}

.secondary-button {
    display: block;
    margin: 1rem auto 0;
    background: transparent;
    color: #7cb342;
    border: 1px solid #c5e1a5;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.secondary-button:hover {
    background: rgba(197, 225, 165, 0.1);
    transform: translateY(-2px);
}

/* Section d'information */
.info-section {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(197, 225, 165, 0.3);
    animation: fadeIn 0.6s ease-out 0.3s both;
}

.info-text {
    color: #7cb342;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.info-icon {
    font-size: 1rem;
}

/* Animations */
@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes floatLeaf {

    0%,
    100% {
        transform: translateY(0) rotate(45deg);
    }

    50% {
        transform: translateY(-20px) rotate(55deg);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.6;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.2;
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes successPulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
        box-shadow:
            0 0 0 10px rgba(76, 175, 80, 0.1),
            0 20px 40px rgba(76, 175, 80, 0.4);
    }

    100% {
        transform: scale(1);
    }
}

/* Effets de transition pour les cartes */
.card-enter-active,
.card-leave-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.card-enter-from,
.card-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}

/* Responsive */
@media (max-width: 768px) {
    .user-type-selector {
        padding: 1rem;
    }

    .main-title {
        font-size: 2rem;
    }

    .cards-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .card {
        padding: 2rem;
    }
}

@media (max-width: 480px) {
    .main-title {
        font-size: 1.75rem;
    }

    .subtitle {
        font-size: 1.125rem;
    }

    .card {
        padding: 1.5rem;
    }

    .confirm-button {
        padding: 0.875rem 2rem;
        font-size: 1rem;
    }
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
    .gradient-bg {
        background: linear-gradient(135deg,
                #1a1a1a 0%,
                #2d2d2d 25%,
                #3a3a3a 50%,
                #2d4a2d 75%,
                #1b5e20 100%);
    }

    .card {
        background: rgba(45, 45, 45, 0.95);
        color: #e0e0e0;
    }

    .card-title {
        color: #a5d6a7;
    }

    .card-description {
        color: #81c784;
    }

    .advantage-item {
        color: #bdbdbd;
    }

    .info-text {
        color: #81c784;
    }
}
</style>