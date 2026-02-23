"""Initial clean setup

Revision ID: 384a403d59c8
Revises: 5b5b19481eb8
Create Date: 2026-02-02 11:38:45.088754

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '384a403d59c8'
down_revision: Union[str, Sequence[str], None] = '5b5b19481eb8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Migration vide - la colonne id est déjà correctement configurée
    # Une clé primaire ne peut pas être nullable
    pass


def downgrade() -> None:
    """Downgrade schema."""
    # Migration vide
    pass
