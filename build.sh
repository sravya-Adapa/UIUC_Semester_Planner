#!/bin/bash
set -o errexit

# Install Python dependencies
pip install --upgrade pip setuptools wheel
pip install -r back-end/requirements.txt

# Optional: Run any database migrations or other setup here
# python back-end/db_scripts/db_import.py
