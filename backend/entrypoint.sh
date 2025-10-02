#!/usr/bin/env sh
set -e

python -m db.create_db

exec python -m uvicorn main:app --host 0.0.0.0 --port 8079 --workers 2
