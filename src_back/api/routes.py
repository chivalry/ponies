import os
import uuid

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from src_back.app import db
from src_back.models import (
    Friendship,
    FriendshipHobby,
    Hobby,
    Pony,
    PonyFriendship,
)

bp = Blueprint("api", __name__, url_prefix="/api")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def _allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in (ALLOWED_EXTENSIONS)


def _not_found(resource, id_):
    return jsonify({"error": f"{resource} {id_} not found"}), 404


def _bad_request(msg):
    return jsonify({"error": msg}), 400


# ── Ponies ────────────────────────────────────────────────────────────────────


@bp.route("/ponies/", methods=["GET"])
def list_ponies():
    ponies = Pony.query.all()
    return jsonify([p.to_dict() for p in ponies])


@bp.route("/ponies/", methods=["POST"])
def create_pony():
    name = request.form.get("name") or (request.get_json(silent=True) or {}).get("name")
    if not name:
        return _bad_request("name is required")

    image_path = None
    if "image" in request.files:
        file = request.files["image"]
        if file and file.filename and _allowed_file(file.filename):
            upload_dir = current_app.config["UPLOAD_FOLDER"]
            os.makedirs(upload_dir, exist_ok=True)
            ext = file.filename.rsplit(".", 1)[1].lower()
            filename = secure_filename(f"{uuid.uuid4()}.{ext}")
            dest = os.path.join(upload_dir, filename)
            file.save(dest)
            image_path = dest

    pony = Pony(name=name, image_path=image_path)
    db.session.add(pony)
    db.session.commit()
    return jsonify(pony.to_dict()), 201


@bp.route("/ponies/<int:id>/", methods=["GET"])
def get_pony(id):
    pony = Pony.query.get(id)
    if not pony:
        return _not_found("Pony", id)
    return jsonify(pony.to_dict())


@bp.route("/ponies/<int:id>/", methods=["PUT"])
def update_pony(id):
    pony = Pony.query.get(id)
    if not pony:
        return _not_found("Pony", id)

    data = request.get_json(silent=True) or {}
    if "name" in data:
        pony.name = data["name"]

    if "image" in request.files:
        file = request.files["image"]
        if file and file.filename and _allowed_file(file.filename):
            upload_dir = current_app.config["UPLOAD_FOLDER"]
            os.makedirs(upload_dir, exist_ok=True)
            ext = file.filename.rsplit(".", 1)[1].lower()
            filename = secure_filename(f"{uuid.uuid4()}.{ext}")
            dest = os.path.join(upload_dir, filename)
            file.save(dest)
            pony.image_path = dest

    db.session.commit()
    return jsonify(pony.to_dict())


@bp.route("/ponies/<int:id>/", methods=["DELETE"])
def delete_pony(id):
    pony = Pony.query.get(id)
    if not pony:
        return _not_found("Pony", id)
    db.session.delete(pony)
    db.session.commit()
    return "", 204


@bp.route("/ponies/<int:id>/hobbies/", methods=["POST"])
def assign_hobby_to_pony(id):
    pony = Pony.query.get(id)
    if not pony:
        return _not_found("Pony", id)
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    if not name:
        return _bad_request("name is required")
    hobby = Hobby(name=name, pony_id=pony.id)
    db.session.add(hobby)
    db.session.commit()
    return jsonify(hobby.to_dict()), 201


# ── Hobbies ───────────────────────────────────────────────────────────────────


@bp.route("/hobbies/", methods=["GET"])
def list_hobbies():
    hobbies = Hobby.query.all()
    return jsonify([h.to_dict() for h in hobbies])


@bp.route("/hobbies/", methods=["POST"])
def create_hobby():
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    pony_id = data.get("pony_id")
    if not name:
        return _bad_request("name is required")
    if not pony_id:
        return _bad_request("pony_id is required")
    if not Pony.query.get(pony_id):
        return _not_found("Pony", pony_id)
    hobby = Hobby(name=name, pony_id=pony_id)
    db.session.add(hobby)
    db.session.commit()
    return jsonify(hobby.to_dict()), 201


@bp.route("/hobbies/<int:id>/", methods=["GET"])
def get_hobby(id):
    hobby = Hobby.query.get(id)
    if not hobby:
        return _not_found("Hobby", id)
    return jsonify(hobby.to_dict())


@bp.route("/hobbies/<int:id>/", methods=["PUT"])
def update_hobby(id):
    hobby = Hobby.query.get(id)
    if not hobby:
        return _not_found("Hobby", id)
    data = request.get_json(silent=True) or {}
    if "name" in data:
        hobby.name = data["name"]
    db.session.commit()
    return jsonify(hobby.to_dict())


@bp.route("/hobbies/<int:id>/", methods=["DELETE"])
def delete_hobby(id):
    hobby = Hobby.query.get(id)
    if not hobby:
        return _not_found("Hobby", id)
    db.session.delete(hobby)
    db.session.commit()
    return "", 204


# ── Friendships ───────────────────────────────────────────────────────────────


@bp.route("/friendships/", methods=["GET"])
def list_friendships():
    friendships = Friendship.query.all()
    return jsonify([f.to_dict() for f in friendships])


