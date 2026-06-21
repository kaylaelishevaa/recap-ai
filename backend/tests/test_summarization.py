import json

import pytest

from app.services.summarization import (
    _normalize_action_item,
    _normalize_result,
    _parse_json_response,
)


class TestParseJsonResponse:
    def test_plain_json(self):
        raw = '{"title": "Test Meeting"}'
        result = _parse_json_response(raw)
        assert result["title"] == "Test Meeting"

    def test_json_with_markdown_fences(self):
        raw = '```json\n{"title": "Fenced"}\n```'
        result = _parse_json_response(raw)
        assert result["title"] == "Fenced"

    def test_json_with_bare_fences(self):
        raw = '```\n{"title": "Bare"}\n```'
        result = _parse_json_response(raw)
        assert result["title"] == "Bare"

    def test_json_with_whitespace(self):
        raw = '  \n  {"title": "Padded"}  \n  '
        result = _parse_json_response(raw)
        assert result["title"] == "Padded"

    def test_invalid_json_raises(self):
        with pytest.raises(json.JSONDecodeError):
            _parse_json_response("not json at all")

    def test_empty_string_raises(self):
        with pytest.raises(json.JSONDecodeError):
            _parse_json_response("")


class TestNormalizeActionItem:
    def test_new_format_with_responsible(self):
        item = {"task": "Do X", "responsible": "Alice", "deadline": "Friday", "priority": "high"}
        result = _normalize_action_item(item)
        assert result["assignee"] == "Alice"
        assert result["priority"] == "high"
        assert "responsible" not in result

    def test_old_format_with_assignee(self):
        item = {"task": "Do Y", "assignee": "Bob", "deadline": "TBD"}
        result = _normalize_action_item(item)
        assert result["assignee"] == "Bob"
        assert result["priority"] == "medium"  # default

    def test_missing_fields_get_defaults(self):
        item = {"task": "Do Z"}
        result = _normalize_action_item(item)
        assert result["assignee"] == "TBD"
        assert result["deadline"] == "TBD"
        assert result["priority"] == "medium"

    def test_empty_item(self):
        result = _normalize_action_item({})
        assert result["task"] == ""
        assert result["assignee"] == "TBD"


class TestNormalizeResult:
    def test_new_prompt_keys(self):
        raw = {
            "title": "Sprint Planning",
            "summary": "We planned things",
            "keyDecisions": ["Use React", "Deploy Friday"],
            "actionItems": [
                {"task": "Build UI", "responsible": "Alice", "deadline": "Mon", "priority": "high"}
            ],
            "followUpRecommendations": ["Review next week"],
        }
        result = _normalize_result(raw)
        assert result["title"] == "Sprint Planning"
        assert result["decisions"] == ["Use React", "Deploy Friday"]
        assert result["action_items"][0]["assignee"] == "Alice"
        assert result["action_items"][0]["priority"] == "high"
        assert result["follow_ups"] == ["Review next week"]

    def test_old_prompt_keys(self):
        raw = {
            "title": "Old Meeting",
            "summary": "Old format",
            "decisions": ["Decision A"],
            "action_items": [{"task": "Task A", "assignee": "Bob", "deadline": "TBD"}],
            "follow_ups": ["Follow up A"],
            "sentiment": "Positive",
        }
        result = _normalize_result(raw)
        assert result["decisions"] == ["Decision A"]
        assert result["action_items"][0]["assignee"] == "Bob"
        assert result["follow_ups"] == ["Follow up A"]
        assert result["sentiment"] == "Positive"

    def test_missing_keys_get_defaults(self):
        result = _normalize_result({})
        assert result["title"] == "Untitled Meeting"
        assert result["summary"] == ""
        assert result["decisions"] == []
        assert result["action_items"] == []
        assert result["follow_ups"] == []

    def test_empty_action_items(self):
        raw = {
            "title": "T",
            "summary": "S",
            "keyDecisions": [],
            "actionItems": [],
            "followUpRecommendations": [],
        }
        result = _normalize_result(raw)
        assert result["action_items"] == []
