<template>
    <div class="auth-form-container">
        <!-- Split Screen Layout -->
        <div class="split-screen">
            <!-- Left Side - Illustration -->
            <div class="illustration-side">
                <div class="nature-background">
                    <!-- Animated leaves in background -->
                    <div class="leaf leaf-1"></div>
                    <div class="leaf leaf-2"></div>
                    <div class="leaf leaf-3"></div>
                    <div class="leaf leaf-4"></div>

                    <!-- Main illustration -->
                    <div class="fresh-produce-illustration">
                        <div class="tomato"></div>
                        <div class="carrot"></div>
                        <div class="lettuce"></div>
                        <div class="apple"></div>
                    </div>

                    <!-- Overlay text -->
                    <div class="illustration-text">
                        <h2 class="slogan">Le goût du local,<br>la fraîcheur du direct</h2>
                        <p class="sub-slogan">Rejoignez une communauté de producteurs et consommateurs passionnés</p>
                    </div>
                </div>
            </div>

            <!-- Right Side - Form -->
            <div class="form-side">
                <!-- Form container with organic shape -->
                <div class="form-wrapper">
                    <!-- Organic corner accent -->
                    <div class="organic-corner"></div>

                    <!-- Form tabs -->
                    <div class="form-tabs">
                        <button @click="setActiveTab('login')"
                            :class="['tab-button', { 'active': activeTab === 'login' }]">
                            <span class="tab-icon">👤</span>
                            <span class="tab-text">Connexion</span>
                            <div class="tab-indicator" v-if="activeTab === 'login'"></div>
                        </button>

                        <button @click="setActiveTab('register')"
                            :class="['tab-button', { 'active': activeTab === 'register' }]">
                            <span class="tab-icon">🌱</span>
                            <span class="tab-text">Inscription</span>
                            <div class="tab-indicator" v-if="activeTab === 'register'"></div>
                        </button>
                    </div>

                    <!-- Form content with transition -->
                    <transition :name="transitionDirection" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                        <!-- Login Form -->
                        <form v-if="activeTab === 'login'" key="login" @submit.prevent="handleLogin" class="auth-form">
                            <div class="form-group organic-input">
                                <label for="email-login" class="input-label">
                                    <span class="label-icon">📧</span>
                                    <span>Email</span>
                                </label>
                                <input id="email-login" v-model="loginForm.email" type="email"
                                    placeholder="votre@email.local" required class="input-field" />
                                <div class="input-decoration"></div>
                            </div>

                            <div class="form-group organic-input">
                                <label for="password-login" class="input-label">
                                    <span class="label-icon">🔒</span>
                                    <span>Mot de passe</span>
                                </label>
                                <div class="password-container">
                                    <input id="password-login" v-model="loginForm.password"
                                        :type="showPassword.login ? 'text' : 'password'"
                                        placeholder="Votre mot de passe" required class="input-field" />
                                    <button type="button" @click="togglePasswordVisibility('login')"
                                        class="password-toggle">
                                        {{ showPassword.login ? '👁️' : '👁️‍🗨️' }}
                                    </button>
                                </div>
                                <div class="input-decoration"></div>
                            </div>

                            <div class="form-options">
                                <label class="remember-me">
                                    <input type="checkbox" v-model="loginForm.remember" />
                                    <span class="checkmark"></span>
                                    Se souvenir de moi
                                </label>
                                <a href="#" class="forgot-password">Mot de passe oublié ?</a>
                            </div>

                            <button type="submit" class="submit-button organic-button">
                                <span class="button-text">Se connecter</span>
                                <span class="button-icon">→</span>
                                <div class="button-hover-effect"></div>
                            </button>

                            <div class="divider">
                                <span class="divider-text">ou continuer avec</span>
                            </div>

                            <div class="social-login">
                                <button type="button" class="social-button google">
                                    <span class="social-icon">G</span>
                                    <span>Google</span>
                                </button>
                                <button type="button" class="social-button facebook">
                                    <span class="social-icon">f</span>
                                    <span>Facebook</span>
                                </button>
                            </div>
                        </form>

                        <!-- Register Form -->
                        <form v-else key="register" @submit.prevent="handleRegister" class="auth-form">
                            <div class="form-group organic-input">
                                <label for="name-register" class="input-label">
                                    <span class="label-icon">👤</span>
                                    <span>Nom complet</span>
                                </label>
                                <input id="name-register" v-model="registerForm.name" type="text"
                                    placeholder="Votre nom et prénom" required class="input-field" />
                                <div class="input-decoration"></div>
                            </div>

                            <div class="form-group organic-input">
                                <label for="email-register" class="input-label">
                                    <span class="label-icon">📧</span>
                                    <span>Email</span>
                                </label>
                                <input id="email-register" v-model="registerForm.email" type="email"
                                    placeholder="votre@email.local" required class="input-field" />
                                <div class="input-decoration"></div>
                            </div>

                            <div class="form-group organic-input">
                                <label for="password-register" class="input-label">
                                    <span class="label-icon">🔒</span>
                                    <span>Mot de passe</span>
                                </label>
                                <div class="password-container">
                                    <input id="password-register" v-model="registerForm.password"
                                        :type="showPassword.register ? 'text' : 'password'"
                                        placeholder="Créez un mot de passe sécurisé" required class="input-field" />
                                    <button type="button" @click="togglePasswordVisibility('register')"
                                        class="password-toggle">
                                        {{ showPassword.register ? '👁️' : '👁️‍🗨️' }}
                                    </button>
                                </div>
                                <div class="password-strength">
                                    <div class="strength-meter">
                                        <div :class="['strength-fill', passwordStrengthClass]"
                                            :style="{ width: passwordStrength + '%' }"></div>
                                    </div>
                                    <span class="strength-text">{{ passwordStrengthText }}</span>
                                </div>
                                <div class="input-decoration"></div>
                            </div>

                            <div class="form-group organic-input">
                                <label for="confirm-password" class="input-label">
                                    <span class="label-icon">✅</span>
                                    <span>Confirmer le mot de passe</span>
                                </label>
                                <div class="password-container">
                                    <input id="confirm-password" v-model="registerForm.confirmPassword"
                                        :type="showPassword.confirm ? 'text' : 'password'"
                                        placeholder="Retapez votre mot de passe" required class="input-field" />
                                    <button type="button" @click="togglePasswordVisibility('confirm')"
                                        class="password-toggle">
                                        {{ showPassword.confirm ? '👁️' : '👁️‍🗨️' }}
                                    </button>
                                </div>
                                <div class="input-decoration"></div>
                            </div>

                            <div class="form-options">
                                <label class="terms-agreement">
                                    <input type="checkbox" v-model="registerForm.agreeTerms" required />
                                    <span class="checkmark"></span>
                                    <span>J'accepte les <a href="#" class="terms-link">conditions
                                            d'utilisation</a></span>
                                </label>
                            </div>

                            <button type="submit" class="submit-button organic-button">
                                <span class="button-text">Créer mon compte</span>
                                <span class="button-icon">🌱</span>
                                <div class="button-hover-effect"></div>
                            </button>

                            <div class="divider">
                                <span class="divider-text">ou s'inscrire avec</span>
                            </div>

                            <div class="social-login">
                                <button type="button" class="social-button google">
                                    <span class="social-icon">G</span>
                                    <span>Google</span>
                                </button>
                                <button type="button" class="social-button facebook">
                                    <span class="social-icon">f</span>
                                    <span>Facebook</span>
                                </button>
                            </div>
                        </form>
                    </transition>

                    <!-- Bottom text -->
                    <div class="form-footer">
                        <template v-if="activeTab === 'login'">
                            <p>Nouveau sur la plateforme ? <a href="#" @click.prevent="setActiveTab('register')"
                                    class="switch-link">Créez un compte</a></p>
                        </template>
                        <template v-else>
                            <p>Déjà membre ? <a href="#" @click.prevent="setActiveTab('login')"
                                    class="switch-link">Connectez-vous</a></p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'

