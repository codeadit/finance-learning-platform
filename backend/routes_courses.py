from bson import json_util
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                jwt_required)
from models import Course, FieldOfStudy, Questions, QuestionSet, Subtopic, User
from werkzeug.security import check_password_hash, generate_password_hash

courses_bp = Blueprint('course', __name__)

#CRUD for courses

#get list of all courses
@courses_bp.route('/courses', methods=['GET'])
@jwt_required()
def get_courses():
    courses = Course.objects().select_related()
    courses_with_fieldid = []
    for course in courses:
        course_dict = course.to_mongo().to_dict()
        course_dict['fieldid'] = str(course.field_of_study.fieldid) if course.field_of_study else None
        courses_with_fieldid.append(course_dict)
    return json_util.dumps(courses_with_fieldid), 200

#create a new course
@courses_bp.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    data = request.get_json()
    course_name = data.get('course_name')
    course_description = data.get('course_description')
    agestart = data.get('agestart')
    ageend = data.get('ageend')
    free_course = data.get('free_course')
    fieldid = data.get('fieldid')

    if not course_name or agestart is None or ageend is None or free_course is None:
        return jsonify({'error': 'Missing required fields'}), 400

    courseid = course_name.lower().replace(" ", "_");   
    if Course.objects(courseid=courseid).first():
        return jsonify({'error': 'Course already exists'}), 400
    
    field_of_study = FieldOfStudy.objects(fieldid=fieldid).first()
    if not field_of_study:
        return jsonify({'error': 'Field of Study not found'}), 404

    course = Course(courseid=courseid, course_name=course_name, course_description=course_description, agestart=agestart, ageend=ageend, free_course=free_course, field_of_study=field_of_study)
    course.save()

    return jsonify({'message': 'Course created successfully'}), 201

# Update Course
@courses_bp.route('/courses/<course_id>', methods=['PUT'])
@jwt_required()
def update_course(course_id):
    data = request.get_json()
    course_name = data.get('course_name')
    course_description = data.get('course_description')
    age_start = data.get('agestart')
    age_end = data.get('ageend')
    free_course = data.get('free_course')
    fieldid = data.get('fieldid')


    if not course_name or not course_description:
        return jsonify({'error': 'Missing required fields'}), 400

    course = Course.objects(courseid=course_id).first()
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    field_of_study = FieldOfStudy.objects(fieldid=fieldid).first()
    if not field_of_study:
        return jsonify({'error': 'Field of Study not found'}), 404

    course.update(course_name=course_name, course_description=course_description, agestart=age_start, ageend=age_end, free_course=free_course, field_of_study=field_of_study)
    return jsonify({'message': 'Course updated successfully'}), 200

#delete Course
@courses_bp.route('/courses', methods=['DELETE'])
@jwt_required()
def delete_courses():
    data = request.get_json()
    ids = data.get('ids')

    if not ids:
        return jsonify({'error': 'Missing required fields'}), 400
    
    idList = ids.split(",")
    ids_deleted = []
    ids_not_found = []

    for i in idList:
        course = Course.objects(courseid=i).first()
        if course:
            ids_deleted.append(i)
            course.delete()
        else:
            ids_not_found.append(i)

    return jsonify({'message': 'Course deleted successfully', 'ids_deleted': ids_deleted, 'ids_not_found': ids_not_found}), 200

#create a new sub-topic
@courses_bp.route('/subtopic', methods=['POST'])
@jwt_required()
def create_subtopic():
    data = request.get_json()
    subtopic_name = data.get('subtopic_name')
    subtopic_description = data.get('subtopic_description')
    courseid = data.get('courseid')

    if not subtopic_name or subtopic_description is None or courseid is None:
        return jsonify({'error': 'Missing required fields'}), 400

    subtopicid = subtopic_name.lower().replace(" ", "_");   
    if Course.objects(subtopicid=subtopicid).first():
        return jsonify({'error': 'Subtopic already exists'}), 400
    
    course = Course.objects(courseid=courseid).first()
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    course = Subtopic(subtopicid=subtopicid, subtopic_name=subtopic_name, subtopic_description=subtopic_description, course=course)
    course.save()

    return jsonify({'message': 'Subtopic created successfully'}), 201

# Update Subtopic
@courses_bp.route('/subtopic/<subtopic_id>', methods=['PUT'])
@jwt_required()
def update_subtopic(subtopic_id):
    data = request.get_json()
    subtopic_name = data.get('subtopic_name')
    subtopic_description = data.get('subtopic_description')
    courseid = data.get('courseid')

    if not subtopic_name or not subtopic_description or not courseid:
        return jsonify({'error': 'Missing required fields'}), 400
    
    subtopic = Subtopic.objects(subtopicid=subtopic_id).first()
    if not subtopic:
        return jsonify({'error': 'Subtopic not found'}), 404

    course = Course.objects(courseid=course_id).first()
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    subtopic.update(subtopic_name=subtopic_name, subtopic_description=subtopic_description, course=course)
    return jsonify({'message': 'Subtopic updated successfully'}), 200

#get list of all subtopics
@courses_bp.route('/subtopics', methods=['GET'])
@jwt_required()
def get_subtopics():
    subtopics = Subtopic.objects()
    return jsonify(subtopics), 200

#delete Course
@courses_bp.route('/subtopic', methods=['DELETE'])
@jwt_required()
def delete_subtopic():
    data = request.get_json()
    ids = data.get('ids')

    if not ids:
        return jsonify({'error': 'Missing required fields'}), 400
    
    idList = ids.split(",")
    ids_deleted = []
    ids_not_found = []

    for i in idList:
        subtopic = Subtopic.objects(subtopicid=i).first()
        if subtopic:
            ids_deleted.append(i)
            subtopic.delete()
        else:
            ids_not_found.append(i)

    return jsonify({'message': 'Subtopic deleted successfully', 'ids_deleted': ids_deleted, 'ids_not_found': ids_not_found}), 200


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

# CRUD operations for Field of Study

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

#get list of all Field of Study (FOS)
@courses_bp.route('/fields_of_study', methods=['GET'])
@jwt_required()
def get_fieldofstudy():
    fos = FieldOfStudy.objects()
    return jsonify(fos), 200

# Update field of study
@courses_bp.route('/fields_of_study/<fieldid>', methods=['PUT'])
@jwt_required()
def update_fieldofstudy(fieldid):
    data = request.get_json()
    field_name = data.get('field_name')
    field_description = data.get('field_description')

    if not field_name or not field_description:
        return jsonify({'error': 'Missing required fields'}), 400

    fos = FieldOfStudy.objects(fieldid=fieldid).first()
    if not fos:
        return jsonify({'error': 'Field of Study not found'}), 404

    fos.update(field_name=field_name, field_description=field_description)
    return jsonify({'message': 'Field of Study updated successfully'}), 200

#delete field of study
@courses_bp.route('/fields_of_study', methods=['DELETE'])
@jwt_required()
def delete_fieldofstudy():
    data = request.get_json()
    ids = data.get('ids')

    if not ids:
        return jsonify({'error': 'Missing required fields'}), 400
    
    idList = ids.split(",")
    ids_deleted = []
    ids_not_found = []

    for i in idList:
        fos = FieldOfStudy.objects(fieldid=i).first()
        if fos:
            ids_deleted.append(i)
            fos.delete()
        else:
            ids_not_found.append(i)

    return jsonify({'message': 'Field of Study deleted successfully', 'ids_deleted': ids_deleted, 'ids_not_found': ids_not_found}), 200
