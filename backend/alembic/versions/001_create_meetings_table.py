"""create meetings table

Revision ID: 001
Revises:
Create Date: 2026-03-31
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "meetings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("summary", sa.Text),
        sa.Column("decisions", postgresql.JSONB, server_default="[]"),
        sa.Column("action_items", postgresql.JSONB, server_default="[]"),
        sa.Column("follow_ups", postgresql.JSONB, server_default="[]"),
        sa.Column("sentiment", sa.String(100)),
        sa.Column("transcript", sa.Text),
        sa.Column("original_filename", sa.String(255)),
        sa.Column("file_type", sa.String(50)),
        sa.Column("duration_seconds", sa.Integer),
        sa.Column("language", sa.String(10), server_default="en"),
        sa.Column("created_at", sa.DateTime, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime, server_default=sa.text("now()")),
    )


def downgrade() -> None:
    op.drop_table("meetings")
