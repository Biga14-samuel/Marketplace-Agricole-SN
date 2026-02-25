# Corrections de l'Audit de Sécurité

## ✅ Corrections effectuées

### 🔴 CRITIQUE 1 : Configuration CORS corrigée
**Fichier**: `app/main.py`

**Problème**: 
- Combinaison `allow_origins=["*"]` + `allow_credentials=True` interdite par la spec CORS
- Tous les navigateurs bloquent silencieusement les requêtes avec header Authorization

**Solution appliquée**:
```python
# ✅ Liste explicite d'origines au lieu de ["*"]
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # ✅ Plus de wildcard
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

### 🟣 SÉCURITÉ : Faille user_id corrigée
**Fichiers**: 
- `app/schemas/payments.py`
- `app/routers/payments.py`
- `app/services/payment_service.py`
- `app/repositories/payment_repository.py`

**Problème**:
- `user_id` accepté dans le body de `PaymentMethodCreate`
- N'importe quel utilisateur pouvait créer des moyens de paiement sur le compte d'un autre

**Solution appliquée**:

1. **Schéma** (`payments.py`):
```python
class PaymentMethodCreate(PaymentMethodBase):
    """
    ⚠️ SÉCURITÉ: user_id ne doit JAMAIS venir du body
    """
    # ❌ SUPPRIMÉ: user_id: int
    # ✅ Le user_id sera récupéré depuis current_user dans le router
    stripe_payment_method_id: Optional[str] = None
```

2. **Router** (`payments.py`):
```python
@router.post("/methods")
def create_payment_method(
    payment_method_data: PaymentMethodCreate,
    current_user: User = Depends(get_current_user),  # ✅ user_id depuis JWT
    db: Session = Depends(get_db)
):
    service = PaymentService(db)
    return service.create_payment_method_for_user(
        payment_method_data, 
        current_user.id  # ✅ Injecté depuis le JWT
    )
```

3. **Service** (`payment_service.py`):
```python
def create_payment_method_for_user(
    self, 
    payment_method_data: PaymentMethodCreate,
    user_id: int  # ✅ Passé explicitement depuis le JWT
) -> PaymentMethodResponse:
    method_dict = payment_method_data.model_dump()
    method_dict['user_id'] = user_id  # ✅ Injection sécurisée
    
    payment_method = self.repository.create_payment_method_dict(method_dict)
    # ...
```

4. **Repository** (`payment_repository.py`):
```python
def create_payment_method_dict(
    self, 
    payment_method_dict: dict  # ✅ Accepte dict avec user_id injecté
) -> PaymentMethod:
    # Si ce moyen est défini comme défaut, retirer le défaut des autres
    if payment_method_dict.get('is_default', False):
        self.db.query(PaymentMethod).filter(
            PaymentMethod.user_id == payment_method_dict['user_id']
        ).update({"is_default": False})
    
    payment_method = PaymentMethod(**payment_method_dict)
    # ...
```

## 📋 Problèmes restants à corriger

### 🔴 CRITIQUE 2 : URLs avec espaces (si présent)
**Status**: ✅ Vérifié - Les URLs utilisent déjà des tirets (`/customer-profiles`, `/producer-profiles`, `/products-catalog`)

### 🟠 MOYEN 4 : Validator cross-champ Pydantic v2
**Fichier**: À identifier
**Action**: Remplacer `@validator` par `@model_validator` pour Pydantic v2

### 🟠 MOYEN 5 : Type mismatch day_of_week
**Fichier**: Schémas de créneaux horaires
**Problème**: Schéma attend string ("monday") mais frontend envoie int (1)
**Action**: Accepter les deux formats ou normaliser

### 🟠 MOYEN 6 : Encodage UTF-8 corrompu
**Problème**: Mojibake (è → Ã¨) dans les fichiers
**Action**: Script de correction fourni dans le rapport d'audit

### 🟡 MINEUR 7 : coordinates en string
**Action**: Valider le format ou utiliser un type structuré

### 🟡 MINEUR 8 : Incohérence total vs total_amount
**Action**: Standardiser sur un seul nom de champ

### 🟡 MINEUR 9 : lifespan sync dans contexte async
**Fichier**: `app/main.py`
**Action**: Rendre les appels DB async ou documenter pourquoi c'est sync

## 🧪 Tests recommandés

1. **Test CORS**:
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Authorization: Bearer <token>" \
     -X GET http://localhost:8000/api/v1/authentification/auth/me
```

2. **Test sécurité payment**:
```python
# Tenter de créer un moyen de paiement pour un autre user
# Devrait échouer car user_id vient du JWT
response = client.post(
    "/api/v1/payments/methods",
    json={"type": "card", "last4": "4242"},
    headers={"Authorization": f"Bearer {token_user1}"}
)
# Le moyen de paiement doit être créé pour user1, pas pour un autre
```

## 📝 Notes

- Les anciennes méthodes sont marquées `DEPRECATED` pour compatibilité
- Tous les changements sont rétrocompatibles
- Aucun test existant ne devrait casser
- Les logs CORS sont activés pour faciliter le debug

## 🚀 Déploiement

1. Redémarrer le serveur backend pour appliquer les changements CORS
2. Vérifier que les requêtes authentifiées fonctionnent depuis le frontend
3. Tester la création de moyens de paiement
4. Monitorer les logs pour détecter d'éventuels problèmes CORS

## ⚠️ Breaking Changes

Aucun breaking change pour les clients existants. Les anciennes méthodes sont conservées en mode deprecated.
