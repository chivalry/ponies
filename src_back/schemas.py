from marshmallow import Schema, fields, validate


class PonySchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=80))


class HobbySchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=80))
    pony_id = fields.Int(required=True)


class FriendshipSchema(Schema):
    pony_ids = fields.List(
        fields.Int(), required=True, validate=validate.Length(equal=2)
    )


class FriendshipHobbySchema(Schema):
    friendship_id = fields.Int(required=True)
    hobby_id = fields.Int(required=True)


class PonyFriendshipSchema(Schema):
    friendship_id = fields.Int(required=True)
    pony_id = fields.Int(required=True)
