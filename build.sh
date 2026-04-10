#!/bin/bash
# Render deployment script for backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Run database migrations
flask db upgrade

# Start the application
gunicorn -w 4 -b 0.0.0.0:$PORT app:app
