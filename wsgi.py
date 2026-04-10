"""
WSGI entry point for Gunicorn
"""
from zedu import create_app, db

app = create_app('production')

# Ensure database is initialized
with app.app_context():
    db.create_all()


