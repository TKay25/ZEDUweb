from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, AIPrediction, Student
from datetime import datetime

ai_bp = Blueprint("ai", __name__)


@ai_bp.route("/predict", methods=["POST"])
@jwt_required()
def get_prediction():
    """Get AI prediction for student"""
    data = request.get_json()
    
    try:
        prediction = AIPrediction(
            student_id=data.get("student_id"),
            prediction_type=data.get("prediction_type"),
            data=data.get("data"),
            result=data.get("result"),
            confidence=data.get("confidence")
        )
        db.session.add(prediction)
        db.session.commit()
        return {"message": "Prediction created", "prediction": prediction.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {"message": f"Prediction failed: {str(e)}"}, 500


@ai_bp.route("/predictions/<int:student_id>", methods=["GET"])
@jwt_required()
def get_student_predictions(student_id):
    """Get all predictions for a student"""
    predictions = AIPrediction.query.filter_by(student_id=student_id).all()
    return {"predictions": [p.to_dict() for p in predictions]}, 200


@ai_bp.route("/generate-quiz", methods=["POST"])
@jwt_required()
def generate_quiz():
    """Generate quiz using AI"""
    data = request.get_json()
    
    return {
        "message": "Quiz generated",
        "quiz": {
            "title": data.get("topic", "Quiz"),
            "questions": []
        }
    }, 201


@ai_bp.route("/generate-summary", methods=["POST"])
@jwt_required()
def generate_summary():
    """Generate summary using AI"""
    data = request.get_json()
    
    return {
        "message": "Summary generated",
        "summary": "AI generated summary would appear here"
    }, 201
