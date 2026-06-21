import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    summary = Column(Text)
    decisions = Column(JSONB, default=list)
    action_items = Column(JSONB, default=list)
    follow_ups = Column(JSONB, default=list)
    sentiment = Column(String(100))
    transcript = Column(Text)
    original_filename = Column(String(255))
    file_type = Column(String(50))
    duration_seconds = Column(Integer)
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        Index("ix_meetings_created_at", "created_at"),
        Index("ix_meetings_language", "language"),
    )
