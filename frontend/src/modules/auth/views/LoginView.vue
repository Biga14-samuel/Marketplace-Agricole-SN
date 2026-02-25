<template>
    <div class="login-root">

        <!-- ── Particules flottantes style Antigravity ── -->
        <canvas ref="particleCanvas" class="particle-canvas"></canvas>

        <!-- ── Grille de fond ultra-subtile ── -->
        <div class="grid-bg"></div>

        <!-- ── Layout principal ── -->
        <div class="login-wrapper">

            <!-- ══ PANNEAU GAUCHE ══ -->
            <div class="panel-left">

                <!-- Logo (agrandi) -->
                <div class="brand">
                    <div class="brand-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                    </div>
                    <span class="brand-name">MarketFraîche</span>
                </div>

                <!-- Tagline géant -->
                <div class="tagline-block">
                    <h1 class="tagline-main">Du champ<br>à votre<br>table!</h1>
                    <p class="tagline-sub">Produits frais, directement<br>des producteurs camerounais</p>
                </div>

                <!-- Features minimalistes (couleurs mises à jour) -->
                <div class="features-list">
                    <div class="feature-item" style="--delay: 0ms">
                        <span class="feature-dot" style="--c: #8FC98F"></span>   <!-- vert pastel principal -->
                        <span>100% local &amp; de saison</span>
                    </div>
                    <div class="feature-item" style="--delay: 80ms">
                        <span class="feature-dot" style="--c: #B48C5C"></span>   <!-- marron secondaire -->
                        <span>Producteurs certifiés</span>
                    </div>
                    <div class="feature-item" style="--delay: 160ms">
                        <span class="feature-dot" style="--c: #A68B6F"></span>   <!-- marron clair / gris brun -->
                        <span>Livraison ultra-fraîche</span>
                    </div>
                </div>

                <!-- Deco feuilles légères dans les coins (couleurs adaptées) -->
                <svg class="deco-leaf deco-tl" viewBox="0 0 80 80" fill="none">
                    <path d="M40,8 Q62,4 72,22 Q80,38 74,56 Q66,74 46,76 Q26,78 16,60 Q6,42 14,24 Q22,8 40,8 Z"
                        fill="#A3D9A3" opacity="0.18" />  <!-- vert pastel -->
                </svg>
                <svg class="deco-leaf deco-br" viewBox="0 0 100 100" fill="none">
                    <path d="M50,10 Q72,6 84,26 Q94,44 86,64 Q78,84 56,86 Q34,88 22,68 Q10,50 20,30 Q30,10 50,10 Z"
                        fill="#C4A484" opacity="0.15" />  <!-- marron pastel -->
                </svg>
            </div>

            <!-- ══ PANNEAU DROIT - FORMULAIRE ══ -->
            <div class="panel-right">
                <div class="form-card">

                    <!-- En-tête -->
                    <div class="form-header">
                        <h2 class="form-title">Connexion</h2>
                        <p class="form-subtitle">
                            Accédez à votre espace pour gérer vos commandes
                        </p>
                    </div>

                    <!-- Message d'erreur (inchangé) -->
                    <div v-if="errorMessage" class="alert alert-error">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>{{ errorMessage }}</span>
                    </div>

                    <!-- Message de succès (inchangé) -->
                    <div v-if="successMessage" class="alert alert-success">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>{{ successMessage }}</span>
                    </div>

                    <!-- Formulaire -->
                    <form @submit.prevent="handleLogin" class="form-body">

                        <!-- Email -->
                        <div class="field-group">
                            <label class="field-label">
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Adresse email
                            </label>
                            <input v-model="form.email" type="email" required placeholder="votre@email.com"
                                class="field-input" />
                        </div>

                        <!-- Mot de passe -->
                        <div class="field-group">
                            <label class="field-label">
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                Mot de passe
                            </label>
                            <div class="field-password-wrap">
                                <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                                    placeholder="Votre mot de passe" class="field-input" />
                                <button type="button" @click="showPassword = !showPassword" class="pwd-toggle">
                                    <svg v-if="showPassword" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                            clip-rule="evenodd" />
                                        <path
                                            d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                    <svg v-else viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fill-rule="evenodd"
                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Options -->
                        <div class="form-options">
                            <label class="remember-label">
                                <div class="custom-checkbox">
                                    <input type="checkbox" v-model="form.rememberMe" />
                                    <div class="checkbox-ui">
                                        <svg v-if="form.rememberMe" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <span>Se souvenir de moi</span>
                            </label>
                            <router-link to="/forgot-password" class="forgot-link">
                                Mot de passe oublié ?
                            </router-link>
                        </div>

                        <!-- CTA principal (vert pastel) -->
                        <button type="submit" :disabled="loading" class="btn-primary">
                            <svg v-if="loading" class="spin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>{{ loading ? 'Connexion...' : 'Se connecter' }}</span>
                        </button>

                        <!-- Séparateur -->
                        <div class="separator"><span>ou</span></div>

                        <!-- CTA secondaire (marron) -->
                        <router-link to="/register" class="btn-secondary">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clip-rule="evenodd" />
                            </svg>
                            Créer un compte
                        </router-link>
                    </form>

                    <!-- Footer -->
                    <div class="form-footer">
                        <p class="legal-text">
                            En vous connectant, vous acceptez nos
                            <a href="#">Conditions d'utilisation</a> et notre
                            <a href="#">Politique de confidentialité</a>
                        </p>
                        <router-link to="/" class="back-link">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            Découvrir les produits sans compte
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import type { LoginCredentials } from '@/modules/auth/types/auth.types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// ── État du formulaire (INCHANGÉ) ──
const form = reactive<LoginCredentials & { rememberMe?: boolean }>({
    email: '',
    password: '',
    rememberMe: false
})

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// ── Canvas Particules style Antigravity ──
const particleCanvas = ref<HTMLCanvasElement | null>(null)
let animFrame: number

