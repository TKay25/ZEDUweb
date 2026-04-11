#!/usr/bin/env python3
"""
Database Initialization Script
Initializes PostgreSQL database with proper schema, indexes, and relationships
Usage: python init_db.py
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import text, inspect
from zedu import create_app
from models import db, User, Student, Tutor, Parent, School, Course, CourseEnrollment, Lesson, TutorSession, Assessment, Message, Notification, AIPrediction

load_dotenv()

# Database URL - can be passed as environment variable or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://zeduweb_user:qdEe6bfJmlIHAknO2TVbum3SSm2kFvFV@dpg-d7cklfa8qa3s73e9podg-a.oregon-postgres.render.com/zeduweb")

def initialize_database():
    """Initialize database with all tables and indexes"""
    
    # Create Flask app with production config
    app = create_app("production")
    
    # Override DATABASE_URL if provided
    if DATABASE_URL:
        app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    
    print(f"🔗 Connecting to: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'Database'}")
    print("=" * 70)
    
    with app.app_context():
        try:
            # Check database connection
            print("✓ Testing database connection...")
            connection = db.engine.connect()
            connection.close()
            print("✓ Database connection successful!\n")
            
            # Drop existing tables (optional - comment out for production)
            # print("🗑️  Dropping existing tables...")
            # db.drop_all()
            # print("✓ Tables dropped\n")
            
            # Create all tables
            print("📊 Creating database schema...")
            db.create_all()
            print("✓ All tables created successfully!\n")
            
            # Display created tables
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            print("📋 Tables created:")
            print("-" * 70)
            for table in sorted(tables):
                columns = inspector.get_columns(table)
                print(f"\n  📌 {table.upper()}")
                for col in columns:
                    nullable = "✓ NULL" if col["nullable"] else "✗ NOT NULL"
                    print(f"     • {col['name']:<30} {str(col['type']):<20} {nullable}")
                
                # Show indexes for this table
                indexes = inspector.get_indexes(table)
                if indexes:
                    print(f"     Indexes: {', '.join([idx['name'] for idx in indexes])}")
                
                # Show foreign keys
                fks = inspector.get_foreign_keys(table)
                if fks:
                    for fk in fks:
                        print(f"     FK: {fk['constrained_columns']} → {fk['referred_table']}.{fk['referred_columns']}")
            
            print("\n" + "=" * 70)
            print("✅ Database initialization completed successfully!")
            print("\n📝 Database Details:")
            print(f"   • URL: {DATABASE_URL}")
            print(f"   • Total Tables: {len(tables)}")
            print(f"   • Tables: {', '.join(sorted(tables))}")
            print("\n✨ ZEDU database is ready to use!")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Error during database initialization:")
            print(f"   {str(e)}")
            print("\n📌 Troubleshooting tips:")
            print("   • Check your DATABASE_URL is correct")
            print("   • Ensure PostgreSQL server is running")
            print("   • Verify credentials and network access")
            print("   • Check firewall/ports are open (5432 for PostgreSQL)")
            return False

def drop_database():
    """Drop all tables (use with caution)"""
    app = create_app("production")
    
    if DATABASE_URL:
        app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    
    print("⚠️  WARNING: This will DELETE all tables and data!")
    response = input("Type 'yes' to confirm: ")
    
    if response.lower() == "yes":
        with app.app_context():
            print("🗑️  Dropping all tables...")
            db.drop_all()
            print("✓ All tables dropped")
    else:
        print("Cancelled")

def reset_database():
    """Reset database: drop all and recreate"""
    print("🔄 Resetting database...")
    drop_database()
    print()
    initialize_database()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        if command == "drop":
            drop_database()
        elif command == "reset":
            reset_database()
        else:
            print(f"Unknown command: {command}")
            print("Usage: python init_db.py [init|drop|reset]")
    else:
        # Default: initialize
        success = initialize_database()
        sys.exit(0 if success else 1)