// Active tab state
const activeTab = ref<'login' | 'register'>('login')
const transitionDirection = ref('slide-left')

// Form data
const loginForm = reactive({
    email: '',
    password: '',
    remember: false
})

const registerForm = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
})

// Password visibility
const showPassword = reactive({
    login: false,
    register: false,
    confirm: false
})

// Animation control
const setActiveTab = (tab: 'login' | 'register') => {
    transitionDirection.value = tab === 'register' ? 'slide-left' : 'slide-right'
    activeTab.value = tab
}

const togglePasswordVisibility = (type: keyof typeof showPassword) => {
    showPassword[type] = !showPassword[type]
}

// Password strength calculator
const passwordStrength = computed(() => {
    const password = registerForm.password
    if (!password) return 0

    let score = 0

    // Length
    if (password.length >= 8) score += 25
    if (password.length >= 12) score += 15

    // Complexity
    if (/[A-Z]/.test(password)) score += 20
    if (/[a-z]/.test(password)) score += 20
    if (/\d/.test(password)) score += 20
    if (/[@$!%*?&]/.test(password)) score += 20

    return Math.min(score, 100)
})

const passwordStrengthClass = computed(() => {
    const strength = passwordStrength.value
    if (strength < 40) return 'strength-weak'
    if (strength < 70) return 'strength-medium'
    if (strength < 90) return 'strength-strong'
    return 'strength-very-strong'
})

