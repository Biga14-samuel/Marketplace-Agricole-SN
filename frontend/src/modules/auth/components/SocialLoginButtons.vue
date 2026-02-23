<template>
    <div class="social-login-buttons">
        <div class="divider">
            <span class="divider-text">{{ label }}</span>
        </div>

        <div class="buttons-container">
            <button v-for="provider in providers" :key="provider.id" @click="handleSocialLogin(provider.id)"
                :class="['social-button', provider.id]" type="button">
                <span class="social-icon">
                    <component :is="provider.icon" v-if="provider.icon" />
                    <span v-else>{{ provider.label.charAt(0) }}</span>
                </span>
                <span class="social-label">{{ provider.label }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
interface SocialProvider {
    id: string
    label: string
    icon?: any
    color?: string
}

interface Props {
    label?: string
    providers?: SocialProvider[]
}

const props = withDefaults(defineProps<Props>(), {
    label: 'ou continuer avec',
    providers: () => [
        {
            id: 'google',
            label: 'Google',
            color: '#DB4437'
        },
        {
            id: 'facebook',
            label: 'Facebook',
            color: '#4267B2'
        },
        {
            id: 'apple',
            label: 'Apple',
            color: '#000000'
        }
    ]
})

// ❌ SUPPRIMER LA DÉCLARATION EN DOUBLE et ❌ SUPPRIMER CETTE LIGNE AUSSI :
// const emit = defineEmits<{
//     (e: 'update:address', id: number): void
//     (e: 'delete'): void
// }>()

// ✅ UNIQUEMENT CETTE DÉCLARATION
const emit = defineEmits<{
    'social-login': [provider: string]
}>()

const handleSocialLogin = (provider: string) => {
    emit('social-login', provider)
    // Ici vous intégrerez la logique d'authentification sociale
    console.log(`Login with ${provider}`)

    // Redirection vers l'API d'authentification sociale
    // window.location.href = `/api/auth/${provider}`
}
</script>

<style scoped>
.social-login-buttons {
    width: 100%;
}

.divider {
    display: flex;
    align-items: center;
    margin: 24px 0;
    color: #718096;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e2e8f0;
}

.divider-text {
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
}

.buttons-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    color: #4a5568;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-button.google:hover {
    border-color: #DB4437;
    background-color: rgba(219, 68, 55, 0.05);
    color: #DB4437;
}

.social-button.facebook:hover {
    border-color: #4267B2;
    background-color: rgba(66, 103, 178, 0.05);
    color: #4267B2;
}

.social-button.apple:hover {
    border-color: #000000;
    background-color: rgba(0, 0, 0, 0.05);
    color: #000000;
}

.social-button:active {
    transform: translateY(0);
}

.social-icon {
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
}

.social-label {
    flex: 1;
    text-align: center;
}

/* Responsive */
@media (min-width: 640px) {
    .buttons-container {
        flex-direction: row;
    }

    .social-button {
        flex: 1;
    }
}
</style>