"""Initial schema

Revision ID: 0001
Revises:
Create Date: 2026-04-21

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = '0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'ponies',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(80), nullable=False),
        sa.Column('image_path', sa.String(255)),
        sa.Column('uuid', sa.String(36), nullable=False, unique=True),
        sa.Column('created_timestamp', sa.DateTime, nullable=False),
        sa.Column('modified_timestamp', sa.DateTime, nullable=False),
    )

    op.create_table(
        'hobbies',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(80), nullable=False),
        sa.Column(
            'pony_id',
            sa.Integer,
            sa.ForeignKey('ponies.id'),
            nullable=False,
        ),
        sa.Column('uuid', sa.String(36), nullable=False, unique=True),
        sa.Column('created_timestamp', sa.DateTime, nullable=False),
        sa.Column('modified_timestamp', sa.DateTime, nullable=False),
    )

    op.create_table(
        'friendships',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('uuid', sa.String(36), nullable=False, unique=True),
        sa.Column('created_timestamp', sa.DateTime, nullable=False),
        sa.Column('modified_timestamp', sa.DateTime, nullable=False),
    )

    op.create_table(
        'friendship_hobbies',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column(
            'friendship_id',
            sa.Integer,
            sa.ForeignKey('friendships.id'),
            nullable=False,
        ),
        sa.Column(
            'hobby_id',
            sa.Integer,
            sa.ForeignKey('hobbies.id'),
            nullable=False,
        ),
        sa.Column('uuid', sa.String(36), nullable=False, unique=True),
        sa.Column('created_timestamp', sa.DateTime, nullable=False),
        sa.Column('modified_timestamp', sa.DateTime, nullable=False),
    )

    op.create_table(
        'pony_friendships',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column(
            'friendship_id',
            sa.Integer,
            sa.ForeignKey('friendships.id'),
            nullable=False,
        ),
        sa.Column(
            'pony_id',
            sa.Integer,
            sa.ForeignKey('ponies.id'),
            nullable=False,
        ),
        sa.Column('uuid', sa.String(36), nullable=False, unique=True),
        sa.Column('created_timestamp', sa.DateTime, nullable=False),
        sa.Column('modified_timestamp', sa.DateTime, nullable=False),
    )


def downgrade() -> None:
    op.drop_table('pony_friendships')
    op.drop_table('friendship_hobbies')
    op.drop_table('friendships')
    op.drop_table('hobbies')
    op.drop_table('ponies')
