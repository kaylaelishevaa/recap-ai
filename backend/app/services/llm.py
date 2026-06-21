"""LLM provider selection and the deterministic mock backend.

The real summarization/transcription code lives in their own service modules;
this module is the single place that decides *which* provider runs and supplies
the fabricated output used when no API key is available (``LLM_PROVIDER=mock``).

The mock output is intentionally deterministic — given the same transcript it
always returns the same structured notes — so the demo flow and tests are
reproducible without any network access.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, Tuple

from app.config import settings

logger = logging.getLogger(__name__)

VALID_PROVIDERS = {"mock", "auto", "openai"}


def resolve_provider() -> str:
    """Resolve the configured provider to a concrete backend.

    ``auto`` uses OpenAI when its key is present, otherwise falls back to
    ``mock`` so the app always starts and serves requests, even with no keys.
    Unknown values degrade to ``mock`` rather than crashing the request.
    """
    provider = (settings.llm_provider or "mock").strip().lower()
    if provider not in VALID_PROVIDERS:
        logger.warning("Unknown LLM_PROVIDER=%r — falling back to mock", provider)
        return "mock"
    if provider == "auto":
        if settings.openai_api_key:
            return "openai"
        logger.info("LLM_PROVIDER=auto with no key set — using mock")
        return "mock"
    return provider


def _derive_title(transcript: str) -> str:
    """Build a short, deterministic title from the transcript's first content."""
    first_line = next((ln.strip() for ln in transcript.splitlines() if ln.strip()), "")
    if not first_line:
        return "Untitled Meeting (Mock)"
    # Drop a leading "Speaker:" prefix if present, then take a few words.
    if ":" in first_line[:40]:
        first_line = first_line.split(":", 1)[1].strip() or first_line
    words = first_line.split()
    title = " ".join(words[:7]).rstrip(".,;:")
    return f"{title} (Mock)" if title else "Untitled Meeting (Mock)"


def mock_summary_raw(transcript: str, language: str = "en") -> Dict[str, Any]:
    """Return a fabricated, deterministic summary in the LLM's raw key format.

    Shaped exactly like a real model response so it flows through the same
    ``_normalize_result`` path as the live providers. Fully fabricated — no real
    people, companies, or meeting data.
    """
    word_count = len(transcript.split())
    return {
        "title": _derive_title(transcript),
        "summary": (
            "[MOCK MODE] This is a fabricated summary produced without any LLM "
            "call or network access, so the demo runs with zero API keys. The "
            f"submitted transcript contained roughly {word_count} words. Set "
            "LLM_PROVIDER=openai with a valid OPENAI_API_KEY to generate a real, "
            "content-aware summary instead."
        ),
        "keyDecisions": [
            "Adopt the proposed plan and proceed to the implementation phase.",
            "Schedule a follow-up review before the next milestone.",
        ],
        "actionItems": [
            {
                "task": "Circulate the meeting notes to all attendees",
                "responsible": "Facilitator",
                "deadline": "End of week",
                "priority": "high",
            },
            {
                "task": "Draft the implementation checklist for the agreed plan",
                "responsible": "TBD",
                "deadline": "Next sprint",
                "priority": "medium",
            },
        ],
        "followUpRecommendations": [
            "Confirm owners and deadlines for each action item.",
            "Share the summary with stakeholders who could not attend.",
            "Track decisions in the project tracker for visibility.",
        ],
        "sentiment": "Neutral (mock)",
    }


def mock_transcribe(file_path: Path) -> Tuple[str, int]:
    """Return a fabricated transcript + duration for an uploaded media file.

    Used when no transcription key is available so the upload → notes flow works
    end-to-end in mock mode. The text is canned and clearly marked.
    """
    name = Path(file_path).name
    transcript = (
        "[MOCK TRANSCRIPT] Audio transcription is disabled in mock mode, so no "
        f"speech-to-text was performed on '{name}'. This placeholder transcript "
        "stands in for the recording's contents.\n\n"
        "Facilitator: Welcome everyone, let's review progress and agree on next steps.\n"
        "Engineer: The core work is on track; one dependency still needs sign-off.\n"
        "Facilitator: Understood — let's make that the priority and follow up this week."
    )
    return transcript, 90
