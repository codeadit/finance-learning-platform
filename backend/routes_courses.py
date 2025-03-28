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
        course_dict['refFOSId_String'] = str(course.refFOSId.refId) if course.refFOSId else None
        courses_with_fieldid.append(course_dict)
    return json_util.dumps(courses_with_fieldid), 200

#create a new course
@courses_bp.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    data = request.get_json()
    nameData = data.get('name')
    descriptionData = data.get('description')
    agestart = data.get('agestart')
    ageend = data.get('ageend')
    free_course = data.get('free_course')
    refFOSId_String = data.get('refFOSId_String')

    if not nameData or agestart is None or ageend is None or free_course is None:
        return jsonify({'error': 'Missing required fields'}), 400

    courseIdData = nameData.lower().replace(" ", "_");   
    if Course.objects(refId=courseIdData).first():
        return jsonify({'error': 'Course already exists'}), 400
    
    fos = FieldOfStudy.objects(refId=refFOSId_String).first()
    if not fos:
        return jsonify({'error': 'Field of Study not found'}), 404

    course = Course(refId=courseIdData, name=nameData, description=descriptionData, agestart=agestart, ageend=ageend, free_course=free_course, refFOSId=fos)
    course.save()

    return jsonify({'message': 'Course created successfully'}), 201

# Update Course
@courses_bp.route('/courses/<courseIdData>', methods=['PUT'])
@jwt_required()
def update_course(courseIdData):
    data = request.get_json()
    nameData = data.get('name')
    descriptionData = data.get('description')
    age_start = data.get('agestart')
    age_end = data.get('ageend')
    free_course = data.get('free_course')
    refFOSId_String = data.get('refFOSId_String')


    if not nameData or not descriptionData:
        return jsonify({'error': 'Missing required fields'}), 400

    course = Course.objects(refId=courseIdData).first()
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    fosRef = FieldOfStudy.objects(refId=refFOSId_String).first()
    if not fosRef:
        return jsonify({'error': 'Field of Study not found'}), 404

    course.update(name=nameData, description=descriptionData, agestart=age_start, ageend=age_end, free_course=free_course, refFOSId=fosRef)
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
        course = Course.objects(refId=i).first()
        if course:
            ids_deleted.append(i)
            course.delete()
        else:
            ids_not_found.append(i)

    return jsonify({'message': 'Course deleted successfully', 'ids_deleted': ids_deleted, 'ids_not_found': ids_not_found}), 200

#create a new sub-topic
@courses_bp.route('/subtopics', methods=['POST'])
@jwt_required()
def create_subtopic():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    refCourseId = data.get('refCourseId')

    if not name or description is None or refCourseId is None:
        return jsonify({'error': 'Missing required fields'}), 400

    subTopicIdData = name.lower().replace(" ", "_");   
    if Subtopic.objects(refId=subTopicIdData).first():
        return jsonify({'error': 'Subtopic already exists'}), 400
    
    refCourse = Course.objects(refId=refCourseId).first()
    if not refCourse:
        return jsonify({'error': 'Course not found'}), 404

    subtopic = Subtopic(refId=subTopicIdData, name=name, description=description, refCourseId=refCourse)
    subtopic.save()

    return jsonify({'message': 'Subtopic created successfully'}), 201

# Update Subtopic
@courses_bp.route('/subtopics/<subtopic_id>', methods=['PUT'])
@jwt_required()
def update_subtopic(subtopic_id):
    data = request.get_json()
    nameData = data.get('name')
    descriptionData = data.get('description')
    refCourseIdData = data.get('refCourseId')

    if not nameData or not descriptionData or not refCourseIdData:
        return jsonify({'error': 'Missing required fields'}), 400
    
    subTopicRef = Subtopic.objects(refId=subtopic_id).first()
    if not subTopicRef:
        return jsonify({'error': 'Subtopic not found'}), 404

    courseRef = Course.objects(refId=refCourseIdData).first()
    if not courseRef:
        return jsonify({'error': 'Course not found'}), 404

    subTopicRef.update(name=nameData, description=descriptionData, refCourseId=courseRef)
    return jsonify({'message': 'Subtopic updated successfully'}), 200

