"""Routes for PonyFriendship model."""

from flask import Blueprint, jsonify, request

from src_back.app import db
from src_back.models import Friendship, Pony, PonyFriendship
from src_back.utils import bad_request, not_found

pony_friendship_bp = Blueprint(
    "pony_friendship", __name__, url_prefix="/api/pony_friendships"
)


@pony_friendship_bp.route("/", methods=["GET"])
def list_pony_friendships():
    """
    Return a list of all pony-friendship assignments as JSON.

    Returns:
        Response: Flask JSON response containing all pony-friendship assignments.
    """
    pfs = PonyFriendship.query.all()
    return jsonify([pf.to_dict() for pf in pfs])


@pony_friendship_bp.route("/", methods=["POST"])
def create_pony_friendship():
    """
    Create a new pony-friendship assignment.

    Returns:
        Response: Flask JSON response with the created assignment and status 201,
        or error response if validation fails.
    """
    data = request.get_json(silent=True) or {}
    friendship_id = data.get("friendship_id")
    pony_id = data.get("pony_id")
    if not friendship_id:
        return bad_request("friendship_id is required")
    if not pony_id:
        return bad_request("pony_id is required")
    if not Friendship.query.get(friendship_id):
        return not_found("Friendship", friendship_id)
    if not Pony.query.get(pony_id):
        return not_found("Pony", pony_id)
    pf = PonyFriendship(friendship_id=friendship_id, pony_id=pony_id)
    db.session.add(pf)
    db.session.commit()
    return jsonify(pf.to_dict()), 201


@pony_friendship_bp.route("/<int:id>/", methods=["DELETE"])
def delete_pony_friendship(id):
    """
    Delete a pony-friendship assignment by ID.

    Args:
        id (int): The ID of the pony-friendship assignment.

    Returns:
        Response: Empty response with status 204 or 404 error.
    """
    pf = PonyFriendship.query.get(id)
    if not pf:
        return not_found("PonyFriendship", id)
    db.session.delete(pf)
    db.session.commit()
    return "", 204
