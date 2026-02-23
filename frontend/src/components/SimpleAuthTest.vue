<template>
  <div style="padding: 20px; max-width: 400px; margin: 0 auto;">
    <h2>Test Simple Authentification</h2>

    <!-- Test de connexion serveur -->
    <div style="margin: 20px 0; padding: 10px; background: #f0f0f0;">
      <strong>État serveur:</strong> {{ serverStatus }}
      <button @click="testServer" style="margin-left: 10px;">Tester</button>
    </div>

    <!-- Formulaire d'inscription -->
    <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0;">
      <h3>Inscription</h3>
      <input v-model="registerData.name" placeholder="Nom"
        style="display: block; margin: 5px 0; padding: 8px; width: 100%;" />
      <input v-model="registerData.email" placeholder="Email" type="email"
        style="display: block; margin: 5px 0; padding: 8px; width: 100%;" />
      <input v-model="registerData.password" placeholder="Mot de passe" type="password"
        style="display: block; margin: 5px 0; padding: 8px; width: 100%;" />
      <button @click="testRegister"
        style="padding: 10px 20px; background: #4CAF50; color: white; border: none; margin: 10px 0;">
        S'inscrire
      </button>
      <div v-if="registerResult" style="margin: 10px 0; padding: 10px; background: #e8f5e8;">
        {{ registerResult }}
      </div>
    </div>

    <!-- Formulaire de connexion -->
    <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0;">
      <h3>Connexion</h3>
      <input v-model="loginData.email" placeholder="Email" type="email"
        style="display: block; margin: 5px 0; padding: 8px; width: 100%;" />
      <input v-model="loginData.password" placeholder="Mot de passe" type="password"
        style="display: block; margin: 5px 0; padding: 8px; width: 100%;" />
      <button @click="testLogin"
        style="padding: 10px 20px; background: #2196F3; color: white; border: none; margin: 10px 0;">
        Se connecter
      </button>
      <div v-if="loginResult" style="margin: 10px 0; padding: 10px; background: #e3f2fd;">
        {{ loginResult }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const serverStatus = ref('Non testé')
const registerResult = ref('')
const loginResult = ref('')

const registerData = ref({
  name: '',
  email: '',
  password: ''
})

const loginData = ref({
  email: '',
  password: ''
})

const testServer = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/')
    if (response.ok) {
      const data = await response.json()
      serverStatus.value = '✅ Connecté: ' + data.message
    } else {
      serverStatus.value = '❌ Erreur: ' + response.status
    }
  } catch (error: any) {
    serverStatus.value = '❌ Erreur réseau: ' + error.message
  }
}

const testRegister = async () => {
  registerResult.value = 'Inscription en cours...'

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/authentification/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: registerData.value.name,
        email: registerData.value.email,
        password: registerData.value.password,
        user_type: 'customer'
      })
    })

    const data = await response.json()

    if (response.ok) {
      registerResult.value = '✅ Inscription réussie ! ID: ' + data.id
    } else {
      registerResult.value = '❌ Erreur: ' + (data.detail || JSON.stringify(data))
    }
  } catch (error: any) {
    registerResult.value = '❌ Erreur réseau: ' + error.message
  }
}

const testLogin = async () => {
  loginResult.value = 'Connexion en cours...'

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/authentification/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginData.value.email,
        password: loginData.value.password
      })
    })

    const data = await response.json()

    if (response.ok) {
      loginResult.value = '✅ Connexion réussie ! Token reçu.'
      localStorage.setItem('access_token', data.access_token)
    } else {
      loginResult.value = '❌ Erreur: ' + (data.detail || JSON.stringify(data))
    }
  } catch (error: any) {
    loginResult.value = '❌ Erreur réseau: ' + error.message
  }
}

// Test automatique du serveur au chargement
testServer()
</script>