interface Particle {
    x: number; y: number; w: number; h: number
    angle: number; color: string
    speedX: number; speedY: number; opacity: number
    driftAngle: number; driftSpeed: number; driftRadius: number
}

// Palette mise à jour : vert pastel, marron, gris
const PARTICLE_COLORS = [
    '#8FC98F', '#B48C5C', '#A0A0A0',
    '#A3D9A3', '#C4A484', '#7F9F7F', '#B89A7A'
]

function buildParticles(W: number, H: number): Particle[] {
    const count = Math.floor((W * H) / 4800)
    return Array.from({ length: count }, () => {
        const zone = Math.random()
        let x: number
        // Distribution concentrée sur les bords (signature Antigravity)
        if (zone < 0.38)      x = Math.random() * W * 0.28
        else if (zone < 0.65) x = W * 0.72 + Math.random() * W * 0.28
        else                   x = Math.random() * W
        return {
            x, y: Math.random() * H,
            w: 1.5 + Math.random() * 2.5,
            h: 3.5 + Math.random() * 7,
            angle: Math.random() * 360,
            color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
            speedX: (Math.random() - 0.5) * 0.07,
            speedY: -0.04 - Math.random() * 0.1,
            opacity: 0.22 + Math.random() * 0.5,
            driftAngle: Math.random() * Math.PI * 2,
            driftSpeed: 0.002 + Math.random() * 0.003,
            driftRadius: 0.3 + Math.random() * 0.9,
        }
    })
}

