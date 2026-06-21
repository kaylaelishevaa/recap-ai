"""add indexes on created_at and language

Revision ID: 002
Revises: 001
Create Date: 2026-04-02
"""
from typing import Sequence, Union

from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index("ix_meetings_created_at", "meetings", ["created_at"])
    op.create_index("ix_meetings_language", "meetings", ["language"])


def downgrade() -> None:
    op.drop_index("ix_meetings_language", table_name="meetings")
    op.drop_index("ix_meetings_created_at", table_name="meetings")
