from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Tutor, User, Course, CourseEnrollment, CourseReview, TutorEarnings, StudentActivity, TutorSession
from datetime import datetime
from sqlalchemy import func, desc

tutors_bp = Blueprint("tutors", __name__)


@tutors_bp.route("", methods=["GET"])
@jwt_required()
def get_tutors():
    """Get all tutors"""
    tutors = Tutor.query.all()
    return {"tutors": [t.to_dict() for t in tutors]}, 200


@tutors_bp.route("/<tutor_id>/dashboard/stats", methods=["GET"])
@jwt_required()
def get_dashboard_stats(tutor_id):
    """Get tutor dashboard statistics"""
    try:
        # Try to find tutor by ID
        tutor = Tutor.query.filter_by(id=tutor_id).first()
        
        if not tutor:
            # Try to find by user_id (in case tutor_id is actually user_id)
            user = User.query.filter_by(id=tutor_id).first()
            if user and user.user_type.lower() == 'tutor':
                tutor = Tutor.query.filter_by(user_id=tutor_id).first()
            
            if not tutor:
                return {"message": f"Tutor not found for ID: {tutor_id}"}, 404
        
        # Active courses
        active_courses = Course.query.filter_by(tutor_id=tutor.id).count()
        
        # Total students (count unique students in enrollments for this tutor's courses)
        total_students = db.session.query(func.count(func.distinct(CourseEnrollment.student_id))).join(
            Course, CourseEnrollment.course_id == Course.id
        ).filter(
            Course.tutor_id == tutor.id
        ).scalar() or 0
        
        # Total earnings (completed and pending)
        total_earnings = db.session.query(func.sum(TutorEarnings.amount)).filter(
            TutorEarnings.tutor_id == tutor.id
        ).scalar() or 0
        
        # Pending earnings
        pending_earnings = db.session.query(func.sum(TutorEarnings.amount)).filter(
            TutorEarnings.tutor_id == tutor.id,
            TutorEarnings.status == "pending"
        ).scalar() or 0
        
        # Average rating
        avg_rating = db.session.query(func.avg(CourseReview.rating)).join(
            Course, CourseReview.course_id == Course.id
        ).filter(
            Course.tutor_id == tutor.id
        ).scalar() or 0
        
        avg_rating = round(float(avg_rating), 1) if avg_rating else 0
        
        # Total reviews
        total_reviews = db.session.query(func.count(CourseReview.id)).join(
            Course, CourseReview.course_id == Course.id
        ).filter(
            Course.tutor_id == tutor.id
        ).scalar() or 0
        
        # Completion rate (average from all courses)
        completion_rate = db.session.query(func.avg(CourseEnrollment.progress)).join(
            Course, CourseEnrollment.course_id == Course.id
        ).filter(
            Course.tutor_id == tutor.id
        ).scalar() or 0
        
        completion_rate = round(float(completion_rate), 1) if completion_rate else 0
        
        # Upcoming sessions
        upcoming_sessions = TutorSession.query.filter(
            TutorSession.tutor_id == tutor.id,
            TutorSession.scheduled_at > datetime.utcnow(),
            TutorSession.status == "scheduled"
        ).count()
        
        # Pending grading (sessions completed but not graded)
        pending_grading = TutorSession.query.filter(
            TutorSession.tutor_id == tutor.id,
            TutorSession.status == "completed"
        ).count()
        
        return {
            "stats": {
                "totalStudents": total_students,
                "activeCourses": active_courses,
                "totalCourses": active_courses,
                "totalEarnings": float(total_earnings),
                "pendingEarnings": float(pending_earnings),
                "averageRating": avg_rating,
                "totalReviews": total_reviews,
                "completionRate": completion_rate,
                "upcomingSessions": upcoming_sessions,
                "pendingGrading": pending_grading
            }
        }, 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"message": f"Error fetching stats: {str(e)}"}, 500


@tutors_bp.route("/<tutor_id>/courses/top", methods=["GET"])
@jwt_required()
def get_top_courses(tutor_id):
    """Get top performing courses for tutor"""
    try:
        tutor = Tutor.query.filter_by(id=tutor_id).first()
        if not tutor:
            return {"message": "Tutor not found"}, 404
        
        courses = Course.query.filter_by(tutor_id=tutor_id).all()
        
        course_data = []
        for course in courses:
            # Count students
            student_count = CourseEnrollment.query.filter_by(course_id=course.id).count()
            
            # Average rating
            avg_rating = db.session.query(func.avg(CourseReview.rating)).filter(
                CourseReview.course_id == course.id
            ).scalar() or 0
            
            # Total earnings from this course
            earnings = db.session.query(func.sum(TutorEarnings.amount)).filter(
                TutorEarnings.type == "course",
                CourseEnrollment.course_id == course.id,
                TutorEarnings.course_enrollment_id == CourseEnrollment.id
            ).scalar() or 0
            
            # Completion rate
            completion_rate = db.session.query(func.avg(CourseEnrollment.progress)).filter(
                CourseEnrollment.course_id == course.id
            ).scalar() or 0
            
            course_data.append({
                "id": str(course.id),
                "title": course.title,
                "rating": round(float(avg_rating), 1),
                "students": student_count,
                "earnings": float(earnings),
                "completionRate": round(float(completion_rate), 1) if completion_rate else 0
            })
        
        # Sort by rating and students
        course_data.sort(key=lambda x: (x["rating"], x["students"]), reverse=True)
        
        return {"courses": course_data[:3]}, 200
    except Exception as e:
        return {"message": f"Error fetching courses: {str(e)}"}, 500