function startParticles() {
    const canvas = particleCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }
    resize()
    let particles = buildParticles(canvas.width, canvas.height)

    window.addEventListener('resize', () => {
        resize()
        particles = buildParticles(canvas.width, canvas.height)
    })

    const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const p of particles) {
            p.driftAngle += p.driftSpeed
            p.x += p.speedX + Math.sin(p.driftAngle) * p.driftRadius * 0.012
            p.y += p.speedY
            if (p.y < -15) { p.y = canvas.height + 15; p.x = Math.random() * canvas.width }
            if (p.x < -15) p.x = canvas.width + 15
            if (p.x > canvas.width + 15) p.x = -15
            ctx.save()
            ctx.globalAlpha = p.opacity
            ctx.fillStyle = p.color
            ctx.translate(p.x, p.y)
            p.angle += 0.035
            ctx.rotate((p.angle * Math.PI) / 180)
            if (p.w < 2.2) {
                ctx.beginPath(); ctx.arc(0, 0, p.w, 0, Math.PI * 2); ctx.fill()
            } else {
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
            }
            ctx.restore()
        }
        animFrame = requestAnimationFrame(tick)
    }
    tick()
}

// ── Logique de connexion (INCHANGÉE) ──
const handleLogin = async () => {
    if (!form.email || !form.password) {
        errorMessage.value = 'Veuillez remplir tous les champs'
        return
    }
    loading.value = true
    errorMessage.value = ''
    try {
        await authStore.login({ email: form.email, password: form.password })
        successMessage.value = 'Connexion réussie ! Redirection...'
        setTimeout(() => {
            const redirectPath = (route.query.redirect as string) || null
            if (redirectPath && redirectPath !== '/auth/login') { router.push(redirectPath); return }
            const user = authStore.user
            if (!user) { console.error('❌ User non défini après login'); router.push('/'); return }
            const role = user?.roles?.[0]?.name || 'Customer'
            console.log('👤 Utilisateur:', user.email, '🎭 Rôle:', role, '✅ isAuthenticated:', authStore.isAuthenticated)
            try {
                if (role === 'Producer')      router.push('/producer/dashboard')
                else if (role === 'Admin')    router.push('/admin/dashboard')
                else                          router.push('/profile/customer')
            } catch (navError) { console.error('❌ Erreur navigation:', navError); router.push('/') }
        }, 800)
    } catch (error: unknown) {
        const err = error as any
        errorMessage.value = err?.response?.data?.detail || err?.response?.data?.message ||
            err?.message || 'Identifiants incorrects. Veuillez réessayer.'
    } finally {
        loading.value = false
    }
}

onMounted(startParticles)
onUnmounted(() => { if (animFrame) cancelAnimationFrame(animFrame) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

/* ── Racine ── */
.login-root {
    min-height: 100vh;
    background-color: #F5F5F5;  /* fond gris */
    position: relative;
    display: flex;
    font-family: 'DM Sans', system-ui, sans-serif;
    overflow: hidden;
}

.particle-canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
}

.grid-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
        linear-gradient(to right, rgba(160, 160, 160, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(160, 160, 160, 0.05) 1px, transparent 1px);
    background-size: 28px 28px;
}

.login-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    min-height: 100vh;
}

/* ── Panneau gauche ── */
.panel-left {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem 3.5rem;
    position: relative;
    overflow: hidden;
}

@media (min-width: 1024px) {
    .panel-left { display: flex; width: 52%; }
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: fadeUp 0.6s ease both;
}
.brand-icon {
    width: 48px;          /* agrandi */
    height: 48px;         /* agrandi */
    color: #8FC98F;       /* vert pastel principal */
}
.brand-icon svg { width: 100%; height: 100%; }
.brand-name {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 2rem;      /* agrandi */
    color: #3D6B3D;       /* vert foncé (harmonieux) */
    letter-spacing: -0.02em;
}

.tagline-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    animation: fadeUp 0.7s 0.1s ease both;
}
.tagline-main {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(3.5rem, 5.5vw, 6.2rem);
    line-height: 1.0;
    letter-spacing: -0.03em;
    color: #4A3E2E;       /* marron foncé */
    margin: 0 0 1.5rem 0;
}
.tagline-sub {
    font-size: 1rem;
    color: #8B7A66;       /* brun-gris */
    font-weight: 300;
    line-height: 1.65;
    margin: 0;
}

