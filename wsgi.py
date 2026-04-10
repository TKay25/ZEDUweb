"""
WSGI entry point for Gunicorn
"""
import os
from dotenv import load_dotenv

# Load environment variables early
load_dotenv()

from zedu import create_app

# Create app instance - database initialization deferred to first request
app = create_app(os.getenv('FLASK_ENV', 'production'))


