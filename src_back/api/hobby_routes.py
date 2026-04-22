"""Routes for Hobby model."""

from flask import Blueprint, jsonify, request

from src_back.app import db
from src_back.models import Hobby

from .utils import bad_request, not_found

hobby_bp = Blueprint("hobby", __name__, url_prefix="/api/hobbies")


@hobby_bp.route("/", methods=["GET"])
def list_hobbies():
    """
    Return a list of all hobbies as JSON.

    Returns:
        Response: Flask JSON response containing all hobbies.
    """
    hobbies = Hobby.query.all()
    return jsonify([h.to_dict() for h in hobbies])


@hobby_bp.route("/", methods=["POST"])
def create_hobby():
    """
    Create a new hobby.

    Returns:
        Response: Flask JSON response with the created hobby and status 201,
        or error response if validation fails.
    """
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    if not name:
        return bad_request("name is required")
    hobby = Hobby(name=name)
    db.session.add(hobby)
    db.session.commit()
    return jsonify(hobby.to_dict()), 201


@hobby_bp.route("/<int:id>/", methods=["GET"])
def get_hobby(id):
    """
    Return a hobby by ID as JSON, or 404 if not found.

    Args:
        id (int): The ID of the hobby.

    Returns:
        Response: Flask JSON response with the hobby or 404 error.
    """
    hobby = Hobby.query.get(id)
    if not hobby:
        return not_found("Hobby", id)
    return jsonify(hobby.to_dict())


@hobby_bp.route("/<int:id>/", methods=["PUT"])
def update_hobby(id):
    """
    Update a hobby's name by ID.

    Args:
        id (int): The ID of the hobby.

    Returns:
        Response: Flask JSON response with the updated hobby or 404 error.
    """
    hobby = Hobby.query.get(id)
    if not hobby:
        return not_found("Hobby", id)
    data = request.get_json(silent=True) or {}
    if "name" in data:
        hobby.name = data["name"]
    db.session.commit()
    return jsonify(hobby.to_dict())


@hobby_bp.route("/<int:id>/", methods=["DELETE"])
def delete_hobby(id):
    """
    Delete a hobby by ID.

    Args:
        id (int): The ID of the hobby.

    Returns:
        Response: Empty response with status 204 or 404 error.
    """
    hobby = Hobby.query.get(id)
    if not hobby:
        return not_found("Hobby", id)
    db.session.delete(hobby)
    db.session.commit()
    return "", 204