.features-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    animation: fadeUp 0.7s 0.2s ease both;
    padding-bottom: 0.5rem;
}
.feature-item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: 0.88rem;
    color: #6B5A4A;       /* marron clair */
    opacity: 0;
    animation: fadeUp 0.5s calc(var(--delay) + 350ms) ease forwards;
}
.feature-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--c);
    flex-shrink: 0;
}

.deco-leaf { position: absolute; pointer-events: none; }
.deco-tl { top: -10px; left: -10px; width: 120px; height: 120px; transform: rotate(-20deg); }
.deco-br { bottom: -15px; right: 2rem; width: 160px; height: 160px; transform: rotate(30deg); }

/* ── Panneau droit ── */
.panel-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
}

@media (min-width: 1024px) {
    .panel-right {
        width: 48%;
        padding: 3rem 4rem;
        border-left: 1px solid rgba(180, 140, 92, 0.18); /* marron */
        background-color: rgba(255,255,252,0.78);
        backdrop-filter: blur(14px);
    }
}

.form-card {
    width: 100%;
    max-width: 420px;
    animation: fadeUp 0.8s 0.15s ease both;
}

.form-header { margin-bottom: 1.75rem; }
.form-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 2.3rem;
    letter-spacing: -0.03em;
    color: #4D3E2E;       /* marron foncé */
    margin: 0 0 0.45rem 0;
    line-height: 1.1;
}
.form-subtitle {
    font-size: 0.9rem;
    color: #8B7A66;       /* brun-gris */
    font-weight: 300;
    margin: 0;
    line-height: 1.55;
}

/* Alertes (inchangées) */
.alert {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.8rem 1rem;
    border-radius: 10px;
    font-size: 0.87rem;
    margin-bottom: 1.2rem;
    animation: fadeUp 0.3s ease;
}
.alert svg { width: 15px; height: 15px; flex-shrink: 0; }
.alert-error  { background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C; }
.alert-success{ background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; }

/* Formulaire */
.form-body { display: flex; flex-direction: column; gap: 1.05rem; }

.field-group { display: flex; flex-direction: column; gap: 0.38rem; }
.field-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    font-weight: 500;
    color: #6B5A4A;       /* marron */
    letter-spacing: 0.05em;
    text-transform: uppercase;
}
.field-label svg {
    width: 12px; height: 12px;
    color: #8FC98F;       /* vert pastel */
    flex-shrink: 0;
}

