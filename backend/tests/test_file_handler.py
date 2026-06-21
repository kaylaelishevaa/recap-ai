from app.services.file_handler import ALLOWED_EXTENSIONS, MAX_FILE_SIZE


class TestFileHandlerConstants:
    def test_allowed_extensions(self):
        expected = {".mp3", ".mp4", ".wav", ".webm", ".m4a", ".ogg"}
        assert ALLOWED_EXTENSIONS == expected

    def test_max_file_size(self):
        assert MAX_FILE_SIZE == 200 * 1024 * 1024  # 200MB
