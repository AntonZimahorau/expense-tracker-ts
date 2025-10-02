#!/bin/sh

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export PYTHONPATH="$PWD:src"
python3 -m db.create_db
python3 -m uvicorn --app-dir src main:app --reload --port 8079
