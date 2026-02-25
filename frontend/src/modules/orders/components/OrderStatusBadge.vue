<template>
  <span 
    :class="[
      'order-status-badge',
      'inline-flex items-center',
      sizeClasses,
      roundedClasses,
      getStatusClasses(status),
      { 'cursor-pointer hover:shadow-md transition-all duration-500': clickable }
    ]"
    :style="{
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      ...customStyles
    }"
    @click="handleClick"
  >
    <!-- Animation de pulse pour certains statuts -->
    <span 
      v-if="showPulse && (status === 'pending' || status === 'preparing')"
      :class="[
        'absolute inset-0 rounded-full',
        getPulseClass(status)
      ]"
      :style="{
        animation: getPulseAnimation(status)
      }"
    ></span>
    
    <!-- Icône -->
    <span v-if="showIcon" class="flex items-center justify-center mr-1.5">
      <i :class="[
        'text-xs transition-transform duration-500',
        getIconClass(status),
        { 'animate-soft-bounce': animateIcon && (status === 'preparing' || status === 'shipped') }
      ]"></i>
    </span>
    
    <!-- Texte -->
    <span class="relative z-10 font-medium whitespace-nowrap">
      {{ text || getStatusText(status) }}
    </span>
    
    <!-- Élément décoratif organique -->
    <span 
      v-if="showOrganicElement"
      class="absolute right-1 top-1 opacity-20"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" 
              :fill="getOrganicColor(status)"/>
      </svg>
    </span>
  </span>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'OrderStatusBadge',
  
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => [
        'pending',      // En attente
        'confirmed',    // Confirmée
        'preparing',    // En préparation
        'ready',        // Prête
        'shipped',      // Expédiée
        'delivered',    // Livrée
        'cancelled',    // Annulée
        'refunded',     // Remboursée
        'on-hold',      // En attente
        'failed'        // Échouée
      ].includes(value)
    },
    text: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'outline', 'soft', 'pill'].includes(value)
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    showPulse: {
      type: Boolean,
      default: true
    },
    showOrganicElement: {
      type: Boolean,
      default: true
    },
    animateIcon: {
      type: Boolean,
      default: true
    },
    clickable: {
      type: Boolean,
      default: false
    },
    customStyles: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    // Classes de taille
    const sizeClasses = computed(() => {
      const classes = {
        xs: 'px-2 py-0.5 text-xs',
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-1.5 text-sm',
        lg: 'px-5 py-2 text-base'
      }
      return classes[props.size] || classes.md
    })
    
    // Classes d'arrondi selon la variante
    const roundedClasses = computed(() => {
      if (props.variant === 'pill') {
        return 'rounded-full'
      }
      return 'rounded-lg'
    })
    
    // Objets de configuration des statuts
    const statusConfig = {
      pending: {
        text: 'En attente',
        icon: 'far fa-clock',
        bg: 'bg-gradient-to-r from-warning-light to-warning-lighter',
        textColor: 'text-warning-dark',
        border: 'border border-warning-border',
        pulse: 'bg-warning-pulse',
        organicColor: '#F57F17'
      },
      confirmed: {
        text: 'Confirmée',
        icon: 'fas fa-check-circle',
        bg: 'bg-gradient-to-r from-confirmed-light to-confirmed-lighter',
        textColor: 'text-confirmed-dark',
        border: 'border border-confirmed-border',
        pulse: '',
        organicColor: '#4CAF50'
      },
      preparing: {
        text: 'En préparation',
        icon: 'fas fa-utensils',
        bg: 'bg-gradient-to-r from-preparing-light to-preparing-lighter',
        textColor: 'text-preparing-dark',
        border: 'border border-preparing-border',
        pulse: 'bg-preparing-pulse',
        organicColor: '#2196F3'
      },
      ready: {
        text: 'Prête',
        icon: 'fas fa-box',
        bg: 'bg-gradient-to-r from-ready-light to-ready-lighter',
        textColor: 'text-ready-dark',
        border: 'border border-ready-border',
        pulse: '',
        organicColor: '#00BCD4'
      },
      shipped: {
        text: 'Expédiée',
        icon: 'fas fa-shipping-fast',
        bg: 'bg-gradient-to-r from-shipped-light to-shipped-lighter',
        textColor: 'text-shipped-dark',
        border: 'border border-shipped-border',
        pulse: 'bg-shipped-pulse',
        organicColor: '#673AB7'
      },
      delivered: {
        text: 'Livrée',
        icon: 'fas fa-check-double',
        bg: 'bg-gradient-to-r from-delivered-light to-delivered-lighter',
        textColor: 'text-delivered-dark',
        border: 'border border-delivered-border',
        pulse: '',
        organicColor: '#2E7D32'
      },
      cancelled: {
        text: 'Annulée',
        icon: 'fas fa-times-circle',
        bg: 'bg-gradient-to-r from-cancelled-light to-cancelled-lighter',
        textColor: 'text-cancelled-dark',
        border: 'border border-cancelled-border',
        pulse: '',
        organicColor: '#C62828'
      },
      refunded: {
        text: 'Remboursée',
        icon: 'fas fa-undo',
        bg: 'bg-gradient-to-r from-refunded-light to-refunded-lighter',
        textColor: 'text-refunded-dark',
        border: 'border border-refunded-border',
        pulse: '',
        organicColor: '#607D8B'
      },
      'on-hold': {
        text: 'En attente',
        icon: 'fas fa-pause-circle',
        bg: 'bg-gradient-to-r from-onhold-light to-onhold-lighter',
        textColor: 'text-onhold-dark',
        border: 'border border-onhold-border',
        pulse: 'bg-onhold-pulse',
        organicColor: '#FF9800'
      },
      failed: {
        text: 'Échouée',
        icon: 'fas fa-exclamation-triangle',
        bg: 'bg-gradient-to-r from-failed-light to-failed-lighter',
        textColor: 'text-failed-dark',
        border: 'border border-failed-border',
        pulse: '',
        organicColor: '#D32F2F'
      }
    }
    
    // Obtenir les classes CSS pour un statut
    const getStatusClasses = (status) => {
      const config = statusConfig[status] || statusConfig.pending
      const classes = [config.bg, config.textColor]
      
      if (props.variant === 'outline') {
        return [
          'bg-transparent',
          config.textColor,
          config.border,
          'border-2'
        ]
      } else if (props.variant === 'soft') {
        return [
          config.bg.replace('to-', 'to-opacity-30'),
          config.textColor,
          'backdrop-blur-sm'
        ]
      }
      
      return classes
    }
    
    // Obtenir la classe d'icône
    const getIconClass = (status) => {
      return statusConfig[status]?.icon || statusConfig.pending.icon
    }
    
    // Obtenir le texte du statut
    const getStatusText = (status) => {
      return statusConfig[status]?.text || statusConfig.pending.text
    }
    
    // Obtenir la classe de pulse
    const getPulseClass = (status) => {
      return statusConfig[status]?.pulse || ''
    }
    
    // Obtenir l'animation de pulse
    const getPulseAnimation = (status) => {
      const animations = {
        pending: 'pulse-warning 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        preparing: 'pulse-preparing 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shipped: 'pulse-shipped 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'on-hold': 'pulse-onhold 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
      return animations[status] || 'none'
    }
    
    // Obtenir la couleur de l'élément organique
    const getOrganicColor = (status) => {
      return statusConfig[status]?.organicColor || statusConfig.pending.organicColor
    }
    
    // Gérer le clic
    const handleClick = () => {
      if (props.clickable) {
        emit('click', props.status)
      }
    }
    
    return {
      sizeClasses,
      roundedClasses,
      getStatusClasses,
      getIconClass,
      getStatusText,
      getPulseClass,
      getPulseAnimation,
      getOrganicColor,
      handleClick
    }
  }
}
</script>