#get list of all subtopics
@courses_bp.route('/subtopics', methods=['GET'])
@jwt_required()
def get_subtopics():
    subTopics = Subtopic.objects().select_related()
    subTopics_with_courseid = []
    for subTopic in subTopics:
        subtopic_dict = subTopic.to_mongo().to_dict()
        subtopic_dict['refCourseId'] = str(subTopic.refCourseId.refId) if subTopic.refCourseId else None
        subTopics_with_courseid.append(subtopic_dict)
    return json_util.dumps(subTopics_with_courseid), 200

#delete sub-topic
@courses_bp.route('/subtopics', methods=['DELETE'])
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
        subtopic = Subtopic.objects(refId=i).first()
        if subtopic:
            ids_deleted.append(i)
            subtopic.delete()
        else:
            ids_not_found.append(i)

    return jsonify({'message': 'Subtopic deleted successfully', 'ids_deleted': ids_deleted, 'ids_not_found': ids_not_found}), 200




#create a new question set
@courses_bp.route('/questionSets', methods=['POST'])
@jwt_required()
def create_questionSet():
    data = request.get_json()
    nameData = data.get('name')
    descriptionData = data.get('description')
    refSubTopicIdData = data.get('refSubTopicId')

    if not nameData or descriptionData is None or refSubTopicIdData is None:
        return jsonify({'error': 'Missing required fields'}), 400

    qSetId = nameData.lower().replace(" ", "_");   
    if QuestionSet.objects(refId=qSetId).first():
        return jsonify({'error': 'Question Set already exists'}), 400
    
    subTopicRef = Subtopic.objects(refId=refSubTopicIdData).first()
    if not subTopicRef:
        return jsonify({'error': 'Subtopic not found'}), 404

    qSet = QuestionSet(refId=qSetId, name=nameData, description=descriptionData, refSubTopicId=subTopicRef)
    qSet.save()

    return jsonify({'message': 'Question Set created successfully'}), 201

#get a list of all question sets
@courses_bp.route('/questionsets', methods=['GET'])
@jwt_required()
def get_questionsets():
    qSets = QuestionSet.objects().select_related()
    qSets_with_subTopicid = []
    for qSet in qSets:
        qSet_dict = qSet.to_mongo().to_dict()
        qSet_dict['subTopic'] = str(qSet.refSubTopicId.refId) if qSet.refSubTopicId else None

        qRefs = []
        for qs in qSet.refQuestionIds:
            # if qs is not Questions object, exit the loop
            if not isinstance(qs, Questions):
                continue
            
            qsRefObject = Questions.objects(refId=qs.refId).first()
            if(qsRefObject):
                qRefs.append(str(qsRefObject.refId))

        qSet_dict['questions'] = qRefs
        qSets_with_subTopicid.append(qSet_dict)

    return json_util.dumps(qSets_with_subTopicid), 200

# Update question sets
@courses_bp.route('/questionsets/<questionset_id>', methods=['PUT'])
@jwt_required()
def update_qSet(questionset_id):
    data = request.get_json()
    nameData = data.get('name')
    descriptionData = data.get('description')
    refSubTopicIdData = data.get('subTopic')
    refQuestionIdsData = data.get('questions')

    # Ensure questions is a list of ObjectId references
    qRefs = []
    if refQuestionIdsData:
        for question_id in refQuestionIdsData:
            question = Questions.objects(refId=question_id).first()
            if question:
                qRefs.append(question)

    if not nameData or not descriptionData or not refSubTopicIdData:
        return jsonify({'error': 'Missing required fields'}), 400
    
    qSet = QuestionSet.objects(refId=questionset_id).first()
    if not qSet:
        return jsonify({'error': 'Question Set not found'}), 404

    subTopicRef = Subtopic.objects(refId=refSubTopicIdData).first()
    if not subTopicRef:
        return jsonify({'error': 'Course not found'}), 404

    qSet.update(name=nameData, description=descriptionData, refSubTopicId=subTopicRef, refQuestionIds=qRefs)
    return jsonify({'message': 'Question Set updated successfully'}), 200


