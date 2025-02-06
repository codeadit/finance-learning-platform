from flask_mongoengine import MongoEngine
from datetime import datetime

db = MongoEngine()

# This defines a user
class User(db.Document):
    username = db.StringField(required=True, unique=True)
    email = db.StringField(required=True)
    password = db.StringField(required=True)
    created_at = db.DateTimeField(default=datetime.utcnow)
    user_type = db.StringField(required=True) # Can be 'student', 'teacher' or 'founder'

# These define the course structure
class Course(db.Document):
    courseid = db.StringField(required=True, unique=True)
    course_name = db.StringField(required=True)
    course_description = db.StringField()
    agestart = db.IntField(required=True)
    ageend = db.IntField(required=True)
    free_course = db.BooleanField(required=True)

class Subtopic(db.Document):
    subtopicid = db.StringField(required=True, unique=True)
    subtopic_name = db.StringField(required=True)
    subtopic_description = db.StringField()
    course = db.ReferenceField(Course, required=True)    

class Questions(db.Document):
    questionid = db.StringField(required=True, unique=True)
    question_text = db.StringField(required=True)
    options = db.ListField(db.StringField(), required=True)
    correct_answer = db.StringField(required=True)
    difficulty = db.StringField(required=True)
    explanation = db.StringField()

class QuestionSet(db.Document):
    questionsetid = db.StringField(required=True, unique=True)
    title = db.StringField(required=True)
    description = db.StringField()
    subtopic = db.ReferenceField(Subtopic, required=True)
    questions = db.ListField(db.ReferenceField(Questions), required=True)

# These define how the user interacts with the course
class QuestionProgress(db.Document):
    user = db.ReferenceField(User, required=True)
    question = db.ReferenceField(Questions, required=True)
    correct = db.BooleanField(required=True)
    answered_at = db.DateTimeField(default=datetime.utcnow)
    time_taken = db.IntField()

class CourseProgress(db.Document):
    user = db.ReferenceField(User, required=True)
    course = db.ReferenceField(Course, required=True)
    started = db.BooleanField(required=True) # can this be computed from QuestionProgress?
    started_at = db.DateTimeField(default=datetime.utcnow) # can this be computed from QuestionProgress?
    completed_at = db.DateTimeField() # can this be computed from QuestionProgress?

# These captures user ids which are teachers
class Teacher(db.Document):
    user = db.ReferenceField(User, required=True)


# These captures user ids which are founders
class Founder(db.Document):
    user = db.ReferenceField(User, required=True)

# These capture user ids which have been given the free course
class FreeCourseAllotment(db.Document):
    user = db.ReferenceField(User, required=True)
    course = db.ReferenceField(Course, required=True)
    date_given = db.DateTimeField(default=datetime.utcnow)