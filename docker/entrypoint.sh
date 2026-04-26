#!/bin/sh

set -e
until flask db upgrade; do
  echo "Database not ready, retrying in 2s..."
  sleep 2
done
python -m src_back.seed
gunicorn --bind 0.0.0.0:5000 --reload src_back.app:app
