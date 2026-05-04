"""Seed the database by restoring the latest backup."""

import os

from src_back.app import create_app, db

BACKUP_DIR = os.path.join(os.path.dirname(__file__), "..", "backups")


def _latest_backup() -> str:
    """Return the path to the most recent .sql backup file.

    Raises:
        FileNotFoundError: If no backup files exist in BACKUP_DIR.
    """
    if os.path.isdir(BACKUP_DIR):
        files = sorted(f for f in os.listdir(BACKUP_DIR) if f.endswith(".sql"))
        if files:
            return os.path.join(BACKUP_DIR, files[-1])
    raise FileNotFoundError(
        f'No backup files found in {BACKUP_DIR}. Run "npm run db:backup" first.'
    )


def _restore_backup(backup_path: str) -> None:
    """Execute a pg_dump plain-SQL backup file via psycopg2.

    Args:
        backup_path: Absolute path to the .sql file to restore.
    """
    with open(backup_path) as f:
        sql = "\n".join(line for line in f if not line.startswith("\\"))
    conn = db.engine.raw_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
    finally:
        conn.close()
    print(f"Database restored from {os.path.basename(backup_path)}.")


def seed() -> None:
    """Restore the database from the latest backup if it is empty."""
    from src_back.models import Pony

    if Pony.query.first() is not None:
        return
    _restore_backup(_latest_backup())


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed()
