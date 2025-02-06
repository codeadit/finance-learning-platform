from flask import Blueprint, jsonify, request
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                jwt_required)
from models import Course, FieldOfStudy, Questions, QuestionSet, Subtopic, User
from werkzeug.security import check_password_hash, generate_password_hash

courses_bp = Blueprint('course', __name__)

#get list of all courses
@courses_bp.route('/courses', methods=['GET'])
@jwt_required()
def get_courses():
    courses = Course.objects()
    return jsonify(courses), 200

#create a new course
@courses_bp.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    data = request.get_json()
    courseid = data.get('courseid')
    course_name = data.get('course_name')
    course_description = data.get('course_description')
    agestart = data.get('agestart')
    ageend = data.get('ageend')
    free_course = data.get('free_course')

    if not courseid or not course_name or agestart is None or ageend is None or free_course is None:
        return jsonify({'error': 'Missing required fields'}), 400

    if Course.objects(courseid=courseid).first():
        return jsonify({'error': 'Course already exists'}), 400

    course = Course(courseid=courseid, course_name=course_name, course_description=course_description, agestart=agestart, ageend=ageend, free_course=free_course)
    course.save()

    return jsonify({'message': 'Course created successfully'}), 201


#get list of all subtopics
@courses_bp.route('/subtopics', methods=['GET'])
@jwt_required()
def get_subtopics():
    subtopics = Subtopic.objects()
    return jsonify(subtopics), 200


#get a list of all questions
@courses_bp.route('/questions', methods=['GET'])
@jwt_required()
def get_questions():
    questions = Questions.objects()
    return jsonify(questions), 200

#get a list of all question sets
@courses_bp.route('/questionsets', methods=['GET'])
@jwt_required()
def get_questionsets():
    questionsets = QuestionSet.objects()
    return jsonify(questionsets), 200

#get list of all Field of Study (FOS)
@courses_bp.route('/fields_of_study', methods=['GET'])
@jwt_required()
def get_fieldofstudy():
    fos = FieldOfStudy.objects()
    return jsonify(fos), 200

#create a new course
@courses_bp.route('/fields_of_study', methods=['POST'])
@jwt_required()
def create_fieldofstudy():
    data = request.get_json()
    fieldofstudy_name = data.get('field_name')
    fieldofstudy_description = data.get('field_description')
    
    if not fieldofstudy_name or not fieldofstudy_description:
        return jsonify({'error': 'Missing required fields'}), 400

    if FieldOfStudy.objects(field_name=fieldofstudy_name).first():
        return jsonify({'error': 'Field of Study already exists'}), 400
    
    # create a unique field id
    fieldofstudy_id = fieldofstudy_name.lower().replace(" ", "_");
    fos = FieldOfStudy(fieldid=fieldofstudy_id, field_name=fieldofstudy_name, field_description=fieldofstudy_description)
    fos.save()

    return jsonify({'message': 'Field Of Study created successfully'}), 201