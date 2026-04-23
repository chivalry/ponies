"""Routes for Pony model."""

import os
import uuid

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from src_back.app import db
from src_back.models import Hobby, Pony, PonyHobby
from src_back.utils import allowed_file, bad_request, not_found, save_image_from_url

pony_bp = Blueprint("pony", __name__, url_prefix="/api/ponies")


@pony_bp.route("/", methods=["GET"])
def list_ponies():
    """
    Return a list of all ponies as JSON.

    Returns:
        Response: Flask JSON response containing all ponies.
    """
    ponies = Pony.query.all()
    return jsonify([p.to_dict() for p in ponies])


@pony_bp.route("/", methods=["POST"])
def create_pony():
    """
    Create a new pony with optional image upload or image URL.

    Returns:
        Response: Flask JSON response with the created pony and status 201,
        or error response if validation fails.
    """
    name = request.form.get("name") or (request.get_json(silent=True) or {}).get("name")
    if not name:
        return bad_request("name is required")

    image_path = None
    if "image" in request.files:
        file = request.files["image"]
        if file and file.filename and allowed_file(file.filename):
            upload_dir = current_app.config["UPLOAD_FOLDER"]
            os.makedirs(upload_dir, exist_ok=True)
            ext = file.filename.rsplit(".", 1)[1].lower()
            filename = secure_filename(f"{uuid.uuid4()}.{ext}")
            dest = os.path.join(upload_dir, filename)
            file.save(dest)
            image_path = f"uploads/{filename}"
    elif image_url := (
        request.form.get("image_url")
        or (request.get_json(silent=True) or {}).get("image_url")
    ):
        try:
            upload_dir = current_app.config["UPLOAD_FOLDER"]
            image_path = save_image_from_url(image_url, upload_dir)
        except Exception as e:
            return bad_request(str(e))

    pony = Pony(name=name, image_path=image_path)
    db.session.add(pony)
    db.session.commit()
    return jsonify(pony.to_dict()), 201


@pony_bp.route("/<int:id>/", methods=["GET"])
def get_pony(id):
    """
    Return a pony by ID as JSON, or 404 if not found.

    Args:
        id (int): The ID of the pony.

    Returns:
        Response: Flask JSON response with the pony or 404 error.
    """
    pony = Pony.query.get(id)
    if not pony:
        return not_found("Pony", id)
    return jsonify(pony.to_dict())


@pony_bp.route("/<int:id>/", methods=["PUT"])
def update_pony(id):
    """Update a pony's name or image by ID."""
    pony = Pony.query.get(id)
    if not pony:
        return not_found("Pony", id)

    name = request.form.get("name") or (request.get_json(silent=True) or {}).get("name")
    if name:
        pony.name = name

    if "image" in request.files:
        file = request.files["image"]
        if file and file.filename and allowed_file(file.filename):
            upload_dir = current_app.config["UPLOAD_FOLDER"]
            os.makedirs(upload_dir, exist_ok=True)
            ext = file.filename.rsplit(".", 1)[1].lower()
            filename = secure_filename(f"{uuid.uuid4()}.{ext}")
            dest = os.path.join(upload_dir, filename)
            file.save(dest)
            pony.image_path = f"uploads/{filename}"
    elif image_url := (
        request.form.get("image_url")
        or (request.get_json(silent=True) or {}).get("image_url")
    ):
        try:
            upload_dir = current_app.config["UPLOAD_FOLDER"]
            pony.image_path = save_image_from_url(image_url, upload_dir)
        except Exception as e:
            return bad_request(str(e))

    db.session.commit()
    return jsonify(pony.to_dict())


@pony_bp.route("/<int:id>/", methods=["DELETE"])
def delete_pony(id):
    """Delete a pony by ID."""
    pony = Pony.query.get(id)
    if not pony:
        return not_found("Pony", id)
    db.session.delete(pony)
    db.session.commit()
    return "", 204


@pony_bp.route("/<int:id>/hobbies/", methods=["GET"])
def list_pony_hobbies(id):
    """Return a list of hobbies for a given pony ID."""
    pony = Pony.query.get(id)
    if not pony:
        return not_found("Pony", id)
    hobbies = Hobby.query.join(PonyHobby).filter(PonyHobby.pony_id == id).all()
    return jsonify([h.to_dict() for h in hobbies])
