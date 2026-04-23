#!/bin/sh
set -e
flask db upgrade
python -m src_back.seed
gunicorn --bind 0.0.0.0:5000 --reload src_back.app:app