const passwordStrengthText = computed(() => {
    const strength = passwordStrength.value
    if (strength < 40) return 'Faible'
    if (strength < 70) return 'Moyen'
    if (strength < 90) return 'Fort'
    return 'Très fort'
})

// Form handlers
const handleLogin = () => {
    console.log('Login attempt:', loginForm)
    // Implement login logic
}

const handleRegister = () => {
    console.log('Register attempt:', registerForm)
    // Implement register logic
}

// Animation hooks for custom bezier curves - CORRECTION DES TYPES
const beforeEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.opacity = '0'
    element.style.transform = 'translateY(20px)'
}

const enter = (el: Element, done: () => void) => {
    const element = el as HTMLElement
    element.style.transition = 'all 600ms cubic-bezier(0.68, -0.55, 0.27, 1.55)'
    setTimeout(() => {
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
        done()
    }, 50)
}

const leave = (el: Element, done: () => void) => {
    const element = el as HTMLElement
    element.style.transition = 'all 400ms cubic-bezier(0.68, -0.55, 0.27, 1.55)'
    setTimeout(() => {
        element.style.opacity = '0'
        element.style.transform = 'translateY(-20px)'
        done()
    }, 50)
}

// Initialize on mount
onMounted(() => {
    // Add CSS for ultra-fluid transitions
    const style = document.createElement('style')
    style.textContent = `
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-right-enter-active,
    .slide-right-leave-active {
      transition: all 600ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }
    
    .slide-left-enter-from {
      opacity: 0;
      transform: translateX(30px);
    }
    
    .slide-left-leave-to {
      opacity: 0;
      transform: translateX(-30px);
    }
    
    .slide-right-enter-from {
      opacity: 0;
      transform: translateX(-30px);
    }
    
    .slide-right-leave-to {
      opacity: 0;
      transform: translateX(30px);
    }
  `
    document.head.appendChild(style)
})
</script>

<style scoped>
/* Custom cubic-bezier for ultra-fluid animations */
:root {
    --ultra-fluid: cubic-bezier(0.68, -0.55, 0.27, 1.55);
    --smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-form-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: linear-gradient(135deg,
            #e8f5e9 0%,
            #c8e6c9 25%,
            #a5d6a7 50%,
            #81c784 75%,
            #66bb6a 100%);
    position: relative;
    overflow: hidden;
}

/* Nature background pattern */
.auth-form-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2381c784' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
    animation: gentleFloat 30s linear infinite;
}

.split-screen {
    display: flex;
    width: 100%;
    max-width: 1200px;
    min-height: 700px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    overflow: hidden;
    box-shadow:
        0 25px 50px -12px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.illustration-side {
    flex: 1;
    background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
    position: relative;
    overflow: hidden;
    display: none;
}

@media (min-width: 768px) {
    .illustration-side {
        display: block;
    }
}

.nature-background {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(56, 142, 60, 0.2) 0%, transparent 50%);
}

/* Animated leaves */
.leaf {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50% 0 50% 50%;
    transform: rotate(45deg);
    animation: leafFloat 20s infinite linear;
}

