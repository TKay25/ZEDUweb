"""
WSGI entry point for production deployment
"""
from backend.app import create_app, db

app = create_app('production')

# Initialize database tables on startup
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run()
