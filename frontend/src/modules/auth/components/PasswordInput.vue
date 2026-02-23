<template>
    <div class="password-input-wrapper">
        <div class="relative">
            <input :type="inputType" :value="modelValue" @input="handleInput" :placeholder="placeholder"
                :required="required" :class="[
                    'password-input',
                    error ? 'input-error' : '',
                    size ? `input-${size}` : ''
                ]" />
            <button type="button" class="password-toggle" @click="toggleVisibility"
                :aria-label="showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
        </div>
        <div v-if="error" class="error-message">
            {{ error }}
        </div>
        <div v-if="showStrength && modelValue" class="password-strength-indicator">
            <div class="strength-bar" :style="{ width: strengthPercentage + '%' }" :class="strengthClass"></div>
            <span class="strength-text">{{ strengthText }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    modelValue: string
    placeholder?: string
    required?: boolean
    error?: string
    showStrength?: boolean
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Entrez votre mot de passe',
    required: false,
    showStrength: false,
    size: 'md'
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const showPassword = ref(false)
const inputType = computed(() => showPassword.value ? 'text' : 'password')

const toggleVisibility = () => {
    showPassword.value = !showPassword.value
}

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}

// Calcul de la force du mot de passe
const strengthPercentage = computed(() => {
    const password = props.modelValue
    if (!password) return 0

    let score = 0
    if (password.length >= 8) score += 25
    if (password.length >= 12) score += 15
    if (/[A-Z]/.test(password)) score += 20
    if (/[a-z]/.test(password)) score += 20
    if (/\d/.test(password)) score += 20
    if (/[@$!%*?&]/.test(password)) score += 20

    return Math.min(score, 100)
})

const strengthClass = computed(() => {
    const strength = strengthPercentage.value
    if (strength < 40) return 'strength-weak'
    if (strength < 70) return 'strength-medium'
    if (strength < 90) return 'strength-strong'
    return 'strength-very-strong'
})

const strengthText = computed(() => {
    const strength = strengthPercentage.value
    if (strength < 40) return 'Faible'
    if (strength < 70) return 'Moyen'
    if (strength < 90) return 'Fort'
    return 'Très fort'
})
</script>

<style scoped>
.password-input-wrapper {
    width: 100%;
}

.relative {
    position: relative;
}

.password-input {
    width: 100%;
    padding: 12px 45px 12px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: white;
}

.password-input:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.input-error {
    border-color: #f44336;
}

.input-error:focus {
    border-color: #f44336;
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    padding: 4px;
    color: #666;
    transition: color 0.2s ease;
}

.password-toggle:hover {
    color: #4caf50;
}

.error-message {
    margin-top: 6px;
    font-size: 14px;
    color: #f44336;
}

.password-strength-indicator {
    margin-top: 10px;
}

.strength-bar {
    height: 4px;
    border-radius: 2px;
    transition: width 0.3s ease;
}

.strength-weak {
    background-color: #f44336;
}

.strength-medium {
    background-color: #ff9800;
}

.strength-strong {
    background-color: #4caf50;
}

.strength-very-strong {
    background-color: #2e7d32;
}

.strength-text {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 500;
    text-align: right;
}
</style>