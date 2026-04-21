from app import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class HousekeepingMixin:
    uuid = db.Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    created_by = db.Column(db.String, nullable=True)
    created_timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    modified_by = db.Column(db.String, nullable=True)
    modified_timestamp = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Pony(db.Model, HousekeepingMixin):
    __tablename__ = 'ponies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    image = db.Column(db.String, nullable=True)  # URL or path
    curr_friend_id = db.Column(db.Integer, db.ForeignKey('ponies.id'), nullable=True)
    hobbies = db.relationship('Hobby', backref='pony', lazy=True)

class Hobby(db.Model, HousekeepingMixin):
    __tablename__ = 'hobbies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    pony_id = db.Column(db.Integer, db.ForeignKey('ponies.id'), nullable=False)

class Friendship(db.Model, HousekeepingMixin):
    __tablename__ = 'friendships'
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String, nullable=False)

class FriendshipHobby(db.Model, HousekeepingMixin):
    __tablename__ = 'friendship_hobbies'
    id = db.Column(db.Integer, primary_key=True)
    friendship_id = db.Column(db.Integer, db.ForeignKey('friendships.id'), nullable=False)
    hobby_id = db.Column(db.Integer, db.ForeignKey('hobbies.id'), nullable=False)
