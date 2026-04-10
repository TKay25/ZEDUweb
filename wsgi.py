"""
WSGI entry point for production deployment
Patches Python 3.14 typing issue before importing SQLAlchemy
"""
import sys

# Patch for Python 3.14 typing compatibility with SQLAlchemy
if sys.version_info >= (3, 14):
    import typing
    
    # Store the original method
    _original_generic_init = typing.Generic.__init_subclass__.__func__
    
    def _patched_init_subclass(cls, **kwargs):
        """Allow additional attributes in typing.Generic subclasses"""
        try:
            return _original_generic_init(cls, **kwargs)
        except AssertionError as e:
            if "directly inherits TypingOnly" in str(e) and "additional attributes" in str(e):
                # This is the SQLAlchemy error - ignore it
                return None
            raise
    
    typing.Generic.__init_subclass__ = classmethod(_patched_init_subclass)

# Now safe to import backend
from backend.app import create_app, db

app = create_app('production')

# Initialize database tables on startup
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run()
