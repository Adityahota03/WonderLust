from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.contact import ContactMessage

contact_bp = Blueprint('contact', __name__, url_prefix='/api/contact')

@contact_bp.route('', methods=['POST'])
def submit_contact():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message:
        return jsonify({'error': 'Name, email, and message are required'}), 400

    if '@' not in email or '.' not in email:
        return jsonify({'error': 'Please enter a valid email address'}), 400

    contact_entry = ContactMessage(
        name=name,
        email=email,
        subject=subject or 'General Inquiry',
        message=message
    )
    db.session.add(contact_entry)
    db.session.commit()

    return jsonify({
        'message': 'Thank you! Your message has been received. Our travel concierge will reach out within 24 hours.',
        'contact': contact_entry.to_dict()
    }), 201
