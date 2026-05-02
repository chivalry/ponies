"""Add generations table and generation_id to ponies

Revision ID: 0004
Revises: 0003
Create Date: 2026-05-01

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = '0004'
down_revision: Union[str, None] = '0003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'generations',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('uuid', sa.String(length=36), nullable=False),
        sa.Column('created_timestamp', sa.DateTime(), nullable=False),
        sa.Column('modified_timestamp', sa.DateTime(), nullable=False),
        sa.Column('name', sa.String(length=80), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('uuid'),
    )
    op.add_column('ponies', sa.Column('generation_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'ponies_generation_id_fkey',
        'ponies', 'generations',
        ['generation_id'], ['id'],
        ondelete='SET NULL',
    )


def downgrade() -> None:
    op.drop_constraint('ponies_generation_id_fkey', 'ponies', type_='foreignkey')
    op.drop_column('ponies', 'generation_id')
    op.drop_table('generations')