@tutors_bp.route("/<tutor_id>/dashboard/recent-activities", methods=["GET"])
@jwt_required()
def get_recent_activities(tutor_id):
    """Get recent student activities"""
    try:
        tutor = Tutor.query.filter_by(id=tutor_id).first()
        if not tutor:
            return {"message": "Tutor not found"}, 404
        
        # Get recent activities
        activities = StudentActivity.query.filter_by(tutor_id=tutor_id).order_by(
            desc(StudentActivity.created_at)
        ).limit(5).all()
        
        activity_data = []
        for activity in activities:
            activity_data.append({
                "id": str(activity.id),
                "type": activity.activity_type,
                "title": activity.title,
                "description": activity.description,
                "timestamp": activity.created_at.isoformat(),
                "status": activity.status
            })
        
        return {"activities": activity_data}, 200
    except Exception as e:
        return {"message": f"Error fetching activities: {str(e)}"}, 500


@tutors_bp.route("/<tutor_id>/earnings", methods=["GET"]) 
@jwt_required()
def get_earnings(tutor_id):
    """Get tutor earnings"""
    try:
        tutor = Tutor.query.filter_by(id=tutor_id).first()
        if not tutor:
            return {"message": "Tutor not found"}, 404
        
        # Get earnings summary
        total = db.session.query(func.sum(TutorEarnings.amount)).filter(
            TutorEarnings.tutor_id == tutor_id
        ).scalar() or 0
        
        pending = db.session.query(func.sum(TutorEarnings.amount)).filter(
            TutorEarnings.tutor_id == tutor_id,
            TutorEarnings.status == "pending"
        ).scalar() or 0
        
        completed = db.session.query(func.sum(TutorEarnings.amount)).filter(
            TutorEarnings.tutor_id == tutor_id,
            TutorEarnings.status == "completed"
        ).scalar() or 0
        
        # Recent earnings (last 10)
        earnings = TutorEarnings.query.filter_by(tutor_id=tutor_id).order_by(
            desc(TutorEarnings.created_at)
        ).limit(10).all()
        
        earnings_data = [{
            "id": str(e.id),
            "amount": float(e.amount),
            "type": e.type,
            "status": e.status,
            "date": e.created_at.isoformat()
        } for e in earnings]
        
        return {
            "summary": {
                "total": float(total),
                "pending": float(pending),
                "completed": float(completed)
            },
            "earnings": earnings_data
        }, 200
    except Exception as e:
        return {"message": f"Error fetching earnings: {str(e)}"}, 500


@tutors_bp.route("/<tutor_id>", methods=["GET"])
@jwt_required()
def get_tutor(tutor_id):
    """Get tutor by ID"""
    from uuid import UUID as PyUUID
    try:
        # Convert string to UUID if needed
        if isinstance(tutor_id, str):
            tutor_id = PyUUID(tutor_id)
        tutor = Tutor.query.filter_by(id=tutor_id).first()
        if not tutor:
            return {"message": "Tutor not found"}, 404
        return {"tutor": tutor.to_dict()}, 200
    except Exception as e:
        return {"message": f"Error: {str(e)}"}, 500


@tutors_bp.route("", methods=["POST"])
@jwt_required()
def create_tutor():
    """Create tutor record"""
    from uuid import UUID as PyUUID
    data = request.get_json()
    
    try:
        # Convert user_id to proper UUID format if it's a string
        user_id = data.get("user_id")
        if isinstance(user_id, str):
            user_id = PyUUID(user_id)
        
        tutor = Tutor(
            user_id=user_id,
            specializations=data.get("specializations", []),
            experience_years=data.get("experience_years", 0),
            hourly_rate=data.get("hourly_rate", 0)
        )
        db.session.add(tutor)
        db.session.commit()
        return {"message": "Tutor created", "tutor": tutor.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return {"message": f"Creation failed: {str(e)}"}, 500


@tutors_bp.route("/<tutor_id>", methods=["PUT"])
@jwt_required()
def update_tutor(tutor_id):
    """Update tutor"""
    tutor = Tutor.query.filter_by(id=tutor_id).first()
    if not tutor:
        return {"message": "Tutor not found"}, 404
    
    data = request.get_json()
    tutor.specializations = data.get("specializations", tutor.specializations)
    tutor.experience_years = data.get("experience_years", tutor.experience_years)
    tutor.hourly_rate = data.get("hourly_rate", tutor.hourly_rate)
    
    try:
        db.session.commit()
        return {"message": "Tutor updated", "tutor": tutor.to_dict()}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Update failed: {str(e)}"}, 500


@tutors_bp.route("/<tutor_id>", methods=["DELETE"])
@jwt_required()
def delete_tutor(tutor_id):
    """Delete tutor"""
    tutor = Tutor.query.filter_by(id=tutor_id).first()
    if not tutor:
        return {"message": "Tutor not found"}, 404
    
    try:
        db.session.delete(tutor)
        db.session.commit()
        return {"message": "Tutor deleted"}, 200
    except Exception as e:
        db.session.rollback()
        return {"message": f"Delete failed: {str(e)}"}, 500
