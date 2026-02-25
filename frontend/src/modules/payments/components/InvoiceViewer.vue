<template>
    <div
        class="invoice-viewer min-h-screen bg-gradient-to-br from-primary-50/20 via-white to-nature-50/30 overflow-hidden">
        <!-- Texture de fond organique -->
        <div class="absolute inset-0 opacity-[0.02] pointer-events-none" :style="{
            backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
          <svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'>
                <path d='M 20 0 L 0 0 0 20' fill='none' stroke='%2300a896' stroke-width='0.5' opacity='0.1'/>
              </pattern>
            </defs>
            <rect width='100' height='100' fill='url(%23grid)'/>
            <path d='M30,40 Q50,20 70,40 T110,40' stroke='%2300a896' fill='none' stroke-width='0.3' opacity='0.05'/>
            <path d='M20,60 Q50,80 80,60' stroke='%2300a896' fill='none' stroke-width='0.3' opacity='0.05'/>
          </svg>
        `)}')`
        }"></div>

        <!-- Éléments décoratifs flottants -->
        <div class="absolute top-20 left-5% w-48 h-48 leaf-float opacity-10">
            <div class="w-full h-full bg-primary-300/20 rounded-full blur-3xl"></div>
        </div>
        <div class="absolute bottom-20 right-5% w-64 h-64 leaf-float opacity-10" style="animation-delay: 3s;">
            <div class="w-full h-full bg-nature-400/20 rounded-full blur-3xl"></div>
        </div>

        <!-- Conteneur principal -->
        <div class="container mx-auto px-4 py-8 relative z-10">
            <div v-if="loading" class="mb-4 text-sm text-nature-600">Chargement de la facture...</div>
            <!-- En-tête avec navigation -->
            <Transition appear enter-active-class="transition-all duration-700 custom-bezier"
                enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div class="mb-6 lg:mb-0">
                        <button @click="goBack"
                            class="group inline-flex items-center text-nature-600 hover:text-primary-600 transition-all duration-300 mb-4">
                            <ArrowLeftIcon
                                class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Retour aux factures
                        </button>
                        <div>
                            <h1 class="text-3xl lg:text-4xl font-bold text-nature-900 mb-2">
                                <span
                                    class="bg-gradient-to-r from-primary-600 to-nature-600 bg-clip-text text-transparent">
                                    Facture #{{ invoice.invoice_number }}
                                </span>
                            </h1>
                            <p class="text-nature-600">
                                Émise le {{ formatDate(invoice.issue_date) }}
                                <span v-if="invoice.due_date" class="ml-3">
                                    • Échéance : {{ formatDate(invoice.due_date) }}
                                </span>
                            </p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-wrap gap-3">
                        <button @click="downloadInvoice"
                            class="group relative overflow-hidden px-5 py-2.5 rounded-xl border border-primary-300 bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 font-medium transition-all duration-300 hover:shadow-lg hover:scale-105">
                            <div class="relative flex items-center">
                                <ArrowDownTrayIcon class="w-5 h-5 mr-2 group-hover:animate-bounce" />
                                Télécharger PDF
                            </div>
                        </button>
                        <button @click="shareInvoice"
                            class="group relative overflow-hidden px-5 py-2.5 rounded-xl border border-nature-300 bg-gradient-to-r from-white to-nature-50 text-nature-700 font-medium transition-all duration-300 hover:shadow-lg hover:scale-105">
                            <div class="relative flex items-center">
                                <ShareIcon
                                    class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                Partager
                            </div>
                        </button>
                        <button @click="printInvoice"
                            class="group relative overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105">
                            <div class="relative flex items-center">
                                <PrinterIcon
                                    class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                Imprimer
                            </div>
                        </button>
                    </div>
                </div>
            </Transition>

            <!-- Contenu principal -->
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Panneau de visualisation de la facture -->
                <Transition appear enter-active-class="transition-all duration-800 custom-bezier"
                    enter-from-class="opacity-0 -translate-x-8" enter-to-class="opacity-100 translate-x-0">
                    <div class="lg:w-2/3">
                        <!-- Carte de la facture -->
                        <div
                            class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-nature-200/50 overflow-hidden">
                            <!-- En-tête de la facture -->
                            <div class="p-8 border-b border-nature-200/50 bg-gradient-to-r from-white to-primary-50/30">
                                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                    <!-- Logo et info entreprise -->
                                    <div class="mb-8 lg:mb-0">
                                        <div class="flex items-center space-x-4 mb-6">
                                            <div
                                                class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                                <CheckCircleIcon class="w-6 h-6 text-primary-600" />
                                            </div>
                                            <div>
                                                <h2 class="text-2xl font-bold text-nature-900">FreshMarket</h2>
                                                <p class="text-nature-600">Vos produits frais, directement du producteur
                                                </p>
                                            </div>
                                        </div>
                                        <div class="space-y-2 text-sm text-nature-600">
                                            <p>Douala, Cameroun</p>
                                            <p>contact@freshmarket.cm</p>
                                            <p>+237 6XX XXX XXX</p>
                                            <p>SIRET: XXXX XXX XXX</p>
                                        </div>
                                    </div>

                                    <!-- Badge de statut -->
                                    <div class="self-start">
                                        <div class="inline-flex items-center px-4 py-2 rounded-full border font-medium shadow-sm"
                                            :class="getStatusClass(invoice.status)">
                                            <span class="w-2 h-2 rounded-full mr-2 animate-pulse"
                                                :class="getStatusPulseClass(invoice.status)"></span>
                                            {{ formatStatus(invoice.status) }}
                                        </div>
                                        <div class="text-right mt-4">
                                            <h3 class="text-lg font-bold text-nature-900">FACTURE</h3>
                                            <p class="text-nature-600">N° {{ invoice.invoice_number }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Corps de la facture -->
                            <div class="p-8">
                                <!-- Informations client et dates -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                    <div>
                                        <h4 class="text-sm font-semibold text-nature-500 uppercase tracking-wider mb-4">
                                            Facturé à
                                        </h4>
                                        <div
                                            class="p-4 rounded-xl bg-gradient-to-br from-nature-50/50 to-white border border-nature-200/30">
                                            <p class="font-bold text-nature-900">{{ invoice.customer_name }}</p>
                                            <p class="text-nature-600 mt-1">{{ invoice.customer_address }}</p>
                                            <p class="text-nature-600">{{ invoice.customer_email }}</p>
                                            <p class="text-nature-600">{{ invoice.customer_phone }}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="text-sm font-semibold text-nature-500 uppercase tracking-wider mb-4">
                                            Détails de la facture
                                        </h4>
                                        <div class="space-y-3">
                                            <div class="flex justify-between">
                                                <span class="text-nature-600">Date d'émission</span>
                                                <span class="font-medium text-nature-900">{{
                                                    formatDate(invoice.issue_date) }}</span>
                                            </div>
                                            <div v-if="invoice.due_date" class="flex justify-between">
                                                <span class="text-nature-600">Date d'échéance</span>
                                                <span class="font-medium text-nature-900">{{
                                                    formatDate(invoice.due_date) }}</span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-nature-600">Référence commande</span>
                                                <span class="font-medium text-nature-900">CMD-{{ invoice.order_id
                                                    }}</span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-nature-600">Mode de paiement</span>
                                                <span class="font-medium text-nature-900">{{ invoice.payment_method
                                                    }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tableau des articles -->
                                <div class="mb-10">
                                    <h4 class="text-sm font-semibold text-nature-500 uppercase tracking-wider mb-4">
                                        Articles
                                    </h4>
                                    <div class="rounded-xl overflow-hidden border border-nature-200/50">
                                        <!-- En-tête du tableau -->
                                        <div
                                            class="grid grid-cols-12 bg-gradient-to-r from-nature-50/50 to-nature-100/30 p-4 border-b border-nature-200/50">
                                            <div class="col-span-6 lg:col-span-5">
                                                <span class="text-sm font-medium text-nature-700">Description</span>
                                            </div>
                                            <div class="col-span-3 lg:col-span-2 text-center">
                                                <span class="text-sm font-medium text-nature-700">Quantité</span>
                                            </div>
                                            <div class="col-span-3 lg:col-span-2 text-center">
                                                <span class="text-sm font-medium text-nature-700">Prix unitaire</span>
                                            </div>
                                            <div class="col-span-3 lg:col-span-3 text-right">
                                                <span class="text-sm font-medium text-nature-700">Total</span>
                                            </div>
                                        </div>

                                        <!-- Lignes des articles -->
                                        <TransitionGroup tag="div" name="items">
                                            <div v-for="(item, index) in invoice.items" :key="item.id"
                                                class="grid grid-cols-12 p-4 border-b border-nature-200/30 hover:bg-nature-50/30 transition-colors duration-300"
                                                :style="{ animationDelay: `${index * 100}ms` }">
                                                <div class="col-span-6 lg:col-span-5">
                                                    <div class="flex items-center space-x-3">
                                                        <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img :src="item.image || ''"
                                                                :alt="item.name" class="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p class="font-medium text-nature-900">{{ item.name }}</p>
                                                            <p class="text-sm text-nature-500">{{ item.description }}
                                                            </p>
                                                            <div v-if="item.category" class="inline-block mt-1">
                                                                <span
                                                                    class="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-emerald-100/50 to-green-100/50 text-emerald-800 border border-emerald-200/50">
                                                                    {{ item.category }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-span-3 lg:col-span-2 text-center">
                                                    <span class="text-nature-700">{{ item.quantity }}</span>
                                                </div>
                                                <div class="col-span-3 lg:col-span-2 text-center">
                                                    <span class="text-nature-700">{{ formatCurrency(item.unit_price)
                                                        }}</span>
                                                </div>
                                                <div class="col-span-3 lg:col-span-3 text-right">
                                                    <span class="font-medium text-nature-900">{{
                                                        formatCurrency(item.total) }}</span>
                                                </div>
                                            </div>
                                        </TransitionGroup>
                                    </div>
                                </div>

                                <!-- Totaux -->
                                <div class="flex justify-end">
                                    <div class="w-full lg:w-2/3 xl:w-1/2 space-y-4">
                                        <div class="flex justify-between text-nature-600">
                                            <span>Sous-total</span>
                                            <span class="font-medium">{{ formatCurrency(invoice.subtotal) }}</span>
                                        </div>
                                        <div v-if="invoice.discount > 0" class="flex justify-between text-green-600">
                                            <span>Réduction</span>
                                            <span class="font-medium">-{{ formatCurrency(invoice.discount) }}</span>
                                        </div>
                                        <div v-if="invoice.tax_amount > 0" class="flex justify-between text-nature-600">
                                            <span>TVA ({{ invoice.tax_rate || 19.25 }}%)</span>
                                            <span class="font-medium">{{ formatCurrency(invoice.tax_amount) }}</span>
                                        </div>
                                        <div v-if="invoice.shipping > 0" class="flex justify-between text-nature-600">
                                            <span>Frais de livraison</span>
                                            <span class="font-medium">{{ formatCurrency(invoice.shipping) }}</span>
                                        </div>
                                        <div
                                            class="flex justify-between text-xl font-bold text-nature-900 pt-4 border-t border-nature-300">
                                            <span>Total</span>
                                            <span class="text-primary-600">{{ formatCurrency(invoice.total) }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Notes et mentions légales -->
                                <div class="mt-10 pt-6 border-t border-nature-200/50">
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <h5 class="text-sm font-semibold text-nature-700 mb-2">Notes</h5>
                                            <p class="text-sm text-nature-600">
                                                {{ invoice.notes || 'Merci pour votre commande. Les produits sont garantis frais et de qualité supérieure.' }}
                                            </p>
                                        </div>
                                        <div>
                                            <h5 class="text-sm font-semibold text-nature-700 mb-2">Mentions légales</h5>
                                            <ul class="text-xs text-nature-500 space-y-1">
                                                <li>• TVA non applicable, article 293 B du CGI</li>
                                                <li>• Facture payable sous 30 jours</li>
                                                <li>• Paiement par virement, Mobile Money ou carte bancaire</li>
                                                <li>• Paiement en retard: pénalité de 3 fois le taux d'intérêt légal
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Pied de page de la facture -->
                            <div
                                class="p-6 border-t border-nature-200/50 bg-gradient-to-r from-nature-50/30 to-white/30">
                                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div class="flex items-center space-x-4 mb-4 lg:mb-0">
                                        <div
                                            class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                                            <ShieldCheckIcon class="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-nature-900">Facture sécurisée</p>
                                            <p class="text-xs text-nature-500">Document certifié et horodaté</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-6 text-sm text-nature-600">
                                        <span>ID: {{ invoice.id }}</span>
                                        <span>Généré le {{ new Date().toLocaleDateString('fr-CM') }}</span>
                                        <span>Page 1/1</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- QR Code pour paiement rapide -->
                        <Transition appear enter-active-class="transition-all duration-500 custom-bezier delay-300"
                            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
                            <div v-if="invoice.status === 'sent' || invoice.status === 'pending'"
                                class="mt-6 p-6 rounded-2xl bg-gradient-to-br from-primary-50/50 to-emerald-50/50 border border-primary-200/30">
                                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div class="mb-4 lg:mb-0">
                                        <h4 class="text-lg font-semibold text-nature-900 mb-2">
                                            Payer rapidement avec Mobile Money
                                        </h4>
                                        <p class="text-nature-600">
                                            Scannez le QR code avec votre application MTN ou Orange Money
                                        </p>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <div
                                            class="w-32 h-32 bg-white p-3 rounded-xl shadow-lg border border-nature-200/50">
                                            <!-- Placeholder pour QR Code -->
                                            <div
                                                class="w-full h-full bg-gradient-to-br from-nature-100 to-nature-200 rounded flex items-center justify-center">
                                                <QrCodeIcon class="w-12 h-12 text-nature-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </Transition>

                <!-- Panneau latéral d'informations -->
                <Transition appear enter-active-class="transition-all duration-800 custom-bezier delay-200"
                    enter-from-class="opacity-0 translate-x-8" enter-to-class="opacity-100 translate-x-0">
                    <div class="lg:w-1/3">
                        <div class="sticky top-8 space-y-6">
                            <!-- Résumé de la facture -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-primary-50/30 border border-primary-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                    <DocumentTextIcon class="w-5 h-5 text-primary-600 mr-2" />
                                    Résumé
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Numéro</span>
                                        <span class="font-bold text-nature-900">{{ invoice.invoice_number }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Statut</span>
                                        <span :class="getStatusTextClass(invoice.status)" class="font-medium">
                                            {{ formatStatus(invoice.status) }}
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Client</span>
                                        <span class="font-medium text-nature-900 truncate ml-2 max-w-[150px]">
                                            {{ invoice.customer_name }}
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Date d'émission</span>
                                        <span class="font-medium text-nature-900">{{ formatDate(invoice.issue_date)
                                            }}</span>
                                    </div>
                                    <div v-if="invoice.due_date" class="flex justify-between">
                                        <span class="text-nature-600">Échéance</span>
                                        <span class="font-medium text-nature-900">{{ formatDate(invoice.due_date)
                                            }}</span>
                                    </div>
                                    <div class="pt-4 border-t border-nature-200/50">
                                        <div class="flex justify-between text-lg font-bold">
                                            <span class="text-nature-900">Total</span>
                                            <span class="text-primary-600">{{ formatCurrency(invoice.total) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Paiement -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-emerald-50/30 border border-emerald-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                    <CreditCardIcon class="w-5 h-5 text-emerald-600 mr-2" />
                                    Paiement
                                </h3>
                                <div class="space-y-4">
                                    <div class="flex justify-between">
                                        <span class="text-nature-600">Méthode</span>
                                        <span class="font-medium text-nature-900">{{ invoice.payment_method }}</span>
                                    </div>
                                    <div v-if="invoice.payment_date" class="flex justify-between">
                                        <span class="text-nature-600">Date de paiement</span>
                                        <span class="font-medium text-nature-900">{{ formatDate(invoice.payment_date)
                                            }}</span>
                                    </div>
                                    <div v-if="invoice.transaction_id" class="flex justify-between">
                                        <span class="text-nature-600">Transaction ID</span>
                                        <span class="font-mono text-sm text-nature-900 truncate max-w-[150px]">
                                            {{ invoice.transaction_id }}
                                        </span>
                                    </div>
                                    <div v-if="invoice.status === 'paid'"
                                        class="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm">
                                        <CheckCircleIcon class="w-4 h-4 mr-1.5" />
                                        Paiement confirmé
                                    </div>
                                    <div v-if="invoice.status === 'sent' || invoice.status === 'pending'"
                                        class="space-y-3">
                                        <button @click="payInvoice"
                                            class="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                            Payer maintenant
                                        </button>
                                        <button @click="showPaymentOptions = true"
                                            class="w-full py-3 rounded-xl border border-primary-300 text-primary-700 font-medium hover:bg-primary-50 transition-all duration-300">
                                            Autres options de paiement
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions rapides -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-nature-50/30 border border-nature-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                    <BoltIcon class="w-5 h-5 text-nature-600 mr-2" />
                                    Actions rapides
                                </h3>
                                <div class="space-y-3">
                                    <button @click="sendReminder"
                                        class="w-full flex items-center justify-between p-3 rounded-lg border border-nature-200 text-nature-700 hover:bg-nature-50 transition-all duration-300 group">
                                        <div class="flex items-center">
                                            <EnvelopeIcon class="w-5 h-5 mr-3 text-nature-500" />
                                            <span>Envoyer un rappel</span>
                                        </div>
                                        <ArrowRightIcon
                                            class="w-4 h-4 text-nature-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                    <button @click="duplicateInvoice"
                                        class="w-full flex items-center justify-between p-3 rounded-lg border border-nature-200 text-nature-700 hover:bg-nature-50 transition-all duration-300 group">
                                        <div class="flex items-center">
                                            <DocumentDuplicateIcon class="w-5 h-5 mr-3 text-nature-500" />
                                            <span>Dupliquer la facture</span>
                                        </div>
                                        <ArrowRightIcon
                                            class="w-4 h-4 text-nature-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                    <button v-if="invoice.status === 'paid'" @click="requestRefund"
                                        class="w-full flex items-center justify-between p-3 rounded-lg border border-orange-200 text-orange-700 hover:bg-orange-50 transition-all duration-300 group">
                                        <div class="flex items-center">
                                            <ArrowPathIcon class="w-5 h-5 mr-3 text-orange-500" />
                                            <span>Demander un remboursement</span>
                                        </div>
                                        <ArrowRightIcon
                                            class="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>

                            <!-- Support -->
                            <div
                                class="rounded-2xl p-6 bg-gradient-to-br from-white/90 to-blue-50/30 border border-blue-200/30 backdrop-blur-sm">
                                <h3 class="text-lg font-semibold text-nature-900 mb-4 flex items-center">
                                    <QuestionMarkCircleIcon class="w-5 h-5 text-blue-600 mr-2" />
                                    Besoin d'aide ?
                                </h3>
                                <p class="text-sm text-nature-600 mb-4">
                                    Une question sur cette facture ? Notre équipe est là pour vous aider.
                                </p>
                                <div class="space-y-3">
                                    <button @click="contactSupport"
                                        class="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                                        <PhoneIcon class="w-5 h-5 mr-2" />
                                        Contacter le support
                                    </button>
                                    <button @click="openFAQ"
                                        class="w-full p-3 rounded-xl border border-blue-300 text-blue-700 font-medium hover:bg-blue-50 transition-all duration-300">
                                        Consulter la FAQ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- Modal des options de paiement -->
        <Transition enter-active-class="transition-all duration-500 custom-bezier" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <PaymentOptionsModal v-if="showPaymentOptions" :invoice="invoice" @close="showPaymentOptions = false"
                @paid="handleInvoicePaid" />
        </Transition>

        <!-- Toast de notification -->
        <Transition enter-active-class="transition-all duration-500 custom-bezier"
            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="toast.show" :class="[
                'fixed bottom-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl max-w-sm backdrop-blur-sm border',
                toast.type === 'success'
                    ? 'bg-gradient-to-r from-emerald-50/90 to-green-50/90 border-emerald-200/50'
                    : 'bg-gradient-to-r from-blue-50/90 to-blue-50/90 border-blue-200/50'
            ]">
                <div class="flex items-center space-x-3">
                    <component :is="toast.icon" class="w-6 h-6"
                        :class="toast.type === 'success' ? 'text-emerald-600' : 'text-blue-600'" />
                    <div>
                        <p class="font-medium text-nature-900">{{ toast.message }}</p>
                        <p class="text-sm text-nature-600 mt-1">{{ toast.details }}</p>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaymentOptionsModal from './PaymentOptionsModal.vue'
import invoiceService from '../services/invoiceService'
import {
    ArrowLeftIcon,
    ArrowDownTrayIcon,
    ShareIcon,
    PrinterIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    CreditCardIcon,
    CheckCircleIcon,
    QrCodeIcon,
    BoltIcon,
    EnvelopeIcon,
    DocumentDuplicateIcon,
    ArrowPathIcon,
    QuestionMarkCircleIcon,
    PhoneIcon,
    ArrowRightIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

// Props avec données par défaut
interface InvoiceItem {
    id: string
    name: string
    description: string
    quantity: number
    unit_price: number
    total: number
    image?: string
    category?: string
}

interface Invoice {
    id: string
    invoice_number: string
    order_id: string
    issue_date: string
    due_date?: string
    payment_date?: string
    status: 'draft' | 'sent' | 'paid' | 'overdue'
    subtotal: number
    discount: number
    tax_amount: number
    tax_rate?: number
    shipping: number
    total: number
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_address: string
    payment_method: string
    transaction_id?: string
    notes?: string
    items: InvoiceItem[]
}

const invoice = ref<Invoice>({
    id: '',
    invoice_number: '',
    order_id: '',
    issue_date: new Date().toISOString(),
    status: 'draft',
    subtotal: 0,
    discount: 0,
    tax_amount: 0,
    shipping: 0,
    total: 0,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    payment_method: '',
    items: []
})
const loading = ref(true)

// État
const showPaymentOptions = ref(false)
const toast = ref({
    show: false,
    type: 'success' as 'success' | 'info',
    message: '',
    details: '',
    icon: CheckCircleIcon
})

const normalizeInvoiceStatus = (status: unknown): Invoice['status'] => {
    const normalized = String(status || '').toLowerCase()
    if (normalized === 'draft') return 'draft'
    if (normalized === 'paid' || normalized === 'completed') return 'paid'
    if (normalized === 'overdue' || normalized === 'late') return 'overdue'
    return 'sent'
}

const mapBackendInvoice = (raw: any): Invoice => {
    const items = Array.isArray(raw?.items) ? raw.items : []
    const subtotal = Number(raw?.subtotal ?? raw?.subTotal ?? 0)
    const taxAmount = Number(raw?.tax_amount ?? raw?.taxAmount ?? 0)
    const discount = Number(raw?.discount ?? raw?.discount_amount ?? raw?.discountAmount ?? 0)
    const shipping = Number(raw?.shipping ?? raw?.shipping_amount ?? raw?.deliveryFee ?? 0)
    const total = Number(raw?.total ?? raw?.total_amount ?? raw?.totalAmount ?? subtotal + taxAmount + shipping - discount)

    return {
        id: String(raw?.id ?? ''),
        invoice_number: String(raw?.invoice_number ?? raw?.invoiceNumber ?? ''),
        order_id: String(raw?.order_id ?? raw?.orderId ?? ''),
        issue_date: String(raw?.issue_date ?? raw?.issueDate ?? raw?.created_at ?? raw?.createdAt ?? new Date().toISOString()),
        due_date: raw?.due_date ?? raw?.dueDate,
        payment_date: raw?.payment_date ?? raw?.paidAt,
        status: normalizeInvoiceStatus(raw?.status),
        subtotal,
        discount,
        tax_amount: taxAmount,
        tax_rate: Number(raw?.tax_rate ?? raw?.taxRate ?? 0) || undefined,
        shipping,
        total,
        customer_name: String(raw?.customer_name ?? raw?.customerName ?? raw?.customer?.name ?? 'Client'),
        customer_email: String(raw?.customer_email ?? raw?.customerEmail ?? raw?.customer?.email ?? ''),
        customer_phone: String(raw?.customer_phone ?? raw?.customerPhone ?? raw?.customer?.phone ?? ''),
        customer_address: String(raw?.customer_address ?? raw?.customerAddress?.street ?? raw?.customer?.address ?? ''),
        payment_method: String(raw?.payment_method ?? raw?.paymentMethod ?? 'Non renseigné'),
        transaction_id: raw?.transaction_id ?? raw?.transactionId,
        notes: Array.isArray(raw?.notes) ? raw.notes.join(' ') : raw?.notes,
        items: items.map((item: any) => ({
            id: String(item?.id ?? ''),
            name: String(item?.name ?? item?.productName ?? item?.description ?? 'Produit'),
            description: String(item?.description ?? item?.name ?? item?.productName ?? ''),
            quantity: Number(item?.quantity ?? 0),
            unit_price: Number(item?.unit_price ?? item?.unitPrice ?? 0),
            total: Number(item?.total ?? item?.totalPrice ?? (Number(item?.quantity ?? 0) * Number(item?.unit_price ?? item?.unitPrice ?? 0))),
            image: item?.image,
            category: item?.category
        }))
    }
}

const loadInvoice = async () => {
    const invoiceId = String(route.params.id || '')
    if (!invoiceId) {
        loading.value = false
        return
    }

    loading.value = true
    try {
        const rawInvoice = await invoiceService.getInvoice(invoiceId)
        invoice.value = mapBackendInvoice(rawInvoice)
    } catch (error) {
        showToast('Erreur', 'Impossible de charger cette facture', 'info', QuestionMarkCircleIcon)
    } finally {
        loading.value = false
    }
}

// Méthodes
const goBack = () => {
    router.push('/invoices')
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CM', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

const getStatusClass = (status: string) => {
    const classes = {
        draft: 'border-nature-300 bg-nature-100 text-nature-800',
        sent: 'border-primary-300 bg-primary-100 text-primary-800',
        paid: 'border-emerald-300 bg-emerald-100 text-emerald-800',
        overdue: 'border-red-300 bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || classes.draft
}

const getStatusPulseClass = (status: string) => {
    const classes = {
        draft: 'bg-nature-500',
        sent: 'bg-primary-500',
        paid: 'bg-emerald-500',
        overdue: 'bg-red-500'
    }
    return classes[status as keyof typeof classes] || classes.draft
}

const getStatusTextClass = (status: string) => {
    const classes = {
        draft: 'text-nature-700',
        sent: 'text-primary-700',
        paid: 'text-emerald-700',
        overdue: 'text-red-700'
    }
    return classes[status as keyof typeof classes] || classes.draft
}

const formatStatus = (status: string) => {
    const statusMap = {
        draft: 'Brouillon',
        sent: 'Envoyée',
        paid: 'Payée',
        overdue: 'En retard'
    }
    return statusMap[status as keyof typeof statusMap] || status
}

const downloadInvoice = () => {
    showToast('Téléchargement', 'Génération du PDF en cours...', 'info', DocumentTextIcon)
    // Simulation de téléchargement
    setTimeout(() => {
        showToast('Succès', 'Facture téléchargée avec succès', 'success', CheckCircleIcon)
    }, 1500)
}

const shareInvoice = () => {
    showToast('Partage', 'Options de partage disponibles', 'info', ShareIcon)
    // Implémenter le partage
    if (navigator.share) {
        navigator.share({
            title: `Facture ${invoice.value.invoice_number}`,
            text: `Facture de ${formatCurrency(invoice.value.total)} pour votre commande`,
            url: window.location.href
        })
    }
}

const printInvoice = () => {
    showToast('Impression', 'Préparation de l\'impression...', 'info', PrinterIcon)
    window.print()
}

const payInvoice = () => {
    showPaymentOptions.value = true
}

const handleInvoicePaid = () => {
    invoice.value.status = 'paid'
    invoice.value.payment_date = new Date().toISOString()
    showToast('Paiement', 'Facture marquée comme payée', 'success', CheckCircleIcon)
}

const sendReminder = () => {
    showToast('Rappel envoyé', 'Le client recevra un rappel par email', 'success', EnvelopeIcon)
}

const duplicateInvoice = () => {
    showToast('Duplication', 'Création d\'une nouvelle facture...', 'info', DocumentDuplicateIcon)
}

const requestRefund = () => {
    showToast('Remboursement', 'Ouverture du formulaire de remboursement...', 'info', ArrowPathIcon)
}

const contactSupport = () => {
    showToast('Support', 'Redirection vers le chat de support...', 'info', PhoneIcon)
}

const openFAQ = () => {
    showToast('FAQ', 'Ouverture de la FAQ...', 'info', QuestionMarkCircleIcon)
}

const showToast = (message: string, details: string, type: 'success' | 'info', icon?: any) => {
    toast.value = {
        show: true,
        type,
        message,
        details,
        icon: icon || CheckCircleIcon
    }

    setTimeout(() => {
        toast.value.show = false
    }, 5000)
}

onMounted(() => {
    loadInvoice()
})
</script>

<style scoped>
/* Animations */
.leaf-float {
    animation: float-leaf 20s ease-in-out infinite;
}

@keyframes float-leaf {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-30px) rotate(5deg);
    }
}

.custom-bezier {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animations des items */
.items-enter-active {
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.items-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.items-move {
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Animation de scintillement */
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

/* Styles pour l'impression */
@media print {
    .invoice-viewer {
        background: white !important;
    }

    .leaf-float,
    [class*="bg-gradient"],
    .sticky,
    button {
        display: none !important;
    }

    .invoice-viewer>*:not(.container) {
        display: none !important;
    }

    .container {
        max-width: 100% !important;
        padding: 0 !important;
    }

    .bg-white {
        background: white !important;
        box-shadow: none !important;
        border: 1px solid #ccc !important;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .invoice-viewer {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
</style>




