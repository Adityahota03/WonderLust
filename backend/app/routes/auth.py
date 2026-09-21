from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.user import User
from ..utils.auth_helpers import hash_password, check_password, generate_token, token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    phone = data.get('phone', '').strip()

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email already exists'}), 409

    hashed = hash_password(password)
    user = User(
        name=name,
        email=email,
        password_hash=hashed,
        phone=phone,
        role='user'
    )
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id, user.email, user.role)
    return jsonify({
        'message': 'Account created successfully',
        'token': token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password(password, user.password_hash):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = generate_token(user.id, user.email, user.role)
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user.to_dict()}), 200

@auth_bp.route('/demo', methods=['POST'])
def demo_login():
    data = request.get_json() or {}
    role = data.get('role', 'user')  # 'user', 'guide_partner', 'admin'
    
    # Check if demo user already exists
    demo_email = f"demo.{role}@traveldemo.com"
    user = User.query.filter_by(email=demo_email).first()
    
    if not user:
        name_map = {
            'user': 'Alex Mercer (Demo Traveler)',
            'guide_partner': 'Elena Rostova (Demo Guide)',
            'admin': 'Admin Supervisor (Demo Admin)'
        }
        user = User(
            name=name_map.get(role, 'Demo User'),
            email=demo_email,
            password_hash=hash_password("DemoPassword123!"),
            role=role,
            phone="+1 (555) 019-2834"
        )
        db.session.add(user)
        db.session.commit()

    token = generate_token(user.id, user.email, user.role)
    return jsonify({
        'message': f'Logged in as demo {role}',
        'token': token,
        'user': user.to_dict()
    }), 200