<style scoped>
.order-status-badge {
  position: relative;
  overflow: hidden;
  transition-property: all;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.order-status-badge:hover {
  transform: translateY(-1px);
}

/* Animations de pulse */
@keyframes pulse-warning {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.05);
  }
}

@keyframes pulse-preparing {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.03);
  }
}

@keyframes pulse-shipped {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.2;
    transform: scale(1.02);
  }
}

@keyframes pulse-onhold {
  0%, 100% {
    opacity: 0.75;
    transform: scale(1);
  }
  50% {
    opacity: 0.35;
    transform: scale(1.04);
  }
}

/* Animation de rebond pour l'icône */
@keyframes soft-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.animate-soft-bounce {
  animation: soft-bounce 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* Classes de couleurs personnalisées */
:deep() {
  /* Statut: En attente */
  .bg-warning-light { background-color: #FFF3E0; }
  .bg-warning-lighter { background-color: #FFE0B2; }
  .text-warning-dark { color: #F57F17; }
  .border-warning-border { border-color: #FFB74D; }
  .bg-warning-pulse { background-color: #FF9800; }
  
  /* Statut: Confirmée */
  .bg-confirmed-light { background-color: #E8F5E9; }
  .bg-confirmed-lighter { background-color: #C8E6C9; }
  .text-confirmed-dark { color: #2E7D32; }
  .border-confirmed-border { border-color: #81C784; }
  
  /* Statut: En préparation */
  .bg-preparing-light { background-color: #E3F2FD; }
  .bg-preparing-lighter { background-color: #BBDEFB; }
  .text-preparing-dark { color: #1565C0; }
  .border-preparing-border { border-color: #64B5F6; }
  .bg-preparing-pulse { background-color: #2196F3; }
  
  /* Statut: Prête */
  .bg-ready-light { background-color: #E0F7FA; }
  .bg-ready-lighter { background-color: #B2EBF2; }
  .text-ready-dark { color: #00838F; }
  .border-ready-border { border-color: #4DD0E1; }
  
  /* Statut: Expédiée */
  .bg-shipped-light { background-color: #F3E5F5; }
  .bg-shipped-lighter { background-color: #E1BEE7; }
  .text-shipped-dark { color: #7B1FA2; }
  .border-shipped-border { border-color: #BA68C8; }
  .bg-shipped-pulse { background-color: #9C27B0; }
  
  /* Statut: Livrée */
  .bg-delivered-light { background-color: #E8F5E9; }
  .bg-delivered-lighter { background-color: #C8E6C9; }
  .text-delivered-dark { color: #1B5E20; }
  .border-delivered-border { border-color: #66BB6A; }
  
  /* Statut: Annulée */
  .bg-cancelled-light { background-color: #FFEBEE; }
  .bg-cancelled-lighter { background-color: #FFCDD2; }
  .text-cancelled-dark { color: #C62828; }
  .border-cancelled-border { border-color: #EF9A9A; }
  
  /* Statut: Remboursée */
  .bg-refunded-light { background-color: #F5F5F5; }
  .bg-refunded-lighter { background-color: #EEEEEE; }
  .text-refunded-dark { color: #424242; }
  .border-refunded-border { border-color: #BDBDBD; }
  
  /* Statut: En attente (on-hold) */
  .bg-onhold-light { background-color: #FFF3E0; }
  .bg-onhold-lighter { background-color: #FFE0B2; }
  .text-onhold-dark { color: #EF6C00; }
  .border-onhold-border { border-color: #FFB74D; }
  .bg-onhold-pulse { background-color: #FF9800; }
  
  /* Statut: Échouée */
  .bg-failed-light { background-color: #FFEBEE; }
  .bg-failed-lighter { background-color: #FFCDD2; }
  .text-failed-dark { color: #D32F2F; }
  .border-failed-border { border-color: #EF9A9A; }
}
</style>
