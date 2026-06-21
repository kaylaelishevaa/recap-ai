from app.utils.prompts import (
    SYSTEM_PROMPT_EN,
    SYSTEM_PROMPT_ID,
    SYSTEM_PROMPT_MIXED,
    get_system_prompt,
)


class TestGetSystemPrompt:
    def test_english(self):
        prompt = get_system_prompt("en")
        assert prompt is SYSTEM_PROMPT_EN
        assert "meeting notes assistant" in prompt

    def test_indonesian(self):
        prompt = get_system_prompt("id")
        assert prompt is SYSTEM_PROMPT_ID
        assert "asisten notulen rapat" in prompt

    def test_mixed(self):
        prompt = get_system_prompt("mixed")
        assert prompt is SYSTEM_PROMPT_MIXED
        assert "bilingual" in prompt
        assert "code-switching" in prompt

    def test_unknown_defaults_to_english(self):
        prompt = get_system_prompt("fr")
        assert prompt is SYSTEM_PROMPT_EN

    def test_default_is_english(self):
        prompt = get_system_prompt()
        assert prompt is SYSTEM_PROMPT_EN

    def test_all_prompts_request_json(self):
        for lang in ("en", "id", "mixed"):
            prompt = get_system_prompt(lang)
            assert "JSON" in prompt
            assert "keyDecisions" in prompt
            assert "actionItems" in prompt
            assert "followUpRecommendations" in prompt

    def test_all_prompts_have_priority_rules(self):
        for lang in ("en", "id", "mixed"):
            prompt = get_system_prompt(lang)
            assert "high" in prompt
            assert "medium" in prompt
            assert "low" in prompt
