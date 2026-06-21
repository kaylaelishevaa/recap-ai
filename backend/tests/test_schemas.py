import pytest
from pydantic import ValidationError

from app.schemas.meeting import ActionItem, TranscriptInput


class TestActionItem:
    def test_defaults(self):
        item = ActionItem(task="Do something")
        assert item.assignee == "TBD"
        assert item.deadline == "TBD"
        assert item.priority == "medium"

    def test_all_fields(self):
        item = ActionItem(task="Build API", assignee="Alice", deadline="Friday", priority="high")
        assert item.task == "Build API"
        assert item.priority == "high"


class TestTranscriptInput:
    def test_valid_input(self):
        t = TranscriptInput(transcript="Hello world")
        assert t.transcript == "Hello world"
        assert t.language == "mixed"  # default

    def test_empty_transcript_rejected(self):
        with pytest.raises(ValidationError):
            TranscriptInput(transcript="")

    def test_valid_languages(self):
        for lang in ("en", "id", "mixed"):
            t = TranscriptInput(transcript="test", language=lang)
            assert t.language == lang

    def test_invalid_language_rejected(self):
        with pytest.raises(ValidationError):
            TranscriptInput(transcript="test", language="fr")

    def test_optional_title(self):
        t = TranscriptInput(transcript="test", title="My Meeting")
        assert t.title == "My Meeting"

    def test_title_defaults_to_none(self):
        t = TranscriptInput(transcript="test")
        assert t.title is None

    def test_max_length_enforced(self):
        with pytest.raises(ValidationError):
            TranscriptInput(transcript="x" * 500001)

    def test_at_max_length_ok(self):
        t = TranscriptInput(transcript="x" * 500000)
        assert len(t.transcript) == 500000
