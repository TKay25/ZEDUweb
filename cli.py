"""
Flask CLI commands for ZEDU application
"""
import os
from dotenv import load_dotenv
from zedu import create_app
from models import db

# Load environment variables
load_dotenv()

app = create_app(os.getenv('FLASK_ENV', 'development'))

@app.cli.command("init-db")
def init_db():
    """Initialize the database"""
    with app.app_context():
        print("Creating database tables...")
        try:
            db.create_all()
            print("✓ Database initialized successfully!")
        except Exception as e:
            print(f"✗ Error initializing database: {e}")


@app.cli.command("drop-db")
def drop_db():
    """Drop all database tables (WARNING: This deletes all data!)"""
    if input("Are you sure? Type 'yes' to confirm: ").lower() == 'yes':
        with app.app_context():
            print("Dropping database tables...")
            try:
                db.drop_all()
                print("✓ Database dropped!")
            except Exception as e:
                print(f"✗ Error dropping database: {e}")
    else:
        print("Cancelled")


@app.cli.command("reset-db")
def reset_db():
    """Drop and recreate all database tables"""
    with app.app_context():
        if input("This will delete all data. Type 'yes' to confirm: ").lower() == 'yes':
            print("Resetting database...")
            try:
                db.drop_all()
                db.create_all()
                print("✓ Database reset successfully!")
            except Exception as e:
                print(f"✗ Error resetting database: {e}")
        else:
            print("Cancelled")


if __name__ == "__main__":
    app.cli()
