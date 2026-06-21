from __future__ import annotations

import logging
import os
from functools import lru_cache
from pathlib import Path
from typing import List, Optional, Tuple

from pydub import AudioSegment

from app.config import settings
from app.services.llm import mock_transcribe, resolve_provider

logger = logging.getLogger(__name__)

WHISPER_MAX_SIZE = 25 * 1024 * 1024  # 25MB
CHUNK_MINUTES = 5


# Lazy so the app runs with no OpenAI key (mock mode). The SDK raises if
# constructed with an empty key, so only build it for a real Whisper call.
@lru_cache(maxsize=1)
def _get_client():
    from openai import OpenAI

    return OpenAI(api_key=settings.openai_api_key)


def _split_audio(file_path: Path) -> List[str]:
    """Split audio into chunks for Whisper's 25MB limit."""
    audio = AudioSegment.from_file(str(file_path))
    chunk_ms = CHUNK_MINUTES * 60 * 1000
    chunks = []
    for i in range(0, len(audio), chunk_ms):
        chunk = audio[i : i + chunk_ms]
        chunk_path = f"{file_path}_chunk_{i // chunk_ms}.mp3"
        chunk.export(chunk_path, format="mp3")
        chunks.append(chunk_path)
    return chunks


def _cleanup_chunks(chunk_paths: List[str]) -> None:
    """Remove temporary chunk files."""
    for path in chunk_paths:
        try:
            os.unlink(path)
        except OSError:
            pass


def _build_whisper_params(file, language: str, response_format: str) -> dict:
    """Build Whisper API params. Omit language for mixed mode (auto-detect)."""
    params = {"model": "whisper-1", "file": file, "response_format": response_format}
    if language in ("en", "id"):
        params["language"] = language
    # language == "mixed" → no language param, Whisper auto-detects
    return params


def _transcribe_single(file_path: str, language: str = "en") -> str:
    """Transcribe a single file with Whisper."""
    with open(file_path, "rb") as audio_file:
        params = _build_whisper_params(audio_file, language, "text")
        response = _get_client().audio.transcriptions.create(**params)
    return response


def _transcribe_single_verbose(file_path: str, language: str = "en"):
    """Transcribe a single file with verbose JSON to get duration."""
    with open(file_path, "rb") as audio_file:
        params = _build_whisper_params(audio_file, language, "verbose_json")
        response = _get_client().audio.transcriptions.create(**params)
    return response


async def transcribe_audio(file_path: Path, language: str = "en") -> Tuple[str, Optional[int]]:
    """Transcribe an audio/video file using OpenAI Whisper API.

    For files > 25MB, splits into 5-minute chunks and concatenates.
    Returns (transcript_text, duration_seconds).

    In mock mode (no transcription key) returns a canned transcript so the
    upload → notes flow works end-to-end without any network call.
    """
    if resolve_provider() == "mock":
        logger.info("Transcription using mock provider (no API call)")
        return mock_transcribe(file_path)

    file_size = file_path.stat().st_size

    if file_size <= WHISPER_MAX_SIZE:
        response = _transcribe_single_verbose(str(file_path), language)
        transcript = response.text
        duration = round(response.duration) if response.duration else None
        return transcript, duration

    # Large file — split into chunks
    logger.info("File %s exceeds 25MB, splitting into chunks", file_path.name)
    chunk_paths = _split_audio(file_path)
    try:
        transcripts = []
        for i, chunk_path in enumerate(chunk_paths):
            logger.info("Transcribing chunk %d/%d", i + 1, len(chunk_paths))
            text = _transcribe_single(chunk_path, language)
            transcripts.append(text.strip())
        transcript = "\n\n".join(transcripts)
    finally:
        _cleanup_chunks(chunk_paths)

    # Estimate duration from pydub
    try:
        audio = AudioSegment.from_file(str(file_path))
        duration = round(len(audio) / 1000)
    except Exception:
        duration = None

    return transcript, duration
