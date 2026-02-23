"""Script de test SMTP indépendant.
Usage:
  python scripts/test_smtp.py [destinataire]

Le script utilise la configuration pydantic `settings` déjà présente dans l'application.
"""
from email.mime.text import MIMEText
import smtplib
import sys

from app.core.config import settings


def test_smtp(recipient: str):
    smtp_server = settings.MAIL_SERVER
    port = settings.MAIL_PORT
    sender = settings.MAIL_USERNAME
    password = settings.MAIL_PASSWORD

    msg = MIMEText("Test d'envoi SMTP depuis Marketplace Agricole")
    msg["Subject"] = "Test SMTP - Marketplace Agricole"
    msg["From"] = sender
    msg["To"] = recipient

    print(f"Tentative de connexion SMTP -> server={smtp_server} port={port} user={sender}")
    try:
        server = smtplib.SMTP(smtp_server, port, timeout=20)
        if settings.MAIL_STARTTLS:
            server.starttls()
        if settings.USE_CREDENTIALS:
            server.login(sender, password)
        server.send_message(msg)
        server.quit()
        print("Succès: email envoyé à", recipient)
        return True
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("Erreur lors du test SMTP:", e)
        return False


if __name__ == "__main__":
    recipient = sys.argv[1] if len(sys.argv) > 1 else settings.MAIL_FROM or settings.MAIL_USERNAME
    ok = test_smtp(recipient)
    sys.exit(0 if ok else 1)
