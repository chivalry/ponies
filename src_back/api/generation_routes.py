"""Routes for Generation model."""

from flask import Blueprint, jsonify, request

from src_back.app import db
from src_back.models import Generation, Pony
from src_back.utils import bad_request, not_found

generation_bp = Blueprint("generation", __name__, url_prefix="/api/generations")


@generation_bp.route("/", methods=["GET"])
def list_generations():
    """Return a list of all generations as JSON."""
    generations = Generation.query.all()
    return jsonify([g.to_dict() for g in generations])


@generation_bp.route("/", methods=["POST"])
def create_generation():
    """Create a new generation."""
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    if not name:
        return bad_request("name is required")
    generation = Generation(name=name)
    db.session.add(generation)
    db.session.commit()
    return jsonify(generation.to_dict()), 201


@generation_bp.route("/<int:id>/", methods=["GET"])
def get_generation(id):
    """Return a generation by ID as JSON, or 404 if not found."""
    generation = db.session.get(Generation, id)
    if not generation:
        return not_found("Generation", id)
    return jsonify(generation.to_dict())


@generation_bp.route("/<int:id>/", methods=["PUT"])
def update_generation(id):
    """Update a generation's name by ID."""
    generation = db.session.get(Generation, id)
    if not generation:
        return not_found("Generation", id)
    data = request.get_json(silent=True) or {}
    if "name" in data:
        generation.name = data["name"]
    db.session.commit()
    return jsonify(generation.to_dict())


@generation_bp.route("/<int:id>/", methods=["DELETE"])
def delete_generation(id):
    """Delete a generation by ID. Ponies in this generation have generation_id nulled."""
    generation = db.session.get(Generation, id)
    if not generation:
        return not_found("Generation", id)
    db.session.delete(generation)
    db.session.commit()
    return "", 204


@generation_bp.route("/<int:id>/ponies/", methods=["GET"])
def list_generation_ponies(id):
    """Return all ponies belonging to a generation."""
    generation = db.session.get(Generation, id)
    if not generation:
        return not_found("Generation", id)
    sort = request.args.get("sort", "created_asc")
    order_map = {
        "name_asc": Pony.name.asc(),
        "name_desc": Pony.name.desc(),
        "created_asc": Pony.created_timestamp.asc(),
        "created_desc": Pony.created_timestamp.desc(),
    }
    order = order_map.get(sort, Pony.created_timestamp.asc())
    ponies = Pony.query.filter_by(generation_id=id).order_by(order).all()
    return jsonify([p.to_dict() for p in ponies])
