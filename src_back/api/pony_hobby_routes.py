"""Routes for PonyHobby model."""

from flask import Blueprint, jsonify, request

from src_back.app import db
from src_back.models import Hobby, Pony, PonyHobby
from src_back.utils import bad_request, not_found

pony_hobby_bp = Blueprint("pony_hobby", __name__, url_prefix="/api/pony_hobbies")


@pony_hobby_bp.route("/", methods=["GET"])
def list_pony_hobbies_all():
    """
    Return a list of all pony-hobby assignments as JSON.

    Returns:
        Response: Flask JSON response containing all pony-hobby assignments.
    """
    pony_id = request.args.get("pony_id", type=int)
    query = PonyHobby.query
    if pony_id is not None:
        query = query.filter_by(pony_id=pony_id)
    phs = query.all()
    return jsonify([ph.to_dict() for ph in phs])


@pony_hobby_bp.route("/", methods=["POST"])
def create_pony_hobby():
    """
    Create a new pony-hobby assignment, or return 409 if already exists.

    Returns:
        Response: Flask JSON response with the created assignment and status 201,
        or error response if validation fails or assignment exists.
    """
    data = request.get_json(silent=True) or {}
    pony_id = data.get("pony_id")
    hobby_id = data.get("hobby_id")
    if not pony_id:
        return bad_request("pony_id is required")
    if not hobby_id:
        return bad_request("hobby_id is required")
    if not Pony.query.get(pony_id):
        return not_found("Pony", pony_id)
    if not Hobby.query.get(hobby_id):
        return not_found("Hobby", hobby_id)
    existing = PonyHobby.query.filter_by(pony_id=pony_id, hobby_id=hobby_id).first()
    if existing:
        return jsonify({"error": "Hobby already assigned to this pony"}), 409
    ph = PonyHobby(pony_id=pony_id, hobby_id=hobby_id)
    db.session.add(ph)
    db.session.commit()
    return jsonify(ph.to_dict()), 201


@pony_hobby_bp.route("/<int:id>/", methods=["DELETE"])
def delete_pony_hobby(id):
    """
    Delete a pony-hobby assignment by ID.

    Args:
        id (int): The ID of the pony-hobby assignment.

    Returns:
        Response: Empty response with status 204 or 404 error.
    """
    ph = PonyHobby.query.get(id)
    if not ph:
        return not_found("PonyHobby", id)
    db.session.delete(ph)
    db.session.commit()
    return "", 204
