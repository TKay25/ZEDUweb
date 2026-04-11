"""
ZEDU - Educational Platform
Main Flask Application (ConnectLink-style flat structure)
"""
import os
from flask import Flask, render_template
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
    app = Flask(__name__, template_folder='templates', static_folder='frontend')
    
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
    
    # ===== PAGE ROUTES (render templates) =====
    @app.route("/", methods=["GET"])
    def home():
        """Home page"""
        return render_template("index.html")
    
    @app.route("/login", methods=["GET"])
    def login_page():
        """Login page"""
        return render_template("login.html")
    
    @app.route("/register", methods=["GET"])
    def register_page():
        """Registration page"""
        return render_template("register.html")
    
    @app.route("/courses", methods=["GET"])
    def courses_page():
        """Courses page"""
        return render_template("courses.html")
    
    @app.route("/tutors", methods=["GET"])
    def tutors_page():
        """Tutors page"""
        return render_template("tutors.html")
    
    @app.route("/dashboard", methods=["GET"])
    def dashboard_page():
        """Dashboard page"""
        return render_template("dashboard.html")
    
    @app.route("/student/dashboard", methods=["GET"])
    def student_dashboard_page():
        """Student dashboard page"""
        return render_template("dashboard.html")
    
    @app.route("/tutor/dashboard", methods=["GET"])
    def tutor_dashboard_page():
        """Tutor dashboard page"""
        return render_template("dashboard.html")
    
    @app.route("/parent/dashboard", methods=["GET"])
    def parent_dashboard_page():
        """Parent dashboard page"""
        return render_template("dashboard.html")
    
    @app.route("/profile", methods=["GET"])
    def profile_page():
        """Profile page"""
        return render_template("profile.html")
    
    # ===== API HEALTH CHECK =====
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "ok", "message": "ZEDU API is running"}, 200
    
    # Register database initialization on first request (deferred to avoid import-time errors)
    @app.before_request
    def init_db():
        try:
            with app.app_context():
                db.create_all()
        except Exception as e:
            print(f"Warning: Could not initialize database: {e}")
    
    return app


if __name__ == "__main__":
    # Only create app for direct execution
    zedu_app = create_app(os.getenv('FLASK_ENV', 'development'))
    zedu_app.run(debug=True)
