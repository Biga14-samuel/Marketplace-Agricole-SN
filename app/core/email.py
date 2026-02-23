"""
Service d'envoi d'emails avec FastAPI-Mail
"""
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from typing import List
from app.core.config import settings

# Configuration de la connexion email
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=settings.VALIDATE_CERTS
)

fm = FastMail(conf)


async def send_verification_email(email: EmailStr, token: str, user_name: str = None):
    """
    Envoie un email de vérification avec le lien de confirmation
    """
    verification_link = f"{settings.FRONTEND_URL}/auth/verify-email?token={token}"
    
    print(f"=== ENVOI EMAIL DE VÉRIFICATION ===")
    print(f"Email destinataire: {email}")
    print(f"Token: {token}")
    print(f"Lien de vérification: {verification_link}")
    print(f"FRONTEND_URL: {settings.FRONTEND_URL}")
    print(f"===================================")
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .container {{
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo {{
                font-size: 32px;
                font-weight: bold;
                color: #2d5016;
            }}
            .logo span {{
                color: #45a348;
            }}
            .content {{
                background: white;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 20px;
            }}
            .button {{
                display: inline-block;
                padding: 15px 40px;
                background: linear-gradient(135deg, #45a348 0%, #2d5016 100%);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
            }}
            .button:hover {{
                opacity: 0.9;
            }}
            .footer {{
                text-align: center;
                color: #666;
                font-size: 12px;
                margin-top: 20px;
            }}
            .warning {{
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }}
            .debug {{
                background: #f0f0f0;
                border: 1px solid #ccc;
                padding: 10px;
                margin: 20px 0;
                border-radius: 4px;
                font-family: monospace;
                font-size: 12px;
                word-break: break-all;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Market<span>Fraîche</span></div>
                <p style="color: #666;">Vos produits frais, directement des producteurs</p>
            </div>
            
            <div class="content">
                <h2 style="color: #2d5016;">Bienvenue sur MarketFraîche ! 🎉</h2>
                
                {"<p>Bonjour " + user_name + ",</p>" if user_name else "<p>Bonjour,</p>"}
                
                <p>Merci de vous être inscrit sur <strong>MarketFraîche</strong>, votre marketplace de produits frais camerounais !</p>
                
                <p>Pour activer votre compte et commencer à découvrir nos producteurs locaux, veuillez cliquer sur le bouton ci-dessous :</p>
                
                <div style="text-align: center;">
                    <a href="{verification_link}" class="button">
                        ✅ Vérifier mon email
                    </a>
                </div>
                
                <div class="warning">
                    <strong>⏰ Important :</strong> Ce lien est valide pendant 24 heures.
                </div>
                
                <p style="color: #666; font-size: 14px;">
                    Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                    <a href="{verification_link}" style="color: #45a348; word-break: break-all;">{verification_link}</a>
                </p>
                
                <div class="debug">
                    <strong>🔧 Informations de débogage (mode développement):</strong><br>
                    Token: {token}<br>
                    Lien complet: {verification_link}
                </div>
            </div>
            
            <div class="footer">
                <p>Vous recevez cet email car vous vous êtes inscrit sur MarketFraîche.</p>
                <p>Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.</p>
                <p style="margin-top: 20px;">
                    © 2026 MarketFraîche - Marketplace Agricole du Cameroun<br>
                    <a href="{settings.FRONTEND_URL}" style="color: #45a348;">Visiter notre site</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Vérifiez votre email - MarketFraîche",
        recipients=[email],
        body=html_content,
        subtype=MessageType.html
    )
    
    try:
        await fm.send_message(message)
        print(f"✅ Email envoyé avec succès à {email}")
    except Exception as e:
        print(f"❌ Erreur lors de l'envoi de l'email: {e}")
        import traceback
        traceback.print_exc()
        raise


def send_verification_email_in_background(email: EmailStr, token: str, user_name: str = None):
    """Appel synchronisé utilisé par BackgroundTasks: exécute l'envoi d'email de façon bloquante."""
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    
    async def _send_with_catching():
        try:
            await send_verification_email(email, token, user_name)
            print(f"✅ [background] Email de vérification envoyé à {email}")
        except Exception as e:
            print(f"❌ [background] Erreur lors de l'envoi d'email en arrière-plan: {e}")
            import traceback
            traceback.print_exc()
    
    try:
        # Utiliser get_event_loop si disponible, sinon créer une nouvelle boucle
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None
        
        if loop is None:
            # Pas de boucle en cours - créer une nouvelle
            asyncio.run(_send_with_catching())
        else:
            # Une boucle existe - utiliser run_coroutine_threadsafe
            import threading
            def run_in_thread():
                new_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(new_loop)
                try:
                    new_loop.run_until_complete(_send_with_catching())
                finally:
                    new_loop.close()
            
            thread = threading.Thread(target=run_in_thread, daemon=True)
            thread.start()
    except Exception as e:
        print(f"❌ [background] Erreur d'exécution: {e}")
        import traceback
        traceback.print_exc()


async def send_password_reset_email(email: EmailStr, token: str, user_name: str = None):
    """
    Envoie un email de réinitialisation de mot de passe
    """
    reset_link = f"{settings.FRONTEND_URL}/auth/reset-password?token={token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .container {{
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo {{
                font-size: 32px;
                font-weight: bold;
                color: #2d5016;
            }}
            .logo span {{
                color: #45a348;
            }}
            .content {{
                background: white;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 20px;
            }}
            .button {{
                display: inline-block;
                padding: 15px 40px;
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
            }}
            .button:hover {{
                opacity: 0.9;
            }}
            .footer {{
                text-align: center;
                color: #666;
                font-size: 12px;
                margin-top: 20px;
            }}
            .warning {{
                background: #f8d7da;
                border-left: 4px solid #dc3545;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Market<span>Fraîche</span></div>
            </div>
            
            <div class="content">
                <h2 style="color: #dc3545;">🔒 Réinitialisation de mot de passe</h2>
                
                {"<p>Bonjour " + user_name + ",</p>" if user_name else "<p>Bonjour,</p>"}
                
                <p>Vous avez demandé à réinitialiser votre mot de passe sur <strong>MarketFraîche</strong>.</p>
                
                <p>Pour créer un nouveau mot de passe, cliquez sur le bouton ci-dessous :</p>
                
                <div style="text-align: center;">
                    <a href="{reset_link}" class="button">
                        🔑 Réinitialiser mon mot de passe
                    </a>
                </div>
                
                <div class="warning">
                    <strong>⏰ Important :</strong> Ce lien est valide pendant 1 heure seulement.
                </div>
                
                <p style="color: #666; font-size: 14px;">
                    Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                    <a href="{reset_link}" style="color: #dc3545; word-break: break-all;">{reset_link}</a>
                </p>
                
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <strong>⚠️ Vous n'avez pas demandé cette réinitialisation ?</strong><br>
                    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Votre mot de passe actuel reste inchangé.
                </div>
            </div>
            
            <div class="footer">
                <p>© 2026 MarketFraîche - Marketplace Agricole du Cameroun</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Réinitialisation de mot de passe - MarketFraîche",
        recipients=[email],
        body=html_content,
        subtype=MessageType.html
    )
    
    await fm.send_message(message)
