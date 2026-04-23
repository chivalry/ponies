"""Seed the database with sample data if it is empty."""

import os
import shutil
import uuid as uuid_lib

from src_back.app import create_app, db
from src_back.models import (
    Friendship,
    FriendshipHobby,
    Hobby,
    Pony,
    PonyFriendship,
    PonyHobby,
)

SEED_DIR = os.path.join(os.path.dirname(__file__), "seed_data")

PONIES = [
    {"name": "Fluttershy", "image": "fluttershy.jpg"},
    {"name": "Applejack", "image": "applejack.jpg"},
    {"name": "Twilight Sparkle", "image": "twilight_sparkle.png"},
    {"name": "Pinkie Pie", "image": "pinkie_pie.png"},
    {"name": "Rainbow Dash", "image": "rainbow_dash.png"},
    {"name": "Rarity", "image": "rarity.png"},
]

HOBBIES = [
    "Apple picking",
    "Baking",
    "Flying",
    "Gardening",
    "Makeovers",
    "Reading",
    "Singing",
    "Weather control",
]

PONY_HOBBIES = {
    "Fluttershy": ["Gardening", "Singing", "Makeovers"],
    "Applejack": ["Apple picking", "Baking", "Gardening"],
    "Twilight Sparkle": ["Reading", "Baking", "Gardening", "Singing"],
    "Pinkie Pie": ["Baking", "Singing", "Makeovers"],
    "Rainbow Dash": ["Flying", "Weather control", "Singing", "Reading"],
    "Rarity": ["Makeovers", "Singing", "Reading", "Flying"],
}

FRIENDSHIPS = [
    {"ponies": ["Fluttershy", "Rainbow Dash"], "hobbies": []},
    {"ponies": ["Fluttershy", "Rarity"], "hobbies": []},
    {"ponies": ["Fluttershy", "Applejack"], "hobbies": []},
    {"ponies": ["Rainbow Dash", "Applejack"], "hobbies": []},
    {"ponies": ["Rainbow Dash", "Twilight Sparkle"], "hobbies": []},
    {"ponies": ["Rarity", "Twilight Sparkle"], "hobbies": []},
    {"ponies": ["Rarity", "Pinkie Pie"], "hobbies": []},
    {"ponies": ["Applejack", "Pinkie Pie"], "hobbies": []},
    {"ponies": ["Twilight Sparkle", "Pinkie Pie"], "hobbies": []},
]


def _copy_image(filename: str, upload_folder: str) -> str:
    """Copy a seed image into the upload folder with a fresh UUID filename.

    Args:
        filename: Name of the source file within the seed_data directory.
        upload_folder: Destination directory for uploaded images.

    Returns:
        The relative image path suitable for storing in the database.
    """
    ext = os.path.splitext(filename)[1]
    dest_name = f"{uuid_lib.uuid4()}{ext}"
    dest_path = os.path.join(upload_folder, dest_name)
    shutil.copy(os.path.join(SEED_DIR, filename), dest_path)
    return f"uploads/{dest_name}"


def seed():
    """Insert sample ponies, hobbies, and friendships if the database is empty."""
    if Pony.query.first() is not None:
        return
    upload_folder = os.environ.get("UPLOAD_FOLDER", "src_back/uploads")
    os.makedirs(upload_folder, exist_ok=True)
    hobby_by_name = {}
    for name in HOBBIES:
        hobby = Hobby(name=name)
        db.session.add(hobby)
        hobby_by_name[name] = hobby
    pony_by_name = {}
    for p in PONIES:
        pony = Pony(
            name=p["name"],
            image_path=_copy_image(p["image"], upload_folder),
        )
        db.session.add(pony)
        pony_by_name[p["name"]] = pony
    db.session.flush()
    for pony_name, hobby_names in PONY_HOBBIES.items():
        for hobby_name in hobby_names:
            db.session.add(
                PonyHobby(
                    pony_id=pony_by_name[pony_name].id,
                    hobby_id=hobby_by_name[hobby_name].id,
                )
            )
    for f in FRIENDSHIPS:
        friendship = Friendship()
        db.session.add(friendship)
        db.session.flush()
        for pony_name in f["ponies"]:
            db.session.add(
                PonyFriendship(
                    friendship_id=friendship.id,
                    pony_id=pony_by_name[pony_name].id,
                )
            )
        for hobby_name in f["hobbies"]:
            db.session.add(
                FriendshipHobby(
                    friendship_id=friendship.id,
                    hobby_id=hobby_by_name[hobby_name].id,
                )
            )
    db.session.commit()
    print("Database seeded with sample data.")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed()
