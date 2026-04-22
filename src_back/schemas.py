from marshmallow import Schema, fields, validate


class PonySchema(Schema):
    """Validation schema for creating a pony."""

    name = fields.Str(required=True, validate=validate.Length(min=1, max=80))


class HobbySchema(Schema):
    """Validation schema for creating a hobby."""

    name = fields.Str(required=True, validate=validate.Length(min=1, max=80))
    pony_id = fields.Int(required=True)


class FriendshipSchema(Schema):
    """Validation schema for creating a friendship between exactly two ponies."""

    pony_ids = fields.List(fields.Int(), required=True, validate=validate.Length(equal=2))


class FriendshipHobbySchema(Schema):
    """Validation schema for associating a hobby with a friendship."""

    friendship_id = fields.Int(required=True)
    hobby_id = fields.Int(required=True)


class PonyFriendshipSchema(Schema):
    """Validation schema for associating a pony with a friendship."""

    friendship_id = fields.Int(required=True)
    pony_id = fields.Int(required=True)
