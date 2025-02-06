from flask import Blueprint, jsonify, request
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                jwt_required)
from models import Course, Questions, QuestionSet, Subtopic, User
from werkzeug.security import check_password_hash, generate_password_hash

courses_bp = Blueprint('courses', __name__)

#get list of all courses
@courses_bp.route('/courses', methods=['GET'])
def get_courses():
    courses = Course.objects()
    return jsonify(courses), 200

#create a new course
@courses_bp.route('/courses', methods=['POST'])
def create_course():
    data = request.get_json()
    courseid = data.get('courseid')
    course_name = data.get('course_name')
    course_description = data.get('course_description')
    agestart = data.get('agestart')
    ageend = data.get('ageend')
    free_course = data.get('free_course')

    if not courseid or not course_name or not agestart or not ageend or not free_course:
        return jsonify({'error': 'Missing required fields'}), 400

    if Course.objects(courseid=courseid).first():
        return jsonify({'error': 'Course already exists'}), 400

    course = Course(courseid=courseid, course_name=course_name, course_description=course_description, agestart=agestart, ageend=ageend, free_course=free_course)
    course.save()

    return jsonify({'message': 'Course created successfully'}), 201