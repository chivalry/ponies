import uuid as uuid_lib
from datetime import UTC, datetime

from src_back.app import db


def _now():
    return datetime.now(UTC)


def _uuid():
    return str(uuid_lib.uuid4())


class Pony(db.Model):
    __tablename__ = "ponies"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    image_path = db.Column(db.String(255))
    uuid = db.Column(db.String(36), nullable=False, unique=True, default=_uuid)
    created_timestamp = db.Column(db.DateTime, nullable=False, default=_now)
    modified_timestamp = db.Column(
        db.DateTime, nullable=False, default=_now, onupdate=_now
    )

    pony_hobbies = db.relationship("PonyHobby", backref="pony", lazy=True)
    pony_friendships = db.relationship("PonyFriendship", backref="pony", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_path": self.image_path,
            "uuid": self.uuid,
            "created_timestamp": self.created_timestamp.isoformat(),
            "modified_timestamp": self.modified_timestamp.isoformat(),
        }


class Hobby(db.Model):
    __tablename__ = "hobbies"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    uuid = db.Column(db.String(36), nullable=False, unique=True, default=_uuid)
    created_timestamp = db.Column(db.DateTime, nullable=False, default=_now)
    modified_timestamp = db.Column(
        db.DateTime, nullable=False, default=_now, onupdate=_now
    )

    friendship_hobbies = db.relationship("FriendshipHobby", backref="hobby", lazy=True)
    hobby_hobbies = db.relationship("PonyHobby", backref="hobby", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "uuid": self.uuid,
            "created_timestamp": self.created_timestamp.isoformat(),
            "modified_timestamp": self.modified_timestamp.isoformat(),
        }


class Friendship(db.Model):
    __tablename__ = "friendships"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uuid = db.Column(db.String(36), nullable=False, unique=True, default=_uuid)
    created_timestamp = db.Column(db.DateTime, nullable=False, default=_now)
    modified_timestamp = db.Column(
        db.DateTime, nullable=False, default=_now, onupdate=_now
    )

    friendship_hobbies = db.relationship(
        "FriendshipHobby", backref="friendship", lazy=True
    )
    pony_friendships = db.relationship("PonyFriendship", backref="friendship", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "created_timestamp": self.created_timestamp.isoformat(),
            "modified_timestamp": self.modified_timestamp.isoformat(),
        }


class FriendshipHobby(db.Model):
    __tablename__ = "friendship_hobbies"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    friendship_id = db.Column(db.Integer, db.ForeignKey("friendships.id"), nullable=False)
    hobby_id = db.Column(db.Integer, db.ForeignKey("hobbies.id"), nullable=False)
    uuid = db.Column(db.String(36), nullable=False, unique=True, default=_uuid)
    created_timestamp = db.Column(db.DateTime, nullable=False, default=_now)
    modified_timestamp = db.Column(
        db.DateTime, nullable=False, default=_now, onupdate=_now
    )

    def to_dict(self):
        return {
            "id": self.id,
            "friendship_id": self.friendship_id,
            "hobby_id": self.hobby_id,
            "uuid": self.uuid,
            "created_timestamp": self.created_timestamp.isoformat(),
            "modified_timestamp": self.modified_timestamp.isoformat(),
        }


class PonyHobby(db.Model):
    __tablename__ = "pony_hobbies"
    __table_args__ = (db.UniqueConstraint("pony_id", "hobby_id"),)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pony_id = db.Column(db.Integer, db.ForeignKey("ponies.id"), nullable=False)
    hobby_id = db.Column(db.Integer, db.ForeignKey("hobbies.id"), nullable=False)
    uuid = db.Column(db.String(36), nullable=False, unique=True, default=_uuid)
    created_timestamp = db.Column(db.DateTime, nullable=False, default=_now)
    modified_timestamp = db.Column(
        db.DateTime, nullable=False, default=_now, onupdate=_now
    )

    def to_dict(self):
        return {
            "id": self.id,
            "pony_id": self.pony_id,
            "hobby_id": self.hobby_id,
            "uuid": self.uuid,
            "created_timestamp": self.created_timestamp.isoformat(),
            "modified_timestamp": self.modified_timestamp.isoformat(),
        }


class PonyFriendship(db.Model):
    __tablename__ = "pony_friendships"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    friendship_id = db.Column(db.Integer, db.ForeignKey("friendships.id"), nullable=False)
    pony_id = db.Column(db.Integer, db.ForeignKey("ponies.id"), nullable=False)
    uuid = db.Column(db.String(36), nullable=False, unique=True, default=_uuid)
    created_timestamp = db.Column(db.DateTime, nullable=False, default=_now)
    modified_timestamp = db.Column(
        db.DateTime, nullable=False, default=_now, onupdate=_now
    )

    def to_dict(self):
        return {
            "id": self.id,
            "friendship_id": self.friendship_id,
            "pony_id": self.pony_id,
            "uuid": self.uuid,
            "created_timestamp": self.created_timestamp.isoformat(),
            "modified_timestamp": self.modified_timestamp.isoformat(),
        }
