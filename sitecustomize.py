"""
Workaround for SQLAlchemy Python 3.14 typing compatibility issue.
This gets executed before imports due to PYTHONPATH configuration.
"""
import sys
import typing

# Monkey-patch Generic to allow additional attributes in subclasses
# This fixes the SQLAlchemy typing error with Python 3.14
if sys.version_info >= (3, 14):
    original_init_subclass = typing.Generic.__init_subclass__
    
    def patched_init_subclass(cls, **kwargs):
        try:
            original_init_subclass(**kwargs)
        except AssertionError as e:
            if "directly inherits TypingOnly" in str(e):
                # Silently ignore this specific error
                pass
            else:
                raise
    
    typing.Generic.__init_subclass__ = classmethod(patched_init_subclass)
