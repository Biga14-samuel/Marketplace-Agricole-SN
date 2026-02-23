from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Security
    # Cette valeur sera écrasée par celle du .env si elle existe
    SECRET_KEY: str = "une_cle_tres_secrete_et_fixe_pour_les_tests"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    API_V1_PREFIX: str = "/api/v1"

    # App
    APP_NAME: str = "Marketplace Agricole"
    DEBUG: bool = True
    
    # Development settings
    SKIP_EMAIL_VERIFICATION: bool = False
    
    # Email Configuration
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_FROM_NAME: str = "MarketFraîche"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True
    
    # Frontend URL for email links
    FRONTEND_URL: str = "http://localhost:5174"
    
    # CORS - Origines autorisées (séparées par des virgules)
    ALLOWED_ORIGINS: str = ""
    
    # Nouvelle syntaxe pour Pydantic v2
    model_config = SettingsConfigDict(
        env_file = ".env",
        case_sensitive = True,
        extra = "ignore"
    )

settings = Settings()