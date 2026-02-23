<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Overlay avec flou -->
        <div class="absolute inset-0 bg-nature-900/40 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal -->
        <div
            class="relative w-full max-w-2xl bg-gradient-to-br from-white to-nature-50/90 rounded-2xl shadow-2xl border border-nature-200/50 overflow-hidden">
            <!-- En-tête -->
            <div class="p-6 border-b border-nature-200/50">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-nature-900">
                            Ajouter un moyen de paiement
                        </h2>
                        <p class="text-nature-600 mt-1">
                            Choisissez votre méthode de paiement préférée
                        </p>
                    </div>
                    <button @click="$emit('close')"
                        class="p-2 rounded-lg hover:bg-nature-100/50 transition-all duration-300 hover:rotate-90">
                        <XMarkIcon class="w-6 h-6 text-nature-500" />
                    </button>
                </div>
            </div>

            <!-- Contenu -->
            <div class="p-6">
                <!-- Sélection du type -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-nature-800 mb-4">
                        Type de paiement
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <button v-for="option in paymentOptions" :key="option.type" @click="selectedType = option.type"
                            :class="[
                                'p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105',
                                selectedType === option.type
                                    ? 'border-primary-500 bg-primary-50/50 shadow-lg'
                                    : 'border-nature-200/50 hover:border-primary-300/50'
                            ]">
                            <div class="flex flex-col items-center space-y-3">
                                <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                                    :class="option.iconBg">
                                    <component :is="option.icon" class="w-6 h-6" :class="option.iconColor" />
                                </div>
                                <span class="font-medium text-nature-800">{{ option.name }}</span>
                                <span class="text-xs text-nature-500">{{ option.description }}</span>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Formulaire dynamique -->
                <div v-if="selectedType" class="space-y-6">
                    <!-- Mobile Money -->
                    <div v-if="selectedType.includes('mobile')" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-nature-700 mb-2">
                                Numéro de téléphone
                            </label>
                            <input v-model="formData.phone" type="tel" placeholder="6xx xxx xxx"
                                class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300" />
                            <p class="text-sm text-nature-500 mt-2">
                                Entrez votre numéro {{ selectedType === 'mtn_mobile_money' ? 'MTN' : 'Orange' }} Mobile
                                Money
                            </p>
                        </div>
                    </div>

                    <!-- Carte bancaire -->
                    <div v-else-if="selectedType === 'card'" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-nature-700 mb-2">
                                Numéro de carte
                            </label>
                            <input v-model="formData.cardNumber" type="text" placeholder="4242 4242 4242 4242"
                                class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-nature-700 mb-2">
                                    Date d'expiration
                                </label>
                                <input v-model="formData.expiry" type="text" placeholder="MM/AA"
                                    class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-nature-700 mb-2">
                                    CVV
                                </label>
                                <input v-model="formData.cvv" type="text" placeholder="123"
                                    class="w-full px-4 py-3 rounded-xl border border-nature-300/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300" />
                            </div>
                        </div>
                    </div>

                    <!-- Définir comme défaut -->
                    <div class="flex items-center space-x-3">
                        <input id="default" v-model="formData.isDefault" type="checkbox"
                            class="w-5 h-5 rounded border-nature-300 text-primary-600 focus:ring-primary-500" />
                        <label for="default" class="text-sm text-nature-700">
                            Définir comme moyen de paiement par défaut
                        </label>
                    </div>
                </div>
            </div>

            <!-- Pied de page -->
            <div class="p-6 border-t border-nature-200/50 bg-gradient-to-r from-nature-50/50 to-white/50">
                <div class="flex justify-end space-x-4">
                    <button @click="$emit('close')"
                        class="px-6 py-3 rounded-xl border border-nature-300 text-nature-700 hover:bg-nature-50 transition-all duration-300">
                        Annuler
                    </button>
                    <button @click="addMethod" :disabled="!selectedType" :class="[
                        'px-6 py-3 rounded-xl font-medium text-white transition-all duration-300',
                        selectedType
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg hover:scale-105'
                            : 'bg-nature-300 cursor-not-allowed'
                    ]">
                        Ajouter le moyen de paiement
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
    XMarkIcon,
    CreditCardIcon,
    DevicePhoneMobileIcon,
    BanknotesIcon
} from '@heroicons/vue/24/outline'
import type { PaymentMethod } from '@/modules/payments/types/payment.types'

const emit = defineEmits<{
    close: []
    added: [method: PaymentMethod]
}>()

const selectedType = ref<string>('')
const formData = ref({
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    isDefault: false
})

const paymentOptions = [
    {
        type: 'mtn_mobile_money',
        name: 'MTN Mobile Money',
        description: 'Paiement instantané',
        icon: DevicePhoneMobileIcon,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
    },
    {
        type: 'orange_money',
        name: 'Orange Money',
        description: 'Paiement instantané',
        icon: DevicePhoneMobileIcon,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
    },
    {
        type: 'card',
        name: 'Carte bancaire',
        description: 'Visa, Mastercard',
        icon: CreditCardIcon,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    {
        type: 'express_union',
        name: 'Express Union',
        description: 'Mobile Banking',
        icon: DevicePhoneMobileIcon,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
    }
]

const addMethod = () => {
    if (!selectedType.value) return

    const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: selectedType.value as any,
        phone_number: formData.value.phone || undefined,
        last4: formData.value.cardNumber ? formData.value.cardNumber.slice(-4) : undefined,
        is_default: formData.value.isDefault,
        status: 'active',
        network: selectedType.value === 'mtn_mobile_money' ? 'mtn' :
            selectedType.value === 'orange_money' ? 'orange' : undefined,
        brand: selectedType.value === 'mtn_mobile_money' ? 'MTN Cameroon' :
            selectedType.value === 'orange_money' ? 'Orange Cameroun' : 'Visa'
    }

    emit('added', newMethod)
}
</script>