.leaf-1 {
    width: 80px;
    height: 80px;
    top: 20%;
    left: 15%;
    animation-delay: 0s;
}

.leaf-2 {
    width: 60px;
    height: 60px;
    top: 60%;
    left: 70%;
    animation-delay: 5s;
}

.leaf-3 {
    width: 100px;
    height: 100px;
    top: 80%;
    left: 20%;
    animation-delay: 10s;
}

.leaf-4 {
    width: 70px;
    height: 70px;
    top: 30%;
    left: 80%;
    animation-delay: 15s;
}

/* Fresh produce illustration */
.fresh-produce-illustration {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
}

.tomato,
.carrot,
.lettuce,
.apple {
    position: absolute;
    border-radius: 50%;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

.tomato {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
    top: 20%;
    left: 20%;
    animation: float 4s ease-in-out infinite;
}

.carrot {
    width: 100px;
    height: 60px;
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    border-radius: 50px;
    top: 50%;
    left: 60%;
    animation: float 4s ease-in-out infinite 0.5s;
}

.lettuce {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    border-radius: 60px 60px 30px 30px;
    top: 60%;
    left: 20%;
    animation: float 4s ease-in-out infinite 1s;
}

.apple {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%);
    top: 30%;
    left: 70%;
    animation: float 4s ease-in-out infinite 1.5s;
}

.illustration-text {
    position: absolute;
    bottom: 60px;
    left: 40px;
    right: 40px;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.slogan {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
    line-height: 1.2;
}

.sub-slogan {
    font-size: 1rem;
    opacity: 0.9;
}

.form-side {
    flex: 1;
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (min-width: 768px) {
    .form-side {
        flex: 1;
    }
}

.form-wrapper {
    width: 100%;
    max-width: 400px;
    position: relative;
}

.organic-corner {
    position: absolute;
    top: -20px;
    left: -20px;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #81c784 0%, #4caf50 100%);
    border-radius: 0 0 100% 0;
    z-index: 1;
}

.form-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 40px;
    position: relative;
    z-index: 2;
}

.tab-button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid rgba(129, 199, 132, 0.3);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.5s var(--ultra-fluid);
    position: relative;
}

.tab-button:hover {
    transform: translateY(-5px);
    background: rgba(129, 199, 132, 0.1);
    border-color: rgba(129, 199, 132, 0.5);
}

.tab-button.active {
    background: rgba(129, 199, 132, 0.15);
    border-color: #4caf50;
    transform: translateY(-5px);
}

.tab-icon {
    font-size: 2rem;
    margin-bottom: 10px;
}

.tab-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2e7d32;
}

.tab-indicator {
    position: absolute;
    bottom: -10px;
    width: 40px;
    height: 4px;
    background: linear-gradient(to right, #81c784, #4caf50);
    border-radius: 2px;
    animation: indicatorPulse 2s infinite;
}

.auth-form {
    animation: formAppear 0.8s var(--ultra-fluid);
}

.form-group {
    margin-bottom: 25px;
    position: relative;
}

.organic-input {
    position: relative;
}

.input-label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    color: #2e7d32;
    font-weight: 600;
    font-size: 0.95rem;
}

.label-icon {
    font-size: 1.2rem;
}

.input-field {
    width: 100%;
    padding: 18px 20px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(129, 199, 132, 0.3);
    border-radius: 15px;
    font-size: 1rem;
    transition: all 0.4s var(--ultra-fluid);
    position: relative;
    z-index: 1;
}

.input-field:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow:
        0 0 0 4px rgba(76, 175, 80, 0.1),
        0 10px 30px rgba(76, 175, 80, 0.2);
    transform: translateY(-2px);
}

