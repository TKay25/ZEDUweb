"""
Database helper utilities for ZEDU
"""
import os
from flask_sqlalchemy import SQLAlchemy
from contextlib import contextmanager

# Initialize SQLAlchemy
db = SQLAlchemy()


def init_db(app):
    """Initialize database with app"""
    db.init_app(app)
    with app.app_context():
        db.create_all()


@contextmanager
def get_db_session():
    """Context manager for database sessions"""
    session = db.session
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()
