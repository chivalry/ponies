"""Routes for FriendshipHobby model."""

from flask import Blueprint, jsonify, request

from src_back.app import db
from src_back.models import Friendship, FriendshipHobby, Hobby
from src_back.utils import bad_request, not_found

friendship_hobby_bp = Blueprint(
    "friendship_hobby", __name__, url_prefix="/api/friendship_hobbies"
)


@friendship_hobby_bp.route("/", methods=["GET"])
def list_friendship_hobbies():
    """
    Return a list of all friendship-hobby assignments as JSON.

    Returns:
        Response: Flask JSON response containing all friendship-hobby assignments.
    """
    fhs = FriendshipHobby.query.all()
    return jsonify([fh.to_dict() for fh in fhs])


@friendship_hobby_bp.route("/", methods=["POST"])
def create_friendship_hobby():
    """
    Create a new friendship-hobby assignment.

    Returns:
        Response: Flask JSON response with the created assignment and status 201,
        or error response if validation fails.
    """
    data = request.get_json(silent=True) or {}
    friendship_id = data.get("friendship_id")
    hobby_id = data.get("hobby_id")
    if not friendship_id:
        return bad_request("friendship_id is required")
    if not hobby_id:
        return bad_request("hobby_id is required")
    if not Friendship.query.get(friendship_id):
        return not_found("Friendship", friendship_id)
    if not Hobby.query.get(hobby_id):
        return not_found("Hobby", hobby_id)
    fh = FriendshipHobby(friendship_id=friendship_id, hobby_id=hobby_id)
    db.session.add(fh)
    db.session.commit()
    return jsonify(fh.to_dict()), 201


@friendship_hobby_bp.route("/<int:id>/", methods=["GET"])
def get_friendship_hobby(id):
    """
    Return a friendship-hobby assignment by ID as JSON, or 404 if not found.

    Args:
        id (int): The ID of the friendship-hobby assignment.

    Returns:
        Response: Flask JSON response with the assignment or 404 error.
    """
    fh = FriendshipHobby.query.get(id)
    if not fh:
        return not_found("FriendshipHobby", id)
    return jsonify(fh.to_dict())


@friendship_hobby_bp.route("/<int:id>/", methods=["PUT"])
def update_friendship_hobby(id):
    """
    Update the hobby for a friendship-hobby assignment by ID.

    Args:
        id (int): The ID of the friendship-hobby assignment.

    Returns:
        Response: Flask JSON response with the updated assignment or 404 error.
    """
    fh = FriendshipHobby.query.get(id)
    if not fh:
        return not_found("FriendshipHobby", id)
    data = request.get_json(silent=True) or {}
    if "hobby_id" in data:
        if not Hobby.query.get(data["hobby_id"]):
            return not_found("Hobby", data["hobby_id"])
        fh.hobby_id = data["hobby_id"]
    db.session.commit()
    return jsonify(fh.to_dict())


@friendship_hobby_bp.route("/<int:id>/", methods=["DELETE"])
def delete_friendship_hobby(id):
    """
    Delete a friendship-hobby assignment by ID.

    Args:
        id (int): The ID of the friendship-hobby assignment.

    Returns:
        Response: Empty response with status 204 or 404 error.
    """
    fh = FriendshipHobby.query.get(id)
    if not fh:
        return not_found("FriendshipHobby", id)
    db.session.delete(fh)
    db.session.commit()
    return "", 204