.input-decoration {
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 2px;
    background: linear-gradient(to right, transparent, #81c784, transparent);
    opacity: 0;
    transition: all 0.4s var(--ultra-fluid);
}

.input-field:focus~.input-decoration {
    opacity: 1;
    bottom: -5px;
    left: 0;
    right: 0;
}

.password-container {
    position: relative;
}

.password-toggle {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 5px;
    transition: all 0.3s var(--smooth);
}

.password-toggle:hover {
    transform: translateY(-50%) scale(1.1);
}

.password-strength {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.strength-meter {
    flex: 1;
    height: 6px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.strength-fill {
    height: 100%;
    border-radius: 3px;
    transition: all 0.6s var(--ultra-fluid);
}

.strength-weak {
    background: linear-gradient(to right, #ff5252, #ff9800);
}

.strength-medium {
    background: linear-gradient(to right, #ff9800, #ffeb3b);
}

.strength-strong {
    background: linear-gradient(to right, #4caf50, #81c784);
}

.strength-very-strong {
    background: linear-gradient(to right, #2e7d32, #4caf50);
}

.strength-text {
    font-size: 0.9rem;
    font-weight: 600;
    min-width: 70px;
    text-align: right;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    font-size: 0.9rem;
}

.remember-me,
.terms-agreement {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #555;
}

.checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid #81c784;
    border-radius: 4px;
    display: inline-block;
    position: relative;
    transition: all 0.3s var(--smooth);
}

input[type="checkbox"]:checked+.checkmark::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #4caf50;
    font-weight: bold;
}

.forgot-password {
    color: #4caf50;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s var(--smooth);
}

.forgot-password:hover {
    color: #2e7d32;
    text-decoration: underline;
}

.terms-link {
    color: #4caf50;
    text-decoration: none;
    font-weight: 600;
}

.terms-link:hover {
    text-decoration: underline;
}

.submit-button {
    width: 100%;
    padding: 20px;
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    color: white;
    border: none;
    border-radius: 15px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.5s var(--ultra-fluid);
    margin-bottom: 25px;
}

.organic-button:hover {
    transform: translateY(-5px);
    box-shadow:
        0 20px 40px rgba(76, 175, 80, 0.3),
        0 0 0 2px rgba(76, 175, 80, 0.1);
}

.button-text {
    position: relative;
    z-index: 2;
}

.button-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    z-index: 2;
    transition: all 0.5s var(--ultra-fluid);
}

.submit-button:hover .button-icon {
    transform: translateY(-50%) translateX(5px);
}

.button-hover-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.8s ease;
}

.submit-button:hover .button-hover-effect {
    left: 100%;
}

.divider {
    display: flex;
    align-items: center;
    margin: 30px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #81c784, transparent);
}

.divider-text {
    padding: 0 20px;
    color: #666;
    font-size: 0.9rem;
}

.social-login {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.social-button {
    flex: 1;
    padding: 15px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.4s var(--ultra-fluid);
    font-weight: 600;
}

.social-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.social-button.google:hover {
    border-color: #db4437;
    color: #db4437;
}

.social-button.facebook:hover {
    border-color: #4267B2;
    color: #4267B2;
}

.social-icon {
    font-size: 1.2rem;
    font-weight: bold;
}

.form-footer {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    color: #666;
}

.switch-link {
    color: #4caf50;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s var(--smooth);
}

.switch-link:hover {
    color: #2e7d32;
    text-decoration: underline;
}

/* Animations */
@keyframes gentleFloat {
    0% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(180deg);
    }

    100% {
        transform: translateY(0) rotate(360deg);
    }
}

@keyframes leafFloat {
    0% {
        transform: rotate(45deg) translateY(0) translateX(0);
    }

    25% {
        transform: rotate(45deg) translateY(-20px) translateX(20px);
    }

    50% {
        transform: rotate(45deg) translateY(0) translateX(40px);
    }

    75% {
        transform: rotate(45deg) translateY(20px) translateX(20px);
    }

    100% {
        transform: rotate(45deg) translateY(0) translateX(0);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}

@keyframes indicatorPulse {

    0%,
    100% {
        opacity: 1;
        width: 40px;
    }

    50% {
        opacity: 0.7;
        width: 50px;
    }
}

@keyframes formAppear {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Ultra-fluid custom bezier curves */
* {
    transition-timing-function: var(--smooth) !important;
}

/* Responsive adjustments */
@media (max-width: 767px) {
    .split-screen {
        min-height: auto;
    }

    .form-side {
        padding: 20px;
    }

    .form-tabs {
        flex-direction: column;
    }

    .social-login {
        flex-direction: column;
    }

    .slogan {
        font-size: 1.5rem;
    }
}
</style>