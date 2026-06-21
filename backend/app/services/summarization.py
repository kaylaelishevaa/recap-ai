from __future__ import annotations

import json
import logging
from functools import lru_cache
from typing import Any, Dict

from app.config import settings
from app.services.llm import mock_summary_raw, resolve_provider
from app.utils.prompts import get_system_prompt

logger = logging.getLogger(__name__)


# The client is created lazily so the app imports and runs with no key (mock
# mode). The OpenAI SDK raises if constructed with an empty key, so we only
# build it when a real provider call is actually made.
@lru_cache(maxsize=1)
def _get_openai_client():
    from openai import OpenAI

    return OpenAI(api_key=settings.openai_api_key)


def _parse_json_response(text: str) -> Dict[str, Any]:
    """Extract and parse JSON from an LLM response, stripping markdown fences if present."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
    return json.loads(cleaned)


def _normalize_action_item(item: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize a single action item from LLM output."""
    return {
        "task": item.get("task", ""),
        "assignee": item.get("responsible", item.get("assignee", "TBD")),
        "deadline": item.get("deadline", "TBD"),
        "priority": item.get("priority", "medium"),
    }


def _normalize_result(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize LLM output keys to snake_case for the rest of the backend."""
    raw_items = raw.get("actionItems", raw.get("action_items", []))
    return {
        "title": raw.get("title", "Untitled Meeting"),
        "summary": raw.get("summary", ""),
        "decisions": raw.get("keyDecisions", raw.get("decisions", [])),
        "action_items": [_normalize_action_item(item) for item in raw_items],
        "follow_ups": raw.get(
            "followUpRecommendations", raw.get("followUps", raw.get("follow_ups", []))
        ),
        "sentiment": raw.get("sentiment", ""),
    }


async def _call_openai(transcript: str, system_prompt: str) -> str:
    """Call OpenAI GPT-4o API."""
    response = _get_openai_client().chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": transcript},
        ],
        max_tokens=4096,
    )
    return response.choices[0].message.content


async def summarize_transcript(transcript: str, language: str = "en") -> Dict[str, Any]:
    """Summarize a meeting transcript into structured notes.

    Provider is chosen from ``LLM_PROVIDER`` (see ``app.services.llm``):
      - ``mock``   → deterministic fabricated output, no key/network
      - ``openai`` → GPT-4o
    """
    if resolve_provider() == "mock":
        logger.info("Summarization using mock provider (no API call)")
        return _normalize_result(mock_summary_raw(transcript, language))

    system_prompt = get_system_prompt(language)
    try:
        raw_text = await _call_openai(transcript, system_prompt)
        parsed = _parse_json_response(raw_text)
        logger.info("Summarization completed with openai")
        return _normalize_result(parsed)
    except Exception as e:  # noqa: BLE001 — surface a single clean failure to the caller
        logger.error("Summarization via openai failed: %s", e)
        raise RuntimeError("Summarization failed") from e
