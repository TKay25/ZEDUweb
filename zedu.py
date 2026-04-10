"""
ZEDU - Educational Platform
Main Flask Application (ConnectLink-style flat structure)
"""
import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import models and database
from models import db, bcrypt
from config import config

def create_app(config_name='development'):
    """Create and configure Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                os.getenv("FRONTEND_URL", "http://localhost:3000"),
                "http://localhost:3000",
                "http://localhost:5000"
            ],
            "allow_headers": ["Content-Type", "Authorization"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    })
    
    # Register blueprints (import here to avoid circular imports)
    from routes.auth import auth_bp
    from routes.users import users_bp
    from routes.students import students_bp
    from routes.tutors import tutors_bp
    from routes.courses import courses_bp
    from routes.sessions import sessions_bp
    from routes.assessments import assessments_bp
    from routes.messages import messages_bp
    from routes.ai import ai_bp
    
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(students_bp, url_prefix="/api/students")
    app.register_blueprint(tutors_bp, url_prefix="/api/tutors")
    app.register_blueprint(courses_bp, url_prefix="/api/courses")
    app.register_blueprint(sessions_bp, url_prefix="/api/sessions")
    app.register_blueprint(assessments_bp, url_prefix="/api/assessments")
    app.register_blueprint(messages_bp, url_prefix="/api/messages")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"message": "Resource not found"}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {"message": "Internal server error"}, 500
    
    # Health check endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "ok", "message": "ZEDU API is running"}, 200
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app


# Create app instance for direct execution
zedu_app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == "__main__":
    zedu_app.run(debug=True)
