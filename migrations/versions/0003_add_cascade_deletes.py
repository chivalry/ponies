"""Add cascade deletes to foreign keys

Revision ID: 0003
Revises: 1aac8b3304e5
Create Date: 2026-04-23

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = '0003'
down_revision: Union[str, None] = '1aac8b3304e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # pony_hobbies: pony_id and hobby_id
    op.drop_constraint('pony_hobbies_pony_id_fkey', 'pony_hobbies', type_='foreignkey')
    op.drop_constraint('pony_hobbies_hobby_id_fkey', 'pony_hobbies', type_='foreignkey')
    op.create_foreign_key(
        'pony_hobbies_pony_id_fkey',
        'pony_hobbies', 'ponies',
        ['pony_id'], ['id'],
        ondelete='CASCADE',
    )
    op.create_foreign_key(
        'pony_hobbies_hobby_id_fkey',
        'pony_hobbies', 'hobbies',
        ['hobby_id'], ['id'],
        ondelete='CASCADE',
    )

    # friendship_hobbies: friendship_id and hobby_id
    op.drop_constraint(
        'friendship_hobbies_friendship_id_fkey',
        'friendship_hobbies',
        type_='foreignkey',
    )
    op.drop_constraint(
        'friendship_hobbies_hobby_id_fkey',
        'friendship_hobbies',
        type_='foreignkey',
    )
    op.create_foreign_key(
        'friendship_hobbies_friendship_id_fkey',
        'friendship_hobbies', 'friendships',
        ['friendship_id'], ['id'],
        ondelete='CASCADE',
    )
    op.create_foreign_key(
        'friendship_hobbies_hobby_id_fkey',
        'friendship_hobbies', 'hobbies',
        ['hobby_id'], ['id'],
        ondelete='CASCADE',
    )

    # pony_friendships: friendship_id and pony_id
    op.drop_constraint(
        'pony_friendships_friendship_id_fkey',
        'pony_friendships',
        type_='foreignkey',
    )
    op.drop_constraint(
        'pony_friendships_pony_id_fkey',
        'pony_friendships',
        type_='foreignkey',
    )
    op.create_foreign_key(
        'pony_friendships_friendship_id_fkey',
        'pony_friendships', 'friendships',
        ['friendship_id'], ['id'],
        ondelete='CASCADE',
    )
    op.create_foreign_key(
        'pony_friendships_pony_id_fkey',
        'pony_friendships', 'ponies',
        ['pony_id'], ['id'],
        ondelete='CASCADE',
    )


def downgrade() -> None:
    # pony_hobbies
    op.drop_constraint('pony_hobbies_pony_id_fkey', 'pony_hobbies', type_='foreignkey')
    op.drop_constraint('pony_hobbies_hobby_id_fkey', 'pony_hobbies', type_='foreignkey')
    op.create_foreign_key(
        'pony_hobbies_pony_id_fkey', 'pony_hobbies', 'ponies', ['pony_id'], ['id']
    )
    op.create_foreign_key(
        'pony_hobbies_hobby_id_fkey', 'pony_hobbies', 'hobbies', ['hobby_id'], ['id']
    )

    # friendship_hobbies
    op.drop_constraint(
        'friendship_hobbies_friendship_id_fkey', 'friendship_hobbies', type_='foreignkey'
    )
    op.drop_constraint(
        'friendship_hobbies_hobby_id_fkey', 'friendship_hobbies', type_='foreignkey'
    )
    op.create_foreign_key(
        'friendship_hobbies_friendship_id_fkey',
        'friendship_hobbies', 'friendships',
        ['friendship_id'], ['id'],
    )
    op.create_foreign_key(
        'friendship_hobbies_hobby_id_fkey',
        'friendship_hobbies', 'hobbies',
        ['hobby_id'], ['id'],
    )

    # pony_friendships
    op.drop_constraint(
        'pony_friendships_friendship_id_fkey', 'pony_friendships', type_='foreignkey'
    )
    op.drop_constraint(
        'pony_friendships_pony_id_fkey', 'pony_friendships', type_='foreignkey'
    )
    op.create_foreign_key(
        'pony_friendships_friendship_id_fkey',
        'pony_friendships', 'friendships',
        ['friendship_id'], ['id'],
    )
    op.create_foreign_key(
        'pony_friendships_pony_id_fkey',
        'pony_friendships', 'ponies',
        ['pony_id'], ['id'],
    )
