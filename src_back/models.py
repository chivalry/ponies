from src_back.app import db
from src_back.utils import now, uuid


class BaseMixin:
    """Mixin providing id, uuid, and timestamp columns shared by all models."""

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uuid = db.Column(db.String(36), nullable=False, unique=True, default=uuid)
    created_timestamp = db.Column(db.DateTime, nullable=False, default=now)
    modified_timestamp = db.Column(db.DateTime, nullable=False, default=now, onupdate=now)

    def base_dict(self):
        """Return a dict of the shared base fields."""
        return {
            "id": self.id,
            "uuid": self.uuid,
            "created_timestamp": self.created_timestamp.isoformat(),
            "modified_timestamp": self.modified_timestamp.isoformat(),
        }


class Pony(BaseMixin, db.Model):
    """A pony with an optional image and associated hobbies and friendships."""

    __tablename__ = "ponies"
    name = db.Column(db.String(80), nullable=False)
    image_path = db.Column(db.String(255))
    pony_hobbies = db.relationship(
        "PonyHobby", backref="pony", lazy=True, cascade="all, delete-orphan"
    )
    pony_friendships = db.relationship(
        "PonyFriendship", backref="pony", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        """Return a dict representation of this pony."""
        return {**self.base_dict(), "name": self.name, "image_path": self.image_path}


class Hobby(BaseMixin, db.Model):
    """A hobby that can be associated with ponies and friendships."""

    __tablename__ = "hobbies"
    name = db.Column(db.String(80), nullable=False)
    friendship_hobbies = db.relationship(
        "FriendshipHobby", backref="hobby", lazy=True, cascade="all, delete-orphan"
    )
    hobby_hobbies = db.relationship(
        "PonyHobby", backref="hobby", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        """Return a dict representation of this hobby."""
        return {**self.base_dict(), "name": self.name}


class Friendship(BaseMixin, db.Model):
    """A friendship between exactly two ponies, optionally sharing hobbies."""

    __tablename__ = "friendships"
    friendship_hobbies = db.relationship(
        "FriendshipHobby",
        backref="friendship",
        lazy=True,
        cascade="all, delete-orphan",
    )
    pony_friendships = db.relationship(
        "PonyFriendship",
        backref="friendship",
        lazy=True,
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        """Return a dict representation of this friendship."""
        return self.base_dict()


class FriendshipHobby(BaseMixin, db.Model):
    """Join table associating a friendship with a hobby."""

    __tablename__ = "friendship_hobbies"
    friendship_id = db.Column(
        db.Integer, db.ForeignKey("friendships.id", ondelete="CASCADE"), nullable=False
    )
    hobby_id = db.Column(
        db.Integer, db.ForeignKey("hobbies.id", ondelete="CASCADE"), nullable=False
    )

    def to_dict(self):
        """Return a dict representation of this friendship-hobby association."""
        return {
            **self.base_dict(),
            "friendship_id": self.friendship_id,
            "hobby_id": self.hobby_id,
        }


class PonyHobby(BaseMixin, db.Model):
    """Join table associating a pony with a hobby."""

    __tablename__ = "pony_hobbies"
    __table_args__ = (db.UniqueConstraint("pony_id", "hobby_id"),)
    pony_id = db.Column(
        db.Integer, db.ForeignKey("ponies.id", ondelete="CASCADE"), nullable=False
    )
    hobby_id = db.Column(
        db.Integer, db.ForeignKey("hobbies.id", ondelete="CASCADE"), nullable=False
    )

    def to_dict(self):
        """Return a dict representation of this pony-hobby association."""
        return {**self.base_dict(), "pony_id": self.pony_id, "hobby_id": self.hobby_id}


class PonyFriendship(BaseMixin, db.Model):
    """Join table associating a pony with a friendship."""

    __tablename__ = "pony_friendships"
    friendship_id = db.Column(
        db.Integer, db.ForeignKey("friendships.id", ondelete="CASCADE"), nullable=False
    )
    pony_id = db.Column(
        db.Integer, db.ForeignKey("ponies.id", ondelete="CASCADE"), nullable=False
    )

    def to_dict(self):
        """Return a dict representation of this pony-friendship association."""
        return {
            **self.base_dict(),
            "friendship_id": self.friendship_id,
            "pony_id": self.pony_id,
        }
