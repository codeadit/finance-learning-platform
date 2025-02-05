from flask import Blueprint, jsonify, request
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                jwt_required)
from models import User
from werkzeug.security import check_password_hash, generate_password_hash

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    if User.objects(username=username).first() or User.objects(email=email).first():
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, password=hashed_password, user_type='student')
    user.save()

    return jsonify({'message': 'User registered successfully'}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    password = data.get('password')
    email = data.get('email')

    if not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.objects(email=email).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=email)
        return jsonify(message='Login successful', token=access_token, user_type=user.user_type), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    
@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user_email = get_jwt_identity()
    user = User.objects(email=current_user_email).first()

    users = User.objects()
    users_list = []
    for user in users:
        users_list.append({
            'username': user.username,
            'userType': user.user_type,
        })
    return jsonify(users_list), 200


# get all students
@user_bp.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    current_user = get_jwt_identity()
    # this user needs to be a founder or a teacher to see all students 
    user = User.objects(username=current_user).first()
    if user.user_type != 'founder' and user.user_type != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    students = User.objects(user_type='student')
    return jsonify(students), 200

# get all teachers
@user_bp.route('/teachers', methods=['GET'])
@jwt_required()
def get_teachers():
    current_user = get_jwt_identity()
    # this user needs to be a founder to see all teachers 
    user = User.objects(username=current_user).first()
    if user.user_type != 'founder':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    teachers = User.objects(user_type='teacher')
    return jsonify(teachers), 200

# get all founders
@user_bp.route('/founders', methods=['GET'])
@jwt_required()
def get_founders():
    current_user = get_jwt_identity()
    # this user needs to be a founder to see all founders 
    user = User.objects(username=current_user).first()
    if user.user_type != 'founder':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    founders = User.objects(user_type='founder')
    return jsonify(founders), 200

# get user type
@user_bp.route('/usertype', methods=['GET'])
@jwt_required()
def get_user_type():
    current_user = get_jwt_identity()
    # this user needs to be a founder to see all founders 
    user = User.objects(username=current_user).first()
    if user.user_type != 'founder':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    username = data.get('username')
    user = User.objects(username=username).first()
    if user:
        return jsonify({'user_type': user.user_type}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    
# change user type
@user_bp.route('/usertype', methods=['PUT'])
@jwt_required()
def change_user_type():
    current_user = get_jwt_identity()
    # this user needs to be a founder to see all founders 
    user = User.objects(username=current_user).first()
    if user.user_type != 'founder':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    username = data.get('username')
    user_type = data.get('user_type')
    user = User.objects(username=username).first()
    if user:
        user.update(user_type=user_type)
        return jsonify({'message': 'User type updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404