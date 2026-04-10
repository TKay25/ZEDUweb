#!/usr/bin/env python
import os
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app import create_app, db

if __name__ == '__main__':
    app = create_app(os.getenv('FLASK_ENV', 'production'))
    
    # Run migrations
    with app.app_context():
        db.create_all()
    
    app.run()
