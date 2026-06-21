from __future__ import annotations

import json
import logging
import subprocess
import uuid
from pathlib import Path
from typing import Tuple

from fastapi import UploadFile

from app.config import settings

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".mp3", ".mp4", ".wav", ".webm", ".m4a", ".ogg"}
MAX_FILE_SIZE = settings.max_file_size_mb * 1024 * 1024
MAX_DURATION = settings.max_duration_seconds


def get_audio_duration(file_path: str) -> float:
    """Get audio/video duration in seconds using ffprobe."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", file_path],
            capture_output=True,
            text=True,
            timeout=30,
        )
        data = json.loads(result.stdout)
        return float(data["format"]["duration"])
    except Exception as e:
        logger.warning("ffprobe duration detection failed: %s", e)
        return 0.0


async def validate_and_save(file: UploadFile) -> Tuple[Path, str]:
    """Validate the uploaded file, save to disk, check duration. Returns (file_path, file_type)."""
    if not file.filename:
        raise ValueError("No filename provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file type '{ext}'. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise ValueError(f"File exceeds {settings.max_file_size_mb}MB limit")

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4()}{ext}"
    file_path = upload_dir / filename
    file_path.write_bytes(content)

    # Check duration after saving
    duration = get_audio_duration(str(file_path))
    if duration > MAX_DURATION:
        file_path.unlink()
        raise ValueError("Recording exceeds 20-minute limit. Please trim your file and try again.")

    content_type = file.content_type or f"audio/{ext.lstrip('.')}"
    return file_path, content_type


def delete_file(file_path: str) -> None:
    """Delete an uploaded file if it exists."""
    path = Path(file_path)
    if path.exists():
        path.unlink()
