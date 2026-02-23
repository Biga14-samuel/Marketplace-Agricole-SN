<template>
  <div class="emergency-auth">
    <div class="container">
      <h1>🚀 Authentification - Version Fonctionnelle</h1>

      <!-- Status serveur -->
      <div class="status" :class="serverOk ? 'success' : 'error'">
        {{ serverStatus }}
      </div>

      <!-- Onglets -->
      <div class="tabs">
        <button @click="activeTab = 'login'" :class="{ active: activeTab === 'login' }">
          Connexion
        </button>
        <button @click="activeTab = 'register'" :class="{ active: activeTab === 'register' }">
          Inscription
        </button>
      </div>

      <!-- Formulaire de connexion -->
      <div v-if="activeTab === 'login'" class="form-section">
        <h2>Se connecter</h2>
        <form @submit.prevent="login">
          <input v-model="loginForm.email" type="email" placeholder="Email" required class="input" />
          <input v-model="loginForm.password" type="password" placeholder="Mot de passe" required class="input" />
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        <div v-if="loginMessage" class="message" :class="loginSuccess ? 'success' : 'error'">
          {{ loginMessage }}
        </div>
      </div>

      <!-- Formulaire d'inscription -->
      <div v-if="activeTab === 'register'" class="form-section">
        <h2>S'inscrire</h2>
        <form @submit.prevent="register">
          <input v-model="registerForm.name" type="text" placeholder="Nom complet" required class="input" />
          <input v-model="registerForm.email" type="email" placeholder="Email" required class="input" />
          <input v-model="registerForm.password" type="password" placeholder="Mot de passe" required class="input" />
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Inscription...' : 'S\'inscrire' }}
          </button>
        </form>
        <div v-if="registerMessage" class="message" :class="registerSuccess ? 'success' : 'error'">
          {{ registerMessage }}
        </div>
      </div>

      <!-- Utilisateur connecté -->
      <div v-if="user" class="user-info">
        <h3>✅ Connecté en tant que {{ user.name }}</h3>
        <p>Email: {{ user.email }}</p>
        <button @click="logout" class="btn-secondary">Se déconnecter</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const activeTab = ref('login')
const loading = ref(false)
const serverOk = ref(false)
const serverStatus = ref('Vérification...')

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })

const loginMessage = ref('')
const loginSuccess = ref(false)
const registerMessage = ref('')
const registerSuccess = ref(false)

const user = ref(null)

// Vérifier le serveur
const checkServer = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/')
    if (response.ok) {
      serverOk.value = true
      serverStatus.value = '✅ Serveur connecté'
    } else {
      serverStatus.value = '❌ Serveur erreur ' + response.status
    }
  } catch (error: any) {
    serverStatus.value = '❌ Serveur non accessible'
  }
}

// Connexion
const login = async () => {
  loading.value = true
  loginMessage.value = ''

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/authentification/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: loginForm.value.email,
        password: loginForm.value.password
      })
    })

    const data = await response.json()

    if (response.ok) {
      loginSuccess.value = true
      loginMessage.value = '✅ Connexion réussie !'
      localStorage.setItem('access_token', data.access_token)
      user.value = data.user
    } else {
      loginSuccess.value = false
      loginMessage.value = '❌ ' + (data.detail || 'Erreur de connexion')
    }
  } catch (error: any) {
    loginSuccess.value = false
    loginMessage.value = '❌ Erreur réseau: ' + error.message
  } finally {
    loading.value = false
  }
}

// Inscription
const register = async () => {
  loading.value = true
  registerMessage.value = ''

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/authentification/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: registerForm.value.name,
        email: registerForm.value.email,
        password: registerForm.value.password,
        user_type: 'customer'
      })
    })

    const data = await response.json()

    if (response.ok) {
      registerSuccess.value = true
      registerMessage.value = '✅ Inscription réussie ! Vous pouvez vous connecter.'
      activeTab.value = 'login'
      loginForm.value.email = registerForm.value.email
    } else {
      registerSuccess.value = false
      registerMessage.value = '❌ ' + (data.detail || 'Erreur d\'inscription')
    }
  } catch (error) {
    registerSuccess.value = false
    registerMessage.value = '❌ Erreur réseau: ' + error.message
  } finally {
    loading.value = false
  }
}

// Déconnexion
const logout = () => {
  localStorage.removeItem('access_token')
  user.value = null
  loginMessage.value = ''
  registerMessage.value = ''
}

onMounted(() => {
  checkServer()
})
</script>

<style scoped>
.emergency-auth {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.status {
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-weight: bold;
}

.status.success {
  background: #d4edda;
  color: #155724;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
}

.tabs {
  display: flex;
  margin-bottom: 30px;
}

.tabs button {
  flex: 1;
  padding: 15px;
  border: none;
  background: #f8f9fa;
  cursor: pointer;
  border-radius: 5px 5px 0 0;
  font-size: 16px;
}

.tabs button.active {
  background: #007bff;
  color: white;
}

.form-section {
  margin-bottom: 20px;
}

.input {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

.input:focus {
  border-color: #007bff;
  outline: none;
}

.btn-primary {
  width: 100%;
  padding: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.message {
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
  font-weight: bold;
}

.message.success {
  background: #d4edda;
  color: #155724;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
}

.user-info {
  text-align: center;
  padding: 20px;
  background: #d4edda;
  border-radius: 5px;
  margin-top: 20px;
}
</style>