<template>
    <div class="root">

        <!-- ══ Canvas particules Antigravity ══ -->
        <canvas ref="particleCanvas" class="particle-canvas"></canvas>

        <!-- ══ Grille de fond ══ -->
        <div class="grid-bg"></div>

        <!-- ══ Feuilles flottantes ══ -->
        <div class="leaves-layer" aria-hidden="true">
            <div v-for="i in 12" :key="i" class="leaf" :style="leafStyle(i)"
                :class="`leaf-anim-${(i % 4) + 1}`">
                <svg class="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50,10 Q70,5 85,25 Q95,40 90,60 Q85,80 65,85 Q45,90 30,75 Q15,60 20,40 Q25,20 40,15 Z"/>
                </svg>
            </div>
        </div>

        <!-- ══ Bouton retour ══ -->
        <router-link to="/auth/login" class="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Retour</span>
        </router-link>

        <!-- ══ Wrapper centré ══ -->
        <div class="page-wrap">

            <!-- ══ EN-TÊTE HÉRO ══ -->
            <header class="page-hero">
                <div class="hero-brand">
                    <div class="brand-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <h1 class="hero-title">Market<em>Fraîche</em></h1>
                </div>
                <p class="hero-sub">Rejoignez notre communauté de gourmets</p>

                <!-- Badges de réassurance -->
                <div class="badges">
                    <span class="badge badge-green">
                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        100% produits locaux
                    </span>
                    <span class="badge badge-brown">
                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        Livraison ultra-fraîche
                    </span>
                    <span class="badge badge-grey">
                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                        De saison
                    </span>
                </div>
            </header>

            <!-- ══ CONTENU PRINCIPAL ══ -->
            <div class="main-cols">

                <!-- ─── COLONNE GAUCHE : Illustration + Avantages ─── -->
                <aside class="col-left">
                    <div class="card-illus">

                        <!-- Potager animé -->
                        <div class="garden-wrap">
                            <div class="garden-ring garden-outer">
                                <div class="garden-ring garden-inner">
                                    <!-- Légumes qui flottent -->
                                    <div v-for="veg in vegetables" :key="veg.id"
                                        class="veg-item"
                                        :style="{ left: veg.left+'%', animationDuration: veg.duration+'s', animationDelay: veg.delay+'s' }">
                                        <component :is="veg.component" :class="['veg-svg', veg.color]"/>
                                    </div>
                                    <!-- Panier central -->
                                    <div class="garden-center">
                                        <svg viewBox="0 0 20 20" fill="currentColor" class="basket-svg">
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Texte sous potager -->
                        <div class="illus-text">
                            <h3 class="illus-title">Votre marché frais<br>à portée de main</h3>
                            <p class="illus-sub">Produits sélectionnés avec soin par nos producteurs partenaires</p>
                        </div>

                        <!-- Avantages -->
                        <div class="benefits">
                            <h4 class="benefits-title">
                                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                                Vos avantages
                            </h4>
                            <div v-for="b in benefits" :key="b.id" class="benefit-item">
                                <div class="benefit-dot" :style="{ background: b.dotColor }"></div>
                                <div>
                                    <div class="benefit-name">{{ b.title }}</div>
                                    <div class="benefit-desc">{{ b.description }}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </aside>

                <!-- ─── COLONNE DROITE : Formulaire ─── -->
                <section class="col-right">
                    <div class="form-card">

                        <div class="form-header">
                            <h2 class="form-title">Créer votre compte<span class="title-dot">.</span></h2>
                            <p class="form-sub">Remplissez les informations ci-dessous pour créer votre compte personnel</p>
                        </div>

                        <!-- ── Alertes ── -->
                        <div v-if="errorMessage" class="alert alert-err">
                            <div class="alert-icon-wrap alert-icon-err">
                                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                            </div>
                            <div>
                                <p class="alert-main">{{ errorMessage }}</p>
                                <p v-if="errorDetails" class="alert-detail">{{ errorDetails }}</p>
                            </div>
                        </div>
                        <div v-if="successMessage" class="alert alert-ok">
                            <div class="alert-icon-wrap alert-icon-ok">
                                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                            </div>
                            <div>
                                <p class="alert-main">{{ successMessage }}</p>
                                <p class="alert-detail">Redirection vers votre espace...</p>
                            </div>
                        </div>

                        <!-- ── Formulaire ── -->
                        <form @submit.prevent="handleRegister" class="form-body">

                            <!-- Prénom + Nom -->
                            <div class="field-row">
                                <div class="field">
                                    <label class="flabel">
                                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                                        Prénom
                                    </label>
                                    <input v-model="form.firstName" type="text" required placeholder="Votre prénom" class="finput"/>
                                </div>
                                <div class="field">
                                    <label class="flabel">
                                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                                        Nom
                                    </label>
                                    <input v-model="form.lastName" type="text" required placeholder="Votre nom" class="finput"/>
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="field">
                                <label class="flabel">
                                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                                    Adresse email
                                </label>
                                <input v-model="form.email" type="email" required placeholder="votre@email.com" class="finput"/>
                                <p class="field-hint">Nous utiliserons cet email pour vos confirmations de commande.</p>
                            </div>

                            <!-- Type de compte -->
                            <div class="field">
                                <label class="flabel">
                                    <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                                    Type de compte
                                </label>
                                <div class="role-grid">
                                    <!-- Client -->
                                    <label class="role-card" :class="{ 'role-active-green': form.role === 'Customer' }">
                                        <input type="radio" v-model="form.role" value="Customer" class="sr-only" required/>
                                        <div class="role-icon-wrap role-icon-green">
                                            <svg viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/>
                                            </svg>
                                        </div>
                                        <div class="role-label">Client</div>
                                        <div class="role-desc">Acheter des produits frais locaux</div>
                                        <div v-if="form.role === 'Customer'" class="role-check role-check-green">
                                            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                                        </div>
                                    </label>
                                    <!-- Producteur -->
                                    <label class="role-card" :class="{ 'role-active-brown': form.role === 'Producer' }">
                                        <input type="radio" v-model="form.role" value="Producer" class="sr-only" required/>
                                        <div class="role-icon-wrap role-icon-brown">
                                            <svg viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div class="role-label">Producteur</div>
                                        <div class="role-desc">Vendre mes produits agricoles</div>
                                        <div v-if="form.role === 'Producer'" class="role-check role-check-brown">
                                            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                                        </div>
                                    </label>
                                </div>
                                <p class="field-hint">Vous pourrez modifier ce choix plus tard dans vos paramètres</p>
                            </div>

                            <!-- Téléphone -->
                            <div class="field">
                                <label class="flabel">
                                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                                    Téléphone <span class="flabel-opt">(optionnel)</span>
                                </label>
                                <input v-model="form.phone" type="tel" placeholder="06 12 34 56 78" class="finput"/>
                                <p class="field-hint">Pour vous contacter en cas de problème de livraison.</p>
                            </div>

                            <!-- Mots de passe -->
                            <div class="field-row">
                                <!-- Mot de passe -->
                                <div class="field">
                                    <label class="flabel">
                                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
                                        Mot de passe
                                    </label>
                                    <div class="pw-wrap">
                                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                            required placeholder="Votre mot de passe" class="finput"
                                            @input="checkPasswordStrength"/>
                                        <button type="button" @click="showPassword = !showPassword" class="pw-eye">
                                            <svg v-if="showPassword" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
                                            <svg v-else viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
                                        </button>
                                    </div>
                                    <!-- Indicateur de force -->
                                    <div v-if="form.password" class="strength-section">
                                        <div class="strength-row">
                                            <span class="strength-text">Force du mot de passe</span>
                                            <span class="strength-label" :style="{ color: passwordStrengthColorHex }">{{ passwordStrengthText }}</span>
                                        </div>
                                        <div class="strength-track">
                                            <div class="strength-fill" :style="{ width: passwordStrength+'%', background: passwordStrengthColorHex }"></div>
                                        </div>
                                        <ul class="pw-rules">
                                            <li v-for="req in passwordRequirements" :key="req.key" :class="['pw-rule', req.met ? 'rule-ok' : 'rule-no']">
                                                <svg viewBox="0 0 20 20" fill="currentColor">
                                                    <path v-if="req.met" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                                    <path v-else fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                                                </svg>
                                                {{ req.text }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <!-- Confirmation -->
                                <div class="field">
                                    <label class="flabel">
                                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
                                        Confirmer le mot de passe
                                    </label>
                                    <div class="pw-wrap">
                                        <input v-model="form.confirmPassword"
                                            :type="showConfirmPassword ? 'text' : 'password'"
                                            required placeholder="Confirmez votre mot de passe" class="finput"/>
                                        <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="pw-eye">
                                            <svg v-if="showConfirmPassword" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
                                            <svg v-else viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
                                        </button>
                                    </div>
                                    <div v-if="form.confirmPassword && form.password !== form.confirmPassword" class="match-msg match-err">
                                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                                        <span>Les mots de passe ne correspondent pas</span>
                                    </div>
                                    <div v-else-if="form.confirmPassword && form.password === form.confirmPassword" class="match-msg match-ok">
                                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                                        <span>Les mots de passe correspondent</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Adresse -->
                            <div class="field">
                                <label class="flabel">
                                    <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                                    Adresse de livraison <span class="flabel-opt">(optionnel)</span>
                                </label>
                                <input v-model="form.address" type="text" placeholder="Rue, numéro, appartement" class="finput finput-mb"/>
                                <div class="address-row">
                                    <input v-model="form.city"    type="text" placeholder="Ville"         class="finput"/>
                                    <input v-model="form.zipCode" type="text" placeholder="Code postal"   class="finput"/>
                                    <input v-model="form.country" type="text" placeholder="Pays"          class="finput"/>
                                </div>
                            </div>

                            <!-- Newsletter + CGU -->
                            <div class="checks">
                                <label class="check-label">
                                    <div class="chk-wrap">
                                        <input type="checkbox" v-model="form.newsletter"/>
                                        <div class="chk-box" :class="{ 'chk-on': form.newsletter }">
                                            <svg v-if="form.newsletter" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                        </div>
                                    </div>
                                    <span>Je souhaite recevoir la newsletter MarketFraîche avec les nouveautés, les promotions et les recettes de saison.</span>
                                </label>

                                <label class="check-label">
                                    <div class="chk-wrap">
                                        <input type="checkbox" v-model="form.acceptTerms" required/>
                                        <div class="chk-box" :class="{ 'chk-on': form.acceptTerms }">
                                            <svg v-if="form.acceptTerms" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                        </div>
                                    </div>
                                    <span>J'accepte les <a href="#" class="text-link">conditions générales d'utilisation</a> et la <a href="#" class="text-link">politique de confidentialité</a> <span class="req-star">*</span></span>
                                </label>
                            </div>

                            <!-- Bouton submit -->
                            <button type="submit" :disabled="loading || !formValid" class="btn-submit">
                                <div class="btn-shimmer"></div>
                                <svg v-if="loading" class="spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                <svg v-else viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
                                </svg>
                                <span>{{ loading ? 'Création du compte...' : 'Créer mon compte' }}</span>
                            </button>

                            <!-- Lien login -->
                            <div class="login-link">
                                <p>Vous avez déjà un compte ?
                                    <router-link to="/auth/login" class="text-link">
                                        Connectez-vous
                                        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                                    </router-link>
                                </p>
                            </div>
                        </form>
                    </div>
                </section>
            </div>

            <!-- ══ Pied de page ══ -->
            <footer class="page-footer">
                <p>En créant un compte, vous accédez à l'ensemble de nos services. Vous pouvez modifier vos préférences à tout moment dans votre espace personnel.</p>
                <p class="footer-copy">MarketFraîche © {{ new Date().getFullYear() }} — Tous droits réservés</p>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import type { RegisterData } from '@/modules/auth/types/auth.types'

const router    = useRouter()
const authStore = useAuthStore()

// ─── État du formulaire (INCHANGÉ) ───
const form = reactive({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', confirmPassword: '',
    address: '', city: '', zipCode: '', country: 'Cameroun',
    role: 'Customer',
    newsletter: true, acceptTerms: false
})

const loading             = ref(false)
const showPassword        = ref(false)
const showConfirmPassword = ref(false)
const errorMessage        = ref('')
const errorDetails        = ref('')
const successMessage      = ref('')
const passwordStrength    = ref(0)

// ─── Données illustrations ───
const vegetables = ref([
    { id:1, left:10, duration:4,   delay:0,   color:'veg-red',    component: { template:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/></svg>` } },
    { id:2, left:30, duration:5,   delay:1,   color:'veg-green',  component: { template:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 19.5c1.8-.6 3.63-1.34 4.68-2.38C10 19 12 21 12 21c2-3 5-7 9-9-2-3-4-4-4-4z"/></svg>` } },
    { id:3, left:52, duration:4.5, delay:0.5, color:'veg-purple', component: { template:`<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="14" height="18" rx="3"/></svg>` } },
    { id:4, left:72, duration:5.5, delay:1.5, color:'veg-yellow', component: { template:`<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>` } },
    { id:5, left:88, duration:4.2, delay:0.8, color:'veg-orange', component: { template:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>` } },
])

const benefits = ref([
    { id:1, title:'Produits de saison',       description:'Accédez aux meilleurs produits frais selon les saisons',         dotColor:'#6B9B6B' },
    { id:2, title:'Producteurs camerounais',  description:'Soutenir directement les producteurs du Cameroun',               dotColor:'#A07850' },
    { id:3, title:'Livraison flexible',       description:'Choisissez votre créneau selon vos disponibilités',             dotColor:'#9BA09B' },
    { id:4, title:'Réduction fidélité',       description:'Bénéficiez de réductions dès votre 3ème commande',             dotColor:'#7A8F7A' },
])

// ─── Force mot de passe (INCHANGÉ) ───
const passwordRequirements = computed(() => {
    const p = form.password
    return [
        { key:'length',    text:'Au moins 8 caractères',          met: p.length >= 8 },
        { key:'uppercase', text:'Au moins une majuscule',         met: /[A-Z]/.test(p) },
        { key:'lowercase', text:'Au moins une minuscule',         met: /[a-z]/.test(p) },
        { key:'number',    text:'Au moins un chiffre',            met: /\d/.test(p) },
        { key:'special',   text:'Au moins un caractère spécial',  met: /[!@#$%^&*(),.?":{}|<>]/.test(p) },
    ]
})

const passwordStrengthText = computed(() => {
    if (passwordStrength.value < 30) return 'Faible'
    if (passwordStrength.value < 60) return 'Moyen'
    if (passwordStrength.value < 80) return 'Bon'
    return 'Excellent'
})

// Couleurs hex solides (remplacement des classes Tailwind dynamiques)
const passwordStrengthColorHex = computed(() => {
    if (passwordStrength.value < 30) return '#C45A5A'
    if (passwordStrength.value < 60) return '#C4A84A'
    if (passwordStrength.value < 80) return '#6B9B6B'
    return '#3D6847'
})

// Garder les computed Tailwind originaux pour la compatibilité
const passwordStrengthColor = computed(() => {
    if (passwordStrength.value < 30) return 'text-red-500'
    if (passwordStrength.value < 60) return 'text-amber-500'
    if (passwordStrength.value < 80) return 'text-fresh-500'
    return 'text-green-500'
})

const passwordStrengthBarClass = computed(() => {
    if (passwordStrength.value < 30) return 'bg-red-500'
    if (passwordStrength.value < 60) return 'bg-amber-500'
    if (passwordStrength.value < 80) return 'bg-fresh-500'
    return 'bg-green-500'
})

const formValid = computed(() =>
    form.firstName && form.lastName && form.email &&
    form.password && form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.acceptTerms && passwordStrength.value >= 30
)

const checkPasswordStrength = () => {
    let s = 0
    if (form.password.length >= 8)  s += 20
    if (form.password.length >= 12) s += 10
    if (/[A-Z]/.test(form.password)) s += 20
    if (/[a-z]/.test(form.password)) s += 20
    if (/\d/.test(form.password))    s += 15
    if (/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) s += 15
    if (form.password.length < 6)    s = Math.min(s, 20)
    passwordStrength.value = Math.min(s, 100)
}

const validateForm = (): string[] => {
    const errors: string[] = []
    if (!form.firstName.trim()) errors.push('Le prénom est requis')
    if (!form.lastName.trim())  errors.push('Le nom est requis')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push('Adresse email invalide')
    if (form.password.length < 8)          errors.push('Le mot de passe doit contenir au moins 8 caractères')
    if (!/[A-Z]/.test(form.password))      errors.push('Le mot de passe doit contenir au moins une majuscule')
    if (!/[a-z]/.test(form.password))      errors.push('Le mot de passe doit contenir au moins une minuscule')
    if (!/\d/.test(form.password))         errors.push('Le mot de passe doit contenir au moins un chiffre')
    if (form.password !== form.confirmPassword) errors.push('Les mots de passe ne correspondent pas')
    if (!form.acceptTerms) errors.push('Vous devez accepter les conditions générales')
    return errors
}

// ─── Inscription (INCHANGÉE) ───
const handleRegister = async () => {
    const errors = validateForm()
    if (errors.length > 0) {
        errorMessage.value = 'Veuillez corriger les erreurs suivantes'
        errorDetails.value = errors.join(', ')
        return
    }
    loading.value = true
    errorMessage.value = ''
    errorDetails.value = ''
    try {
        const registerData: RegisterData = {
            email:      form.email,
            password:   form.password,
            phone:      form.phone || undefined,
            first_name: form.firstName,
            last_name:  form.lastName,
            role:       form.role
        }
        const response = await authStore.register(registerData)
        successMessage.value = response.message || 'Compte créé avec succès ! Veuillez vérifier votre email.'
        setTimeout(() => { router.push('/auth/verify-email') }, 2000)
    } catch (error: unknown) {
        const err = error as any
        errorMessage.value = err?.response?.data?.detail || err?.response?.data?.message ||
            err?.message || 'Une erreur est survenue lors de l\'inscription'
        errorDetails.value = err?.response?.data?.errors ?
            Object.values(err.response.data.errors).flat().join(', ') : ''
    } finally { loading.value = false }
}

// ─── Styles feuilles ───
const leafStyle = (i: number) => {
    const sizes  = [36,52,28,44,60,32,48,38,42,30,46,34]
    const lefts  = [3,91,14,80,6,95,20,70,8,85,25,65]
    const tops   = [8,18,58,5,75,32,90,42,12,62,48,28]
    const delays = [0,1.5,3,0.7,2.2,4,1.1,2.8,0.4,3.6,1.8,0.9]
    const durs   = [18,22,15,20,25,17,21,19,23,16,24,20]
    const colors = ['#A8C8A8','#D4C8A0','#B8C4B8','#C8B898','#98B898']
    return {
        width:  `${sizes[i-1]}px`,
        height: `${sizes[i-1]}px`,
        left:   `${lefts[i-1]}%`,
        top:    `${tops[i-1]}%`,
        color:  colors[(i-1) % colors.length],
        animationDuration: `${durs[i-1]}s`,
        animationDelay:    `${delays[i-1]}s`,
        opacity: '0.2',
    }
}

// ─── Canvas particules ───
const particleCanvas = ref<HTMLCanvasElement | null>(null)
let raf: number

interface P { x:number; y:number; w:number; h:number; a:number; c:string; sx:number; sy:number; op:number; da:number; ds:number; dr:number }
const COLS = ['#6B9B6B','#A07850','#9BA09B','#8FAF8F','#C4B89A','#7A8F7A','#B8A070']

function mkP(W:number, H:number): P[] {
    return Array.from({ length: Math.floor((W*H)/4500) }, () => {
        const r = Math.random()
        const x = r<0.35 ? Math.random()*W*0.2 : r<0.70 ? W*0.80+Math.random()*W*0.2 : Math.random()*W
        return { x, y:Math.random()*H, w:1.4+Math.random()*2.4, h:3+Math.random()*8,
            a:Math.random()*360, c:COLS[Math.floor(Math.random()*COLS.length)],
            sx:(Math.random()-.5)*.06, sy:-.03-Math.random()*.09, op:.18+Math.random()*.46,
            da:Math.random()*Math.PI*2, ds:.002+Math.random()*.003, dr:.25+Math.random()*.85 }
    })
}

function startCanvas() {
    const el = particleCanvas.value; if (!el) return
    const ctx = el.getContext('2d')!
    const resize = () => { el.width = window.innerWidth; el.height = window.innerHeight }
    resize(); let ps = mkP(el.width, el.height)
    window.addEventListener('resize', () => { resize(); ps = mkP(el.width, el.height) })
    const tick = () => {
        ctx.clearRect(0,0,el.width,el.height)
        for (const p of ps) {
            p.da+=p.ds; p.x+=p.sx+Math.sin(p.da)*p.dr*.011; p.y+=p.sy
            if (p.y<-14){ p.y=el.height+14; p.x=Math.random()*el.width }
            if (p.x<-14) p.x=el.width+14; if (p.x>el.width+14) p.x=-14
            ctx.save(); ctx.globalAlpha=p.op; ctx.fillStyle=p.c
            ctx.translate(p.x,p.y); p.a+=.03; ctx.rotate(p.a*Math.PI/180)
            if (p.w<2.1){ ctx.beginPath(); ctx.arc(0,0,p.w,0,Math.PI*2); ctx.fill() }
            else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h)
            ctx.restore()
        }
        raf = requestAnimationFrame(tick)
    }
    tick()
}

// ─── Init canvas ───
onMounted(() => {
    startCanvas()
})
onUnmounted(() => { if (raf) cancelAnimationFrame(raf) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

/* ════════════════════════════════════════
   BASE — fond plat
════════════════════════════════════════ */
.root {
    min-height: 100vh;
    background: #F4F2ED;               /* parchemin — SOLIDE */
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    overflow-x: hidden;
    color: #1A2A1A;
}

.particle-canvas {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
}

.grid-bg {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
    background-image:
        linear-gradient(rgba(80,110,80,0.030) 1px, transparent 1px),
        linear-gradient(90deg, rgba(80,110,80,0.030) 1px, transparent 1px);
    background-size: 28px 28px;
}

/* ════════════════════════════════════════
   FEUILLES FLOTTANTES
════════════════════════════════════════ */
.leaves-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.leaf         { position: absolute; pointer-events: none; }

.leaf-anim-1 { animation: leafDrift 20s linear infinite; }
.leaf-anim-2 { animation: leafDrift 26s linear infinite; }
.leaf-anim-3 { animation: leafDrift 18s linear infinite; }
.leaf-anim-4 { animation: leafDrift 30s linear infinite; }

@keyframes leafDrift {
    0%   { transform: translateY(0)     rotate(0deg)   translateX(0);     opacity:.2; }
    25%  { transform: translateY(-42px) rotate(90deg)  translateX(11px);  opacity:.28; }
    50%  { transform: translateY(-68px) rotate(180deg) translateX(0);     opacity:.2; }
    75%  { transform: translateY(-42px) rotate(270deg) translateX(-11px); opacity:.28; }
    100% { transform: translateY(0)     rotate(360deg) translateX(0);     opacity:.2; }
}

/* ════════════════════════════════════════
   BOUTON RETOUR
════════════════════════════════════════ */
.back-btn {
    position: fixed; top: 1.2rem; left: 1.2rem; z-index: 20;
    display: flex; align-items: center; gap: .5rem;
    padding: .48rem .85rem;
    background: #FAFAF6;               /* SOLIDE */
    border: 1px solid #DDE8DD;
    border-radius: 10px;
    color: #4A5A4A; text-decoration: none;
    font-size: .82rem; font-weight: 500;
    transition: background .16s, border-color .16s;
}
.back-btn:hover { background: #EBF3EB; border-color: #B0C8B0; color: #243C24; }
.back-btn svg { width: 16px; height: 16px; }

/* ════════════════════════════════════════
   WRAPPER PAGE
════════════════════════════════════════ */
.page-wrap {
    position: relative; z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.25rem 2rem;
}

/* ════════════════════════════════════════
   HÉRO
════════════════════════════════════════ */
.page-hero {
    text-align: center;
    padding: 5rem 1rem 2.5rem;
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
    animation: up .65s ease both;
}

.hero-brand {
    display: flex; align-items: center; gap: .75rem; justify-content: center;
}
.brand-icon {
    width: 38px; height: 38px; color: #3D6847;
    background: #E4EEE4;               /* vert pâle — SOLIDE */
    border-radius: 10px; padding: 7px; box-sizing: border-box;
    display: flex; align-items: center; justify-content: center;
}
.brand-icon svg { width: 100%; height: 100%; }

.hero-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    letter-spacing: -.04em; line-height: .95;
    color: #1A2A1A; margin: 0;
}
.hero-title em { font-style: italic; color: #3D6847; }  /* vert forêt — SOLIDE */

.hero-sub { font-size: 1rem; color: #6A7A6A; font-weight: 300; margin: 0; }

/* Badges */
.badges { display: flex; gap: .6rem; flex-wrap: wrap; justify-content: center; }
.badge {
    display: inline-flex; align-items: center; gap: .4rem;
    font-size: .76rem; font-weight: 500;
    padding: .3rem .75rem; border-radius: 20px;
}
.badge svg { width: 12px; height: 12px; flex-shrink: 0; }
.badge-green  { background: #E4EEE4; color: #3D6847; border: 1px solid #C8DAC8; }    /* SOLIDE */
.badge-brown  { background: #F0EAE0; color: #7A5838; border: 1px solid #D4C4AC; }    /* SOLIDE */
.badge-grey   { background: #EEEEED; color: #5A5E5A; border: 1px solid #CCCECB; }    /* SOLIDE */

/* ════════════════════════════════════════
   COLONNES
════════════════════════════════════════ */
.main-cols {
    display: flex; flex-direction: column; gap: 1.5rem;
}
@media (min-width: 1024px) {
    .main-cols { flex-direction: row; align-items: flex-start; gap: 2rem; }
    .col-left  { width: 38%; flex-shrink: 0; }
    .col-right { flex: 1; }
}

/* ════════════════════════════════════════
   CARD ILLUSTRATION
════════════════════════════════════════ */
.card-illus {
    background: #FAFAF6;               /* SOLIDE */
    border: 1px solid #DDE8DD;
    border-radius: 20px; padding: 1.75rem 1.5rem;
    display: flex; flex-direction: column; gap: 1.5rem;
    animation: up .75s .08s ease both;
}

/* Potager */
.garden-wrap {
    display: flex; align-items: center; justify-content: center;
    height: 210px; position: relative;
}
.garden-ring { border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; }
.garden-outer { width: 190px; height: 190px; background: #E8F0E8; border: 1px solid #C8DAC8; }  /* SOLIDE */
.garden-inner { width: 130px; height: 130px; background: #EFF5EF; border: 1px solid #DAEADA; }   /* SOLIDE */

.veg-item {
    position: absolute; width: 28px; height: 28px;
    animation: vegF 3s ease-in-out infinite;
}
.veg-svg { width: 100%; height: 100%; }
.veg-red    { color: #C45A5A; }
.veg-green  { color: #5A9A6A; }
.veg-purple { color: #7A6A9A; }
.veg-yellow { color: #B89A3A; }
.veg-orange { color: #C47A3A; }

@keyframes vegF { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

.garden-center { position: relative; z-index: 2; animation: vegF 4s ease-in-out infinite; }
.basket-svg    { width: 44px; height: 44px; color: #8A6A4A; }

/* Texte */
.illus-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.3rem; letter-spacing: -.02em;
    color: #1A2A1A; margin: 0 0 .4rem 0; line-height: 1.2;
    text-align: center;
}
.illus-sub { font-size: .84rem; color: #6A7A6A; line-height: 1.55; margin: 0; text-align: center; }

/* Avantages */
.benefits-title {
    display: flex; align-items: center; gap: .4rem;
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.05rem; color: #1A2A1A; margin: 0 0 .75rem 0;
}
.benefits-title svg { width: 16px; height: 16px; color: #5A9A6A; }

.benefit-item {
    display: flex; align-items: flex-start; gap: .65rem;
    padding: .65rem .75rem;
    background: #F4F2ED;               /* SOLIDE */
    border: 1px solid #E4EDE4; border-radius: 10px;
    margin-bottom: .5rem;
    transition: background .16s;
}
.benefit-item:hover { background: #EBF3EB; }
.benefit-dot   { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: .35rem; }
.benefit-name  { font-size: .84rem; font-weight: 500; color: #1A2A1A; }
.benefit-desc  { font-size: .76rem; color: #6A7A6A; margin-top: .1rem; }

/* ════════════════════════════════════════
   CARD FORMULAIRE
════════════════════════════════════════ */
.form-card {
    background: #FAFAF6;               /* SOLIDE */
    border: 1px solid #DDE8DD;
    border-radius: 20px;
    padding: 2rem 1.75rem;
    animation: up .75s .12s ease both;
}
@media (min-width: 640px) { .form-card { padding: 2.25rem 2.25rem; } }

.form-header { margin-bottom: 1.5rem; }
.form-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 1.9rem; letter-spacing: -.03em;
    color: #1A2A1A; margin: 0 0 .35rem 0; line-height: 1.1;
}
.title-dot { color: #3D6847; }
.form-sub { font-size: .87rem; color: #6A7A6A; font-weight: 300; margin: 0; }

/* Alertes */
.alert {
    display: flex; align-items: flex-start; gap: .75rem;
    padding: .9rem 1rem; border-radius: 12px;
    font-size: .85rem; margin-bottom: 1.2rem;
}
.alert-icon-wrap {
    width: 36px; height: 36px; border-radius: 50%;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
}
.alert-icon-wrap svg { width: 16px; height: 16px; }
.alert-err {
    background: #FEF2F2;               /* SOLIDE */
    border: 1px solid #FECACA; color: #B91C1C;
}
.alert-ok {
    background: #F0FDF4;               /* SOLIDE */
    border: 1px solid #BBF7D0; color: #166534;
}
.alert-icon-err { background: #FEE2E2; color: #DC2626; }
.alert-icon-ok  { background: #DCFCE7; color: #16A34A; }
.alert-main     { font-weight: 500; margin: 0; }
.alert-detail   { font-size: .77rem; opacity: .85; margin: .2rem 0 0; }

/* Formulaire */
.form-body { display: flex; flex-direction: column; gap: 1.1rem; }

.field-row {
    display: grid; grid-template-columns: 1fr; gap: 1rem;
}
@media (min-width: 560px) { .field-row { grid-template-columns: 1fr 1fr; } }

.field { display: flex; flex-direction: column; gap: .32rem; }

.flabel {
    display: flex; align-items: center; gap: .35rem;
    font-size: .72rem; font-weight: 500; color: #3A4A3A;
    letter-spacing: .06em; text-transform: uppercase;
}
.flabel svg { width: 11px; height: 11px; color: #5A9A6A; flex-shrink: 0; }
.flabel-opt { font-weight: 300; text-transform: none; letter-spacing: 0; font-size: .72rem; color: #8A988A; }

.finput {
    width: 100%; padding: .78rem 1rem;
    background: #FFFFFF;               /* blanc pur — SOLIDE */
    border: 1.5px solid #CDD8CD; border-radius: 10px;
    font-size: .91rem; font-family: 'DM Sans', sans-serif;
    color: #1A2A1A; outline: none;
    transition: border-color .16s, box-shadow .16s;
    box-sizing: border-box;
}
.finput::placeholder { color: #AABCAA; font-weight: 300; }
.finput:focus { border-color: #5A9A6A; box-shadow: 0 0 0 3px rgba(90,154,106,.09); }
.finput:hover:not(:focus) { border-color: #B2C8B2; }
.finput-mb { margin-bottom: .5rem; }

.field-hint { font-size: .72rem; color: #8A988A; margin: 0; }

/* Adresse */
.address-row { display: grid; grid-template-columns: 1fr; gap: .5rem; }
@media (min-width: 560px) { .address-row { grid-template-columns: 1fr 1fr 1fr; } }

/* Sélecteur de rôle */
.role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.role-card {
    position: relative;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    gap: .4rem; padding: 1rem .75rem;
    background: #FFFFFF;               /* SOLIDE */
    border: 1.5px solid #CDD8CD; border-radius: 14px;
    cursor: pointer; transition: border-color .18s, background .18s;
}
.role-card:hover { border-color: #B2C8B2; background: #F5F9F5; }

.role-active-green { border-color: #3D6847 !important; background: #EBF3EB !important; }   /* SOLIDE */
.role-active-brown { border-color: #A07850 !important; background: #F5EEE5 !important; }   /* SOLIDE */

.role-icon-wrap {
    width: 42px; height: 42px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
}
.role-icon-wrap svg { width: 20px; height: 20px; }
.role-icon-green { background: #E4EEE4; color: #3D6847; }                                  /* SOLIDE */
.role-icon-brown { background: #F0EAE0; color: #8A6A4A; }                                  /* SOLIDE */
.role-label  { font-size: .84rem; font-weight: 500; color: #1A2A1A; }
.role-desc   { font-size: .72rem; color: #6A7A6A; }
.role-check  { position: absolute; top: .5rem; right: .5rem; width: 18px; height: 18px; }
.role-check svg { width: 100%; height: 100%; }
.role-check-green { color: #3D6847; }
.role-check-brown { color: #A07850; }

/* Mots de passe */
.pw-wrap { position: relative; }
.pw-wrap .finput { padding-right: 2.8rem; }
.pw-eye {
    position: absolute; right: .68rem; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #8AB49A; transition: color .16s; padding: .22rem; border-radius: 6px;
}
.pw-eye:hover { color: #3D6847; }
.pw-eye svg { width: 15px; height: 15px; display: block; }

/* Force */
.strength-section { display: flex; flex-direction: column; gap: .35rem; margin-top: .35rem; }
.strength-row     { display: flex; align-items: center; justify-content: space-between; }
.strength-text    { font-size: .72rem; color: #4A5A4A; }
.strength-label   { font-size: .72rem; font-weight: 500; }
.strength-track   { height: 4px; background: #E4EDE4; border-radius: 2px; overflow: hidden; }
.strength-fill    { height: 100%; border-radius: 2px; transition: width .3s, background .3s; }
.pw-rules { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .22rem; }
.pw-rule  { display: flex; align-items: center; gap: .35rem; font-size: .7rem; }
.pw-rule svg { width: 11px; height: 11px; flex-shrink: 0; }
.rule-ok { color: #4A8A5A; }
.rule-no { color: #A8B8A8; }

/* Match */
.match-msg { display: flex; align-items: center; gap: .35rem; font-size: .78rem; margin-top: .2rem; }
.match-msg svg { width: 13px; height: 13px; flex-shrink: 0; }
.match-err { color: #DC2626; }
.match-ok  { color: #3D6847; }

/* Checkboxes */
.checks { display: flex; flex-direction: column; gap: .75rem; }
.check-label {
    display: flex; align-items: flex-start; gap: .55rem;
    cursor: pointer; font-size: .83rem; color: #4A5A4A; line-height: 1.5;
    user-select: none;
}
.chk-wrap { position: relative; flex-shrink: 0; margin-top: .05rem; }
.chk-wrap input { position: absolute; opacity: 0; width: 0; height: 0; }
.chk-box {
    width: 17px; height: 17px;
    border: 1.5px solid #C4D4C4; border-radius: 4px;
    background: #fff;                  /* SOLIDE */
    display: flex; align-items: center; justify-content: center;
    transition: all .16s;
}
.chk-on { background: #3D6847; border-color: #3D6847; }                                    /* SOLIDE */
.chk-box svg { width: 10px; height: 10px; color: white; }

.text-link { color: #5A8A6A; text-decoration: underline; text-underline-offset: 2px; font-weight: 500; }
.text-link:hover { color: #2A5030; }
.req-star { color: #DC2626; }

/* Bouton submit */
.btn-submit {
    display: flex; align-items: center; justify-content: center; gap: .5rem;
    width: 100%; padding: .95rem 1.5rem; margin-top: .5rem;
    background: #243C24;               /* vert forêt foncé — SOLIDE */
    color: #EDF5ED;
    border: none; border-radius: 11px;
    font-size: .95rem; font-family: 'DM Sans', sans-serif; font-weight: 500;
    cursor: pointer; letter-spacing: .01em;
    transition: background .2s, transform .16s, box-shadow .2s;
    position: relative; overflow: hidden;
}
.btn-shimmer {
    position: absolute; inset: 0;
    background: rgba(255,255,255,.055);
    transform: translateX(-110%) skewX(-18deg);
    transition: transform .55s ease;
}
.btn-submit:hover .btn-shimmer { transform: translateX(110%) skewX(-18deg); }
.btn-submit:hover { background: #182C18; transform: translateY(-1px); box-shadow: 0 5px 18px rgba(24,44,24,.2); }
.btn-submit:active { transform: translateY(0); }
.btn-submit:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.btn-submit svg:not(.spin) { width: 18px; height: 18px; }

.spin { width: 16px; height: 16px; animation: spinA 1s linear infinite; }

/* Lien login */
.login-link {
    padding-top: 1.1rem;
    border-top: 1px solid #E4EDE4;
    text-align: center;
    font-size: .86rem; color: #6A7A6A;
}
.login-link a { display: inline-flex; align-items: center; gap: .3rem; }
.login-link svg { width: 14px; height: 14px; }

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
.page-footer {
    position: relative; z-index: 1;
    text-align: center;
    padding: 1.5rem 1.5rem 2.5rem;
    font-size: .78rem; color: #8A988A; line-height: 1.6;
}
.footer-copy { margin-top: .4rem; font-size: .72rem; color: #A8B0A8; }

/* ════════════════════════════════════════
   ANIMATIONS
════════════════════════════════════════ */
@keyframes up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes spinA {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

/* ════════════════════════════════════════
   UTILS
════════════════════════════════════════ */
.sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
}
</style>