#delete question set
@courses_bp.route('/questionsets', methods=['DELETE'])
@jwt_required()
def delete_questionset():
    data = request.get_json()
    ids = data.get('ids')

    if not ids:
        return jsonify({'error': 'Missing required fields'}), 400
    
    idList = ids.split(",")
    ids_deleted = []
    ids_not_found = []

    for i in idList:
        subtopic = QuestionSet.objects(refId=i).first()
        if subtopic:
            ids_deleted.append(i)
            subtopic.delete()
        else:
            ids_not_found.append(i)

    return jsonify({'message': 'Question Set deleted successfully', 'ids_deleted': ids_deleted, 'ids_not_found': ids_not_found}), 200

# CRUD operations for questions
#create a new question
@courses_bp.route('/questions', methods=['POST'])
@jwt_required()
def create_question():
    data = request.get_json()
    question_text = data.get('name')
    options = data.get('options')
    correct_answer = data.get('correct_answer')
    difficulty = data.get('difficulty')
    explanation = data.get('explanation')

    if not question_text or not options or not correct_answer or not difficulty:
        return jsonify({'error': 'Missing required fields'}), 400
    
    questionid = question_text.lower().replace(" ", "_");
    if Questions.objects(refId=questionid).first():
        return jsonify({'error': 'Question already exists'}), 400
    
    question = Questions(refId=questionid, question_text=question_text, options=options, correct_answer=correct_answer, difficulty=difficulty, explanation=explanation)
    question.save()

    return jsonify({'message': 'Question created successfully'}), 201

# Update question
@courses_bp.route('/questions/<question_id>', methods=['PUT'])
@jwt_required()
def update_question(question_id):
    data = request.get_json()
    question_text = data.get('question_text')
    options = data.get('options')
    correct_answer = data.get('correct_answer')
    difficulty = data.get('difficulty')
    explanation = data.get('explanation')

    if not question_text or not options or not correct_answer or not difficulty:
        return jsonify({'error': 'Missing required fields'}), 400

    qRef = Questions.objects(refId=question_id).first()
    if not qRef:
        return jsonify({'error': 'Question not found'}), 404

    qRef.update(question_text=question_text, options=options, correct_answer=correct_answer, difficulty=difficulty, explanation=explanation)
    return jsonify({'message': 'Question updated successfully'}), 200

#get a list of all questions
@courses_bp.route('/questions', methods=['GET'])
@jwt_required()
def get_questions():
    questions = Questions.objects()
    return jsonify(questions), 200

# delete question
@courses_bp.route('/questions', methods=['DELETE'])
@jwt_required()
def delete_questions():
    data = request.get_json()
    ids = data.get('ids')

    if not ids:
        return jsonify({'error': 'Missing required fields'}), 400
    
    idList = ids.split(",")
    ids_deleted = []
    ids_not_found = []

    for i in idList:
        fos = Questions.objects(refId=i).first()
        if fos:
            ids_deleted.append(i)
            fos.delete()
        else:
            ids_not_found.append(i)

    return jsonify({'message': 'Questions deleted successfully', 'ids_deleted': ids_deleted, 'ids_not_found': ids_not_found}), 200

# CRUD operations for Field of Study

#create a new course
@courses_bp.route('/fields_of_study', methods=['POST'])
@jwt_required()
def create_fieldofstudy():
    data = request.get_json()
    fieldofstudy_name = data.get('name')
    fieldofstudy_description = data.get('description')
    
    if not fieldofstudy_name or not fieldofstudy_description:
        return jsonify({'error': 'Missing required fields'}), 400

    if FieldOfStudy.objects(name=fieldofstudy_name).first():
        return jsonify({'error': 'Field of Study already exists'}), 400
    
    # create a unique field id
    fieldofstudy_id = fieldofstudy_name.lower().replace(" ", "_");
    fos = FieldOfStudy(refId=fieldofstudy_id, name=fieldofstudy_name, description=fieldofstudy_description)
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
    fname = data.get('name')
    fdescription = data.get('description')

    if not fname or not fdescription:
        return jsonify({'error': 'Missing required fields'}), 400

    fos = FieldOfStudy.objects(refId=fieldid).first()
    if not fos:
        return jsonify({'error': 'Field of Study not found'}), 404

    fos.update(name=fname, description=fdescription)
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
        fos = FieldOfStudy.objects(refId=i).first()
        if fos:
            ids_deleted.append(i)
            fos.delete()
        else:
            ids_not_found.append(i)

    return jsonify({'message': 'Field of Study deleted successfully', 'ids_deleted': ids_deleted, 'ids_not_found': ids_not_found}), 200
