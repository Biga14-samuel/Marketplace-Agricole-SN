<template>
    <footer class="auth-footer">
        <div class="footer-content">
            <p class="copyright">
                &copy; {{ currentYear }} Marketplace Agricole. Tous droits réservés.
            </p>
            <div class="footer-links" v-if="showLinks">
                <a href="/terms" class="footer-link">Conditions d'utilisation</a>
                <a href="/privacy" class="footer-link">Politique de confidentialité</a>
                <a href="/help" class="footer-link">Aide</a>
                <a href="/contact" class="footer-link">Contact</a>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    currentYear?: number
    showLinks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    currentYear: new Date().getFullYear(),
    showLinks: true
})
</script>

<style scoped>
.auth-footer {
    margin-top: 40px;
    padding: 24px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
}

.copyright {
    color: #666;
    font-size: 14px;
    margin-bottom: 16px;
}

.footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
}

.footer-link {
    color: #4caf50;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s ease;
}

.footer-link:hover {
    color: #2e7d32;
    text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
    .footer-links {
        flex-direction: column;
        gap: 12px;
    }

    .auth-footer {
        padding: 20px 0;
        margin-top: 30px;
    }
}
</style>