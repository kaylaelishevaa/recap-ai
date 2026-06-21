"""Tests for provider selection and the deterministic mock backend."""

import pytest

from app.services import llm
from app.services.summarization import summarize_transcript


class TestResolveProvider:
    def test_explicit_mock(self, monkeypatch):
        monkeypatch.setattr(llm.settings, "llm_provider", "mock")
        assert llm.resolve_provider() == "mock"

    def test_unknown_falls_back_to_mock(self, monkeypatch):
        monkeypatch.setattr(llm.settings, "llm_provider", "gpt5-turbo")
        assert llm.resolve_provider() == "mock"

    def test_auto_with_no_key_is_mock(self, monkeypatch):
        monkeypatch.setattr(llm.settings, "llm_provider", "auto")
        monkeypatch.setattr(llm.settings, "openai_api_key", "")
        assert llm.resolve_provider() == "mock"

    def test_auto_uses_openai_when_key_present(self, monkeypatch):
        monkeypatch.setattr(llm.settings, "llm_provider", "auto")
        monkeypatch.setattr(llm.settings, "openai_api_key", "sk-test")
        assert llm.resolve_provider() == "openai"


class TestMockSummaryRaw:
    def test_has_all_expected_keys(self):
        raw = llm.mock_summary_raw("Alice: let's ship the feature on Friday.")
        for key in ("title", "summary", "keyDecisions", "actionItems", "followUpRecommendations"):
            assert key in raw

    def test_is_deterministic(self):
        text = "Bob: we agreed to launch the beta next week."
        assert llm.mock_summary_raw(text) == llm.mock_summary_raw(text)

    def test_title_derived_from_transcript(self):
        raw = llm.mock_summary_raw("Sarah: Q3 planning session kickoff for the mobile team.")
        assert "Mock" in raw["title"]
        assert "Sarah:" not in raw["title"]  # speaker prefix stripped

    def test_empty_transcript_is_safe(self):
        raw = llm.mock_summary_raw("")
        assert raw["title"]
        assert isinstance(raw["actionItems"], list)


class TestMockTranscribe:
    def test_returns_text_and_duration(self, tmp_path):
        text, duration = llm.mock_transcribe(tmp_path / "meeting.mp3")
        assert "MOCK TRANSCRIPT" in text
        assert isinstance(duration, int) and duration > 0


@pytest.mark.asyncio
async def test_summarize_transcript_mock_end_to_end(monkeypatch):
    """summarize_transcript returns normalized snake_case notes with no network."""
    monkeypatch.setattr(llm.settings, "llm_provider", "mock")
    result = await summarize_transcript("Dana: approved the budget for next quarter.")

    assert result["title"]
    assert result["summary"]
    assert isinstance(result["decisions"], list) and result["decisions"]
    assert isinstance(result["action_items"], list) and result["action_items"]
    # normalized to snake_case assignee key
    assert "assignee" in result["action_items"][0]
    assert "responsible" not in result["action_items"][0]
    assert isinstance(result["follow_ups"], list)
