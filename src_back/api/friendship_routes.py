"""Routes for Friendship model."""

from flask import Blueprint, jsonify, request

from src_back.app import db
from src_back.models import Friendship, FriendshipHobby, Hobby, Pony, PonyFriendship

from .utils import bad_request, not_found

friendship_bp = Blueprint("friendship", __name__, url_prefix="/api/friendships")


@friendship_bp.route("/", methods=["GET"])
def list_friendships():
    """
    Return a list of all friendships as JSON.

    Returns:
        Response: Flask JSON response containing all friendships.
    """
    friendships = Friendship.query.all()
    return jsonify([f.to_dict() for f in friendships])


@friendship_bp.route("/", methods=["POST"])
def create_friendship():
    """
    Create a new friendship between two ponies.

    Returns:
        Response: Flask JSON response with the created friendship and status 201,
        or error response if validation fails.
    """
    data = request.get_json(silent=True) or {}
    pony_ids = data.get("pony_ids", [])
    if len(pony_ids) != 2:
        return bad_request("pony_ids must contain exactly 2 pony IDs")
    for pid in pony_ids:
        if not Pony.query.get(pid):
            return not_found("Pony", pid)
    friendship = Friendship()
    db.session.add(friendship)
    db.session.flush()
    for pid in pony_ids:
        pf = PonyFriendship(friendship_id=friendship.id, pony_id=pid)
        db.session.add(pf)
    db.session.commit()
    return jsonify(friendship.to_dict()), 201


@friendship_bp.route("/<int:id>/", methods=["GET"])
def get_friendship(id):
    """
    Return a friendship by ID as JSON, or 404 if not found.

    Args:
        id (int): The ID of the friendship.

    Returns:
        Response: Flask JSON response with the friendship or 404 error.
    """
    friendship = Friendship.query.get(id)
    if not friendship:
        return not_found("Friendship", id)
    return jsonify(friendship.to_dict())


@friendship_bp.route("/<int:id>/", methods=["PUT"])
def update_friendship(id):
    """
    Update a friendship by ID (no-op).

    Args:
        id (int): The ID of the friendship.

    Returns:
        Response: Flask JSON response with the updated friendship or 404 error.
    """
    friendship = Friendship.query.get(id)
    if not friendship:
        return not_found("Friendship", id)
    db.session.commit()
    return jsonify(friendship.to_dict())


@friendship_bp.route("/<int:id>/", methods=["DELETE"])
def delete_friendship(id):
    """
    Delete a friendship by ID.

    Args:
        id (int): The ID of the friendship.

    Returns:
        Response: Empty response with status 204 or 404 error.
    """
    friendship = Friendship.query.get(id)
    if not friendship:
        return not_found("Friendship", id)
    db.session.delete(friendship)
    db.session.commit()
    return "", 204


@friendship_bp.route("/<int:id>/hobbies/", methods=["POST"])
def assign_hobby_to_friendship(id):
    """Assign a hobby to a friendship by ID."""
    friendship = Friendship.query.get(id)
    if not friendship:
        return not_found("Friendship", id)
    data = request.get_json(silent=True) or {}
    hobby_id = data.get("hobby_id")
    if not hobby_id:
        return bad_request("hobby_id is required")
    if not Hobby.query.get(hobby_id):
        return not_found("Hobby", hobby_id)
    fh = FriendshipHobby(friendship_id=friendship.id, hobby_id=hobby_id)
    db.session.add(fh)
    db.session.commit()
    return jsonify(fh.to_dict()), 201