@bp.route("/friendships/", methods=["POST"])
def create_friendship():
    data = request.get_json(silent=True) or {}
    pony_ids = data.get("pony_ids", [])
    if len(pony_ids) != 2:
        return _bad_request("pony_ids must contain exactly 2 pony IDs")
    for pid in pony_ids:
        if not Pony.query.get(pid):
            return _not_found("Pony", pid)
    friendship = Friendship()
    db.session.add(friendship)
    db.session.flush()
    for pid in pony_ids:
        pf = PonyFriendship(friendship_id=friendship.id, pony_id=pid)
        db.session.add(pf)
    db.session.commit()
    return jsonify(friendship.to_dict()), 201


@bp.route("/friendships/<int:id>/", methods=["GET"])
def get_friendship(id):
    friendship = Friendship.query.get(id)
    if not friendship:
        return _not_found("Friendship", id)
    return jsonify(friendship.to_dict())


@bp.route("/friendships/<int:id>/", methods=["PUT"])
def update_friendship(id):
    friendship = Friendship.query.get(id)
    if not friendship:
        return _not_found("Friendship", id)
    db.session.commit()
    return jsonify(friendship.to_dict())


@bp.route("/friendships/<int:id>/", methods=["DELETE"])
def delete_friendship(id):
    friendship = Friendship.query.get(id)
    if not friendship:
        return _not_found("Friendship", id)
    db.session.delete(friendship)
    db.session.commit()
    return "", 204


@bp.route("/friendships/<int:id>/hobbies/", methods=["POST"])
def assign_hobby_to_friendship(id):
    friendship = Friendship.query.get(id)
    if not friendship:
        return _not_found("Friendship", id)
    data = request.get_json(silent=True) or {}
    hobby_id = data.get("hobby_id")
    if not hobby_id:
        return _bad_request("hobby_id is required")
    if not Hobby.query.get(hobby_id):
        return _not_found("Hobby", hobby_id)
    fh = FriendshipHobby(friendship_id=friendship.id, hobby_id=hobby_id)
    db.session.add(fh)
    db.session.commit()
    return jsonify(fh.to_dict()), 201


# ── FriendshipHobbies ─────────────────────────────────────────────────────────


@bp.route("/friendship_hobbies/", methods=["GET"])
def list_friendship_hobbies():
    fhs = FriendshipHobby.query.all()
    return jsonify([fh.to_dict() for fh in fhs])


@bp.route("/friendship_hobbies/", methods=["POST"])
def create_friendship_hobby():
    data = request.get_json(silent=True) or {}
    friendship_id = data.get("friendship_id")
    hobby_id = data.get("hobby_id")
    if not friendship_id:
        return _bad_request("friendship_id is required")
    if not hobby_id:
        return _bad_request("hobby_id is required")
    if not Friendship.query.get(friendship_id):
        return _not_found("Friendship", friendship_id)
    if not Hobby.query.get(hobby_id):
        return _not_found("Hobby", hobby_id)
    fh = FriendshipHobby(friendship_id=friendship_id, hobby_id=hobby_id)
    db.session.add(fh)
    db.session.commit()
    return jsonify(fh.to_dict()), 201


@bp.route("/friendship_hobbies/<int:id>/", methods=["GET"])
def get_friendship_hobby(id):
    fh = FriendshipHobby.query.get(id)
    if not fh:
        return _not_found("FriendshipHobby", id)
    return jsonify(fh.to_dict())


@bp.route("/friendship_hobbies/<int:id>/", methods=["PUT"])
def update_friendship_hobby(id):
    fh = FriendshipHobby.query.get(id)
    if not fh:
        return _not_found("FriendshipHobby", id)
    data = request.get_json(silent=True) or {}
    if "hobby_id" in data:
        if not Hobby.query.get(data["hobby_id"]):
            return _not_found("Hobby", data["hobby_id"])
        fh.hobby_id = data["hobby_id"]
    db.session.commit()
    return jsonify(fh.to_dict())


@bp.route("/friendship_hobbies/<int:id>/", methods=["DELETE"])
def delete_friendship_hobby(id):
    fh = FriendshipHobby.query.get(id)
    if not fh:
        return _not_found("FriendshipHobby", id)
    db.session.delete(fh)
    db.session.commit()
    return "", 204


# ── PonyFriendships ───────────────────────────────────────────────────────────


@bp.route("/pony_friendships/", methods=["GET"])
def list_pony_friendships():
    pfs = PonyFriendship.query.all()
    return jsonify([pf.to_dict() for pf in pfs])


@bp.route("/pony_friendships/", methods=["POST"])
def create_pony_friendship():
    data = request.get_json(silent=True) or {}
    friendship_id = data.get("friendship_id")
    pony_id = data.get("pony_id")
    if not friendship_id:
        return _bad_request("friendship_id is required")
    if not pony_id:
        return _bad_request("pony_id is required")
    if not Friendship.query.get(friendship_id):
        return _not_found("Friendship", friendship_id)
    if not Pony.query.get(pony_id):
        return _not_found("Pony", pony_id)
    pf = PonyFriendship(friendship_id=friendship_id, pony_id=pony_id)
    db.session.add(pf)
    db.session.commit()
    return jsonify(pf.to_dict()), 201


@bp.route("/pony_friendships/<int:id>/", methods=["DELETE"])
def delete_pony_friendship(id):
    pf = PonyFriendship.query.get(id)
    if not pf:
        return _not_found("PonyFriendship", id)
    db.session.delete(pf)
    db.session.commit()
    return "", 204
