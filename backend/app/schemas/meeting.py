from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ActionItem(BaseModel):
    task: str
    assignee: str = "TBD"
    deadline: str = "TBD"
    priority: str = "medium"


class TranscriptInput(BaseModel):
    transcript: str = Field(..., min_length=1, max_length=500000)
    title: Optional[str] = None
    language: str = Field("mixed", pattern="^(en|id|mixed)$")


class MeetingResponse(BaseModel):
    id: UUID
    title: str
    summary: Optional[str] = None
    decisions: List[str] = []
    action_items: List[ActionItem] = []
    follow_ups: List[str] = []
    sentiment: Optional[str] = None
    transcript: Optional[str] = None
    original_filename: Optional[str] = None
    file_type: Optional[str] = None
    duration_seconds: Optional[int] = None
    language: str = "en"
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MeetingListResponse(BaseModel):
    meetings: List[MeetingResponse]
    total: int
    page: int
    limit: int


class ExportResponse(BaseModel):
    markdown: str
