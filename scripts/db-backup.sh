#!/bin/sh
set -e

row_count=$(docker compose exec -T db psql -U pony -d ponies -tAc \
    "SELECT COALESCE(SUM(n_live_tup), 0) FROM pg_stat_user_tables")

if [ "$row_count" -eq 0 ]; then
    echo "Warning: database is empty — backup skipped." >&2
    exit 0
fi

mkdir -p backups
docker compose exec -T db pg_dump -U pony -d ponies \
    --no-owner --no-acl --data-only --inserts \
    --exclude-table=alembic_version -F p > backups/backup.sql
echo "Backup saved."
