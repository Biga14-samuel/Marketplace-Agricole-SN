<template>
    <header class="auth-header">
        <div class="header-content">
            <div class="logo-container">
                <slot name="logo">
                    <div class="default-logo">
                        <span class="logo-icon">🌱</span>
                        <h1 class="logo-text">{{ appName }}</h1>
                    </div>
                </slot>
            </div>

            <div class="header-title">
                <slot name="title">
                    <h2 class="title">{{ title }}</h2>
                    <p class="subtitle" v-if="subtitle">{{ subtitle }}</p>
                </slot>
            </div>

            <div class="header-actions" v-if="$slots.actions">
                <slot name="actions"></slot>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
interface Props {
    appName?: string
    title?: string
    subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
    appName: 'Marketplace Agricole',
    title: 'Bienvenue',
    subtitle: ''
})
</script>

<style scoped>
.auth-header {
    width: 100%;
    padding: 24px 0;
    background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
    border-radius: 16px;
    margin-bottom: 32px;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.logo-container {
    margin-bottom: 8px;
}

.default-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.default-logo:hover {
    transform: scale(1.05);
}

.logo-icon {
    font-size: 40px;
    animation: gentleBounce 3s ease-in-out infinite;
}

.logo-text {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
}

.header-title {
    text-align: center;
}

.title {
    font-size: 32px;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 8px 0;
    line-height: 1.2;
}

.subtitle {
    font-size: 16px;
    color: #718096;
    margin: 0;
    line-height: 1.5;
    max-width: 600px;
}

.header-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

/* Animations */
@keyframes gentleBounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

/* Responsive */
@media (min-width: 768px) {
    .header-content {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .header-title {
        text-align: left;
        flex: 1;
        padding: 0 32px;
    }

    .title {
        font-size: 36px;
    }

    .subtitle {
        font-size: 18px;
    }
}

@media (max-width: 767px) {
    .auth-header {
        padding: 16px 0;
        margin-bottom: 24px;
    }

    .logo-icon {
        font-size: 32px;
    }

    .logo-text {
        font-size: 24px;
    }

    .title {
        font-size: 24px;
    }

    .subtitle {
        font-size: 14px;
    }
}
</style>