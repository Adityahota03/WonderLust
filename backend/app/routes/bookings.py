import json
import uuid
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.booking import Booking, generate_booking_ref
from ..models.payment import Payment
from ..models.hotel import Hotel, Room
from ..models.ticket import Ticket
from ..models.guide import Guide
from ..utils.auth_helpers import token_required

bookings_bp = Blueprint('bookings', __name__, url_prefix='/api/bookings')

@bookings_bp.route('', methods=['GET'])
@token_required
def get_user_bookings(current_user):
    bookings = Booking.query.filter_by(user_id=current_user.id).order_by(Booking.created_at.desc()).all()
    return jsonify({
        'count': len(bookings),
        'bookings': [b.to_dict() for b in bookings]
    }), 200

@bookings_bp.route('/<string:booking_id>', methods=['GET'])
@token_required
def get_booking_detail(current_user, booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
        
    if booking.user_id != current_user.id and current_user.role != 'admin':
        return jsonify({'error': 'Unauthorized to view this booking'}), 403

    return jsonify({'booking': booking.to_dict()}), 200

@bookings_bp.route('', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.get_json() or {}
    booking_type = data.get('booking_type')  # 'hotel', 'ticket', 'guide'
    item_id = data.get('item_id')
    details = data.get('details', {})
    total_amount = data.get('total_amount')
    guest_name = data.get('guest_name', current_user.name)
    guest_email = data.get('guest_email', current_user.email)
    guest_phone = data.get('guest_phone', current_user.phone or '')
    special_requests = data.get('special_requests', '')
    payment_method = data.get('payment_method', 'Credit Card')
    card_last4 = data.get('card_last4', '4242')

    if not booking_type or not item_id or total_amount is None:
        return jsonify({'error': 'booking_type, item_id, and total_amount are required'}), 400

    title = data.get('title', 'Travel Booking')
    image_url = data.get('image_url')
    destination_name = data.get('destination_name', '')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    # Fetch extra metadata if available
    if booking_type == 'hotel':
        hotel = Hotel.query.get(item_id)
        if hotel:
            if not image_url:
                image_url = hotel.image_url
            if not destination_name and hotel.destination:
                destination_name = hotel.destination.name
    elif booking_type == 'ticket':
        ticket = Ticket.query.get(item_id)
        if ticket:
            if not title or title == 'Travel Booking':
                title = f"{ticket.carrier} {ticket.carrier_code} ({ticket.origin_city} -> {ticket.destination_city})"
            destination_name = ticket.destination_city
    elif booking_type == 'guide':
        guide = Guide.query.get(item_id)
        if guide:
            if not image_url:
                image_url = guide.photo_url
            if not destination_name and guide.destination:
                destination_name = guide.destination.name

    new_booking = Booking(
        user_id=current_user.id,
        booking_type=booking_type,
        item_id=item_id,
        title=title,
        image_url=image_url,
        destination_name=destination_name,
        details_json=json.dumps(details),
        total_amount=int(total_amount),
        currency='USD',
        status='confirmed',
        start_date=start_date,
        end_date=end_date,
        guest_name=guest_name,
        guest_email=guest_email,
        guest_phone=guest_phone,
        special_requests=special_requests
    )
    db.session.add(new_booking)
    db.session.flush()

    # Create associated payment record atomically
    payment_record = Payment(
        booking_id=new_booking.id,
        amount=int(total_amount),
        currency='USD',
        status='succeeded',
        payment_method=payment_method,
        provider_ref=f"ch_{uuid.uuid4().hex[:16]}",
        card_last4=str(card_last4)[-4:]
    )
    db.session.add(payment_record)
    db.session.commit()

    return jsonify({
        'message': 'Booking confirmed successfully!',
        'booking': new_booking.to_dict()
    }), 201

@bookings_bp.route('/<string:booking_id>/cancel', methods=['POST'])
@token_required
def cancel_booking(current_user, booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    if booking.user_id != current_user.id and current_user.role != 'admin':
        return jsonify({'error': 'Unauthorized to cancel this booking'}), 403

    if booking.status == 'cancelled':
        return jsonify({'error': 'Booking is already cancelled'}), 400

    booking.status = 'cancelled'
    if booking.payment:
        booking.payment.status = 'refunded'

    db.session.commit()

    return jsonify({
        'message': 'Booking cancelled and refund processed',
        'booking': booking.to_dict()
    }), 200
