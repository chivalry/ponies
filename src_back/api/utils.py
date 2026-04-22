"""Utility functions and constants for API routes."""

import os
import uuid

import requests as http_requests
from flask import jsonify
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
CONTENT_TYPE_TO_EXT = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
}
MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB


def allowed_file(filename):
    """
    Check if the filename has an allowed image extension.

    Args:
        filename (str): The name of the file to check.

    Returns:
        bool: True if the file extension is allowed, False otherwise.
    """
    return "." in filename and filename.rsplit(".", 1)[1].lower() in (ALLOWED_EXTENSIONS)


def not_found(resource, id_):
    """
    Return a 404 JSON error for a missing resource.

    Args:
        resource (str): The resource type (e.g., 'Pony').
        id_ (Any): The identifier of the missing resource.

    Returns:
        Response: Flask JSON response with 404 status code.
    """
    return jsonify({"error": f"{resource} {id_} not found"}), 404


def bad_request(msg):
    """
    Return a 400 JSON error with a custom message.

    Args:
        msg (str): The error message to include in the response.

    Returns:
        Response: Flask JSON response with 400 status code.
    """
    return jsonify({"error": msg}), 400


def save_image_from_url(url, upload_dir):
    """
    Download an image from a URL, save it to upload_dir, and return the relative path.

    The function checks the Content-Length header (if present) before downloading and
    aborts if the image exceeds MAX_IMAGE_BYTES. It also enforces the size limit during
    streaming as a fallback, ensuring no image larger than the allowed maximum is saved,
    even if the header is missing or incorrect.

    Args:
        url (str): The URL of the image to download.
        upload_dir (str): The directory to save the image in.

    Returns:
        str: The relative path to the saved image (e.g., 'uploads/filename.ext').

    Raises:
        ValueError: If the image type is not supported or the image exceeds size limits.
    """
    resp = http_requests.get(url, timeout=10, stream=True)
    resp.raise_for_status()
    content_type = resp.headers.get("Content-Type", "").split(";")[0].strip()
    ext = CONTENT_TYPE_TO_EXT.get(content_type)
    if not ext:
        raise ValueError(f"URL did not return a supported image type: {content_type}")
    content_length = resp.headers.get("Content-Length")
    if content_length is not None:
        try:
            if int(content_length) > MAX_IMAGE_BYTES:
                raise ValueError("Image exceeds 10 MB limit (Content-Length)")
        except ValueError:
            pass
    os.makedirs(upload_dir, exist_ok=True)
    filename = secure_filename(f"{uuid.uuid4()}.{ext}")
    dest = os.path.join(upload_dir, filename)
    size = 0
    with open(dest, "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192):
            size += len(chunk)
            if size > MAX_IMAGE_BYTES:
                f.close()
                os.remove(dest)
                raise ValueError("Image exceeds 10 MB limit")
            f.write(chunk)
    return f"uploads/{filename}"
