import os
from unittest.mock import MagicMock, patch

import pytest

from src_back.utils import (
    MAX_IMAGE_BYTES,
    allowed_file,
    delete_upload,
    save_image_from_url,
)


def test_allowed_file_valid_extensions():
    for ext in ("png", "jpg", "jpeg", "gif", "webp"):
        assert allowed_file(f"image.{ext}") is True


def test_allowed_file_invalid_extension():
    assert allowed_file("document.txt") is False
    assert allowed_file("archive.pdf") is False


def test_allowed_file_no_extension():
    assert allowed_file("imagewithoutextension") is False


def test_delete_upload_no_path(tmp_path):
    delete_upload("", str(tmp_path))


def test_delete_upload_missing_file(tmp_path):
    delete_upload("uploads/nonexistent.png", str(tmp_path))


def test_delete_upload_removes_file(tmp_path):
    f = tmp_path / "test.png"
    f.write_bytes(b"data")
    delete_upload("uploads/test.png", str(tmp_path))
    assert not f.exists()


def _mock_response(content_type="image/png", content=b"fakeimage", content_length=None):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.raise_for_status = MagicMock()
    headers = {"Content-Type": content_type}
    if content_length is not None:
        headers["Content-Length"] = str(content_length)
    mock_resp.headers = headers
    mock_resp.iter_content = MagicMock(return_value=iter([content]))
    return mock_resp


def test_save_image_from_url_bad_scheme(tmp_path):
    with pytest.raises(ValueError, match="http or https"):
        save_image_from_url("ftp://example.com/image.png", str(tmp_path))


def test_save_image_from_url_unsupported_content_type(tmp_path):
    mock_resp = _mock_response(content_type="text/html", content=b"<html>")
    with patch("requests.Session.get", return_value=mock_resp):
        with pytest.raises(ValueError, match="supported image type"):
            save_image_from_url("http://example.com/page", str(tmp_path))


def test_save_image_from_url_content_length_too_large(tmp_path):
    too_large = MAX_IMAGE_BYTES + 1
    mock_resp = _mock_response(content_length=too_large)
    with patch("requests.Session.get", return_value=mock_resp):
        with pytest.raises(ValueError, match="10 MB limit"):
            save_image_from_url("http://example.com/image.png", str(tmp_path))


def test_save_image_from_url_streaming_too_large(tmp_path):
    chunk = b"x" * (MAX_IMAGE_BYTES + 1)
    mock_resp = _mock_response(content=chunk)
    with patch("requests.Session.get", return_value=mock_resp):
        with pytest.raises(ValueError, match="10 MB limit"):
            save_image_from_url("http://example.com/image.png", str(tmp_path))


def test_save_image_from_url_success(tmp_path):
    mock_resp = _mock_response(content=b"PNG_DATA")
    with patch("requests.Session.get", return_value=mock_resp):
        result = save_image_from_url("http://example.com/image.png", str(tmp_path))
    assert result.startswith("uploads/")
    assert result.endswith(".png")
    saved = tmp_path / os.path.basename(result)
    assert saved.exists()
    assert saved.read_bytes() == b"PNG_DATA"
