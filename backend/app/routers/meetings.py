from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.meeting import Meeting
from app.schemas.meeting import (
    ExportResponse,
    MeetingListResponse,
    MeetingResponse,
    TranscriptInput,
)
from app.services.file_handler import delete_file, validate_and_save
from app.services.summarization import summarize_transcript
from app.services.transcription import transcribe_audio

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/meetings", tags=["meetings"])


# ── POST /api/meetings/upload ────────────────────────────────────────────────


@router.post("/upload", response_model=MeetingResponse)
async def upload_meeting(
    file: UploadFile = File(...),
    language: str = Form("en"),
    db: Session = Depends(get_db),
):
    """Upload audio/video → transcribe → summarize → save."""
    try:
        file_path, file_type = await validate_and_save(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        transcript, duration = await transcribe_audio(file_path, language=language)
    except Exception as e:
        delete_file(str(file_path))
        logger.error("Transcription failed: %s", e)
        raise HTTPException(status_code=502, detail="Transcription service failed")

    try:
        summary_data = await summarize_transcript(transcript, language=language)
    except RuntimeError:
        delete_file(str(file_path))
        raise HTTPException(status_code=502, detail="Summarization service failed")

    meeting = Meeting(
        title=summary_data["title"],
        summary=summary_data["summary"],
        decisions=summary_data["decisions"],
        action_items=summary_data["action_items"],
        follow_ups=summary_data["follow_ups"],
        sentiment=summary_data["sentiment"],
        transcript=transcript,
        original_filename=str(file_path),
        file_type=file_type,
        duration_seconds=duration,
        language=language,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


# ── POST /api/meetings/transcript ────────────────────────────────────────────


@router.post("/transcript", response_model=MeetingResponse)
async def submit_transcript(body: TranscriptInput, db: Session = Depends(get_db)):
    """Submit a text transcript → summarize → save."""
    try:
        summary_data = await summarize_transcript(body.transcript, language=body.language)
    except RuntimeError:
        raise HTTPException(status_code=502, detail="Summarization service failed")

    meeting = Meeting(
        title=body.title or summary_data["title"],
        summary=summary_data["summary"],
        decisions=summary_data["decisions"],
        action_items=summary_data["action_items"],
        follow_ups=summary_data["follow_ups"],
        sentiment=summary_data["sentiment"],
        transcript=body.transcript,
        file_type="text",
        language=body.language,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


# ── GET /api/meetings ────────────────────────────────────────────────────────


@router.get("", response_model=MeetingListResponse)
def list_meetings(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    language: str = Query(None),
    db: Session = Depends(get_db),
):
    """List all meetings, newest first. Optional keyword search and language filter."""
    query = db.query(Meeting)
    if search:
        pattern = f"%{search}%"
        query = query.filter(Meeting.title.ilike(pattern) | Meeting.summary.ilike(pattern))
    if language:
        query = query.filter(Meeting.language == language)
    total = query.count()
    meetings = (
        query.order_by(desc(Meeting.created_at)).offset((page - 1) * limit).limit(limit).all()
    )
    return MeetingListResponse(meetings=meetings, total=total, page=page, limit=limit)


# ── GET /api/meetings/{id} ───────────────────────────────────────────────────


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(meeting_id: UUID, db: Session = Depends(get_db)):
    """Get full details of a specific meeting."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


# ── DELETE /api/meetings/{id} ────────────────────────────────────────────────


@router.delete("/{meeting_id}")
def delete_meeting(meeting_id: UUID, db: Session = Depends(get_db)):
    """Delete a meeting and its uploaded file."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    if meeting.original_filename:
        delete_file(str(meeting.original_filename))

    db.delete(meeting)
    db.commit()
    return {"detail": "Meeting deleted"}


# ── POST /api/meetings/{id}/export ───────────────────────────────────────────


@router.post("/{meeting_id}/export", response_model=ExportResponse)
def export_meeting(meeting_id: UUID, db: Session = Depends(get_db)):
    """Export a meeting as formatted markdown."""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    is_id = meeting.language == "id"
    lines = [f"# {meeting.title}", ""]

    if meeting.sentiment:
        lines.append(f"**Sentiment:** {meeting.sentiment}")
        lines.append("")

    if meeting.duration_seconds:
        minutes = meeting.duration_seconds // 60
        label = "Durasi" if is_id else "Duration"
        lines.append(f"**{label}:** {minutes} min")
        lines.append("")

    if meeting.summary:
        heading = "Ringkasan" if is_id else "Summary"
        lines.extend([f"## {heading}", "", meeting.summary, ""])

    if meeting.decisions:
        heading = "Keputusan Utama" if is_id else "Key Decisions"
        lines.append(f"## {heading}")
        lines.append("")
        for i, d in enumerate(meeting.decisions, 1):
            lines.append(f"{i}. {d}")
        lines.append("")

    if meeting.action_items:
        heading = "Item Aksi" if is_id else "Action Items"
        assignee_h = "Penanggung Jawab" if is_id else "Assignee"
        lines.append(f"## {heading}")
        lines.append("")
        lines.append(f"| Task | {assignee_h} | Deadline | Priority |")
        lines.append("|------|----------|----------|----------|")
        for item in meeting.action_items:
            task = item.get("task", "")
            assignee = item.get("assignee", "TBD")
            deadline = item.get("deadline", "TBD")
            priority = item.get("priority", "medium")
            lines.append(f"| {task} | {assignee} | {deadline} | {priority} |")
        lines.append("")

    if meeting.follow_ups:
        heading = "Rekomendasi Tindak Lanjut" if is_id else "Follow-up Recommendations"
        lines.append(f"## {heading}")
        lines.append("")
        for f in meeting.follow_ups:
            lines.append(f"- {f}")
        lines.append("")

    if meeting.transcript:
        heading = "Transkrip Mentah" if is_id else "Transcript"
        lines.extend([f"## {heading}", "", meeting.transcript, ""])

    return ExportResponse(markdown="\n".join(lines))