.field-input {
    width: 100%;
    padding: 0.82rem 1.05rem;
    background: rgba(255,255,253,0.92);
    border: 1.5px solid #D6CCC2;   /* beige-gris */
    border-radius: 11px;
    font-size: 0.93rem;
    font-family: 'DM Sans', sans-serif;
    color: #1E2B1E;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}
.field-input::placeholder { color: #A8B5A8; font-weight: 300; }
.field-input:focus {
    border-color: #8FC98F;         /* vert pastel */
    box-shadow: 0 0 0 3px rgba(143, 201, 143, 0.12);
}
.field-input:hover:not(:focus) { border-color: #D6C6B8; }

.field-password-wrap { position: relative; }
.field-password-wrap .field-input { padding-right: 3rem; }

.pwd-toggle {
    position: absolute; right: 0.7rem; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 0.3rem;
    color: #B48C5C;                /* marron */
    transition: color 0.2s; border-radius: 6px;
}
.pwd-toggle:hover { color: #8FC98F; } /* vert pastel au survol */
.pwd-toggle svg { width: 16px; height: 16px; display: block; }

/* Options */
.form-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.remember-label {
    display: flex; align-items: center; gap: 0.5rem;
    cursor: pointer; font-size: 0.84rem; color: #6B5A4A; user-select: none;
}
.custom-checkbox { position: relative; }
.custom-checkbox input { position: absolute; opacity: 0; width: 0; height: 0; }
.checkbox-ui {
    width: 17px; height: 17px;
    border: 1.5px solid #C4B8A8;   /* beige brun */
    border-radius: 5px;
    background: white;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
}
.custom-checkbox input:checked ~ .checkbox-ui {
    background: #8FC98F;           /* vert pastel */
    border-color: #8FC98F;
}
.checkbox-ui svg { width: 10px; height: 10px; color: white; }

.forgot-link {
    font-size: 0.84rem;
    color: #7CB37C;                /* vert pastel légèrement plus soutenu */
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
}
.forgot-link:hover { color: #5A8F5A; }

/* Boutons */
.btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    width: 100%; padding: 0.92rem 1.5rem;
    background: #5A8F5A;           /* vert pastel moyen */
    color: #F0F5F0;
    border: none; border-radius: 11px;
    font-size: 0.93rem; font-family: 'DM Sans', sans-serif; font-weight: 500;
    letter-spacing: 0.01em; cursor: pointer;
    transition: all 0.25s ease;
    position: relative; overflow: hidden;
}
.btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,0.08);
    transform: translateX(-105%) skewX(-15deg);
    transition: transform 0.6s ease;
}
.btn-primary:hover::after { transform: translateX(105%) skewX(-15deg); }
.btn-primary:hover {
    background: #4A7A4A;           /* vert plus foncé */
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(90, 143, 90, 0.25);
}
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.spin-icon { width: 16px; height: 16px; animation: spin 1s linear infinite; }

.btn-secondary {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    width: 100%; padding: 0.88rem 1.5rem;
    background: transparent;
    color: #8B7A66;                /* marron */
    border: 1.5px solid #D6C6B8;   /* beige brun */
    border-radius: 11px;
    font-size: 0.9rem; font-family: 'DM Sans', sans-serif; font-weight: 400;
    text-decoration: none; transition: all 0.2s; text-align: center;
}
.btn-secondary svg { width: 15px; height: 15px; }
.btn-secondary:hover {
    border-color: #B48C5C;         /* marron secondaire */
    color: #B48C5C;
    background: rgba(180, 140, 92, 0.07);
}

.separator {
    display: flex; align-items: center; gap: 0.7rem;
    color: #B8A68F;                /* beige foncé */
    font-size: 0.78rem;
}
.separator::before, .separator::after {
    content: ''; flex: 1; height: 1px;
    background: #E0D6CC;           /* gris-beige */
}

/* Footer */
.form-footer {
    margin-top: 1.6rem; padding-top: 1.2rem;
    border-top: 1px solid #E0D6CC; /* gris-beige */
    display: flex; flex-direction: column; align-items: center; gap: 0.8rem;
}
.legal-text {
    font-size: 0.76rem;
    color: #9B8E82;                /* gris brun */
    text-align: center;
    line-height: 1.6;
    margin: 0;
}
.legal-text a {
    color: #7CB37C;                /* vert pastel */
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s;
}
.legal-text a:hover { color: #5A8F5A; }
.back-link {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.82rem;
    color: #8B7A66;                /* marron */
    text-decoration: none;
    transition: color 0.2s;
}
.back-link:hover { color: #5A8F5A; } /* vert pastel au survol */
.back-link svg { width: 13px; height: 13px; }

/* ── Animations ── */
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

/* ── Mobile ── */
@media (max-width: 1023px) {
    .login-wrapper { align-items: center; justify-content: center; padding: 1.5rem; }
    .panel-right {
        background: rgba(255,255,252,0.92);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        box-shadow: 0 8px 40px rgba(90, 143, 90, 0.08);
        padding: 2.5rem 1.75rem;
        width: 100%; max-width: 440px;
    }
    .form-card::before {
        content: '🌿 MarketFraîche';
        display: block;
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 2rem;            /* agrandi */
        color: #5D4A3A;              /* marron */
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #E0D6CC;
    }
}
</style>