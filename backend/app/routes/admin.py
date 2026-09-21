import json
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.user import User
from ..models.booking import Booking
from ..models.payment import Payment
from ..models.hotel import Hotel, Room
from ..models.destination import Destination
from ..models.ticket import Ticket
from ..models.guide import Guide
from ..models.contact import ContactMessage
from ..models.review import Review
from ..utils.auth_helpers import admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# ---------------------------------------------------------
# 1. Platform Statistics & Overview
# ---------------------------------------------------------
@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_admin_stats(current_user):
    # Total revenue from successful payments
    payments = Payment.query.filter_by(status='succeeded').all()
    total_revenue = sum(p.amount for p in payments)
    
    # Bookings metrics
    total_bookings = Booking.query.count()
    confirmed_bookings = Booking.query.filter_by(status='confirmed').count()
    cancelled_bookings = Booking.query.filter_by(status='cancelled').count()
    pending_bookings = Booking.query.filter_by(status='pending').count()

    hotel_bookings = Booking.query.filter_by(booking_type='hotel').count()
    ticket_bookings = Booking.query.filter_by(booking_type='ticket').count()
    guide_bookings = Booking.query.filter_by(booking_type='guide').count()

    # Inventory & Users counts
    total_users = User.query.count()
    total_destinations = Destination.query.count()
    total_hotels = Hotel.query.count()
    total_rooms = Room.query.count()
    total_tickets = Ticket.query.count()
    total_guides = Guide.query.count()
    total_contacts = ContactMessage.query.count()

    # Recent items
    recent_bookings = Booking.query.order_by(Booking.created_at.desc()).limit(8).all()
    recent_contacts = ContactMessage.query.order_by(ContactMessage.created_at.desc()).limit(6).all()

    return jsonify({
        'revenue': {
            'total': total_revenue,
            'currency': 'USD',
        },
        'bookings': {
            'total': total_bookings,
            'confirmed': confirmed_bookings,
            'cancelled': cancelled_bookings,
            'pending': pending_bookings,
            'by_type': {
                'hotel': hotel_bookings,
                'ticket': ticket_bookings,
                'guide': guide_bookings,
            }
        },
        'counts': {
            'users': total_users,
            'destinations': total_destinations,
            'hotels': total_hotels,
            'rooms': total_rooms,
            'tickets': total_tickets,
            'guides': total_guides,
            'contacts': total_contacts,
        },
        'recent_bookings': [b.to_dict() for b in recent_bookings],
        'recent_contacts': [c.to_dict() for c in recent_contacts],
    }), 200


# ---------------------------------------------------------
# 2. Bookings Management
# ---------------------------------------------------------
@admin_bp.route('/bookings', methods=['GET'])
@admin_required
def get_all_bookings(current_user):
    status = request.args.get('status', '').strip().lower()
    b_type = request.args.get('booking_type', '').strip().lower()
    search = request.args.get('search', '').strip().lower()

    query = Booking.query

    if status and status != 'all':
        query = query.filter_by(status=status)
    if b_type and b_type != 'all':
        query = query.filter_by(booking_type=b_type)
    if search:
        query = query.filter(
            (Booking.reference_code.ilike(f'%{search}%')) |
            (Booking.guest_name.ilike(f'%{search}%')) |
            (Booking.guest_email.ilike(f'%{search}%')) |
            (Booking.title.ilike(f'%{search}%')) |
            (Booking.destination_name.ilike(f'%{search}%'))
        )

    bookings = query.order_by(Booking.created_at.desc()).all()
    return jsonify({
        'count': len(bookings),
        'bookings': [b.to_dict() for b in bookings]
    }), 200


@admin_bp.route('/bookings/<string:booking_id>/status', methods=['PUT'])
@admin_required
def update_booking_status(current_user, booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    data = request.get_json() or {}
    new_status = data.get('status')
    if not new_status or new_status not in ['confirmed', 'cancelled', 'pending']:
        return jsonify({'error': 'Valid status (confirmed, cancelled, pending) is required'}), 400

    booking.status = new_status
    if new_status == 'cancelled' and booking.payment:
        booking.payment.status = 'refunded'
    elif new_status == 'confirmed' and booking.payment and booking.payment.status == 'refunded':
        booking.payment.status = 'succeeded'

    db.session.commit()
    return jsonify({
        'message': f'Booking status updated to {new_status}',
        'booking': booking.to_dict()
    }), 200


@admin_bp.route('/bookings/<string:booking_id>', methods=['DELETE'])
@admin_required
def delete_booking(current_user, booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking deleted successfully'}), 200


# ---------------------------------------------------------
# 3. Destinations Management
# ---------------------------------------------------------
@admin_bp.route('/destinations', methods=['GET'])
@admin_required
def admin_get_destinations(current_user):
    destinations = Destination.query.order_by(Destination.name.asc()).all()
    return jsonify({
        'count': len(destinations),
        'destinations': [d.to_dict() for d in destinations]
    }), 200


@admin_bp.route('/destinations', methods=['POST'])
@admin_required
def create_destination(current_user):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    country = data.get('country', '').strip()

    if not name or not country:
        return jsonify({'error': 'Destination name and country are required'}), 400

    destination = Destination(
        name=name,
        country=country,
        region=data.get('region', 'Global'),
        description=data.get('description', ''),
        image_url=data.get('image_url', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'),
        banner_url=data.get('banner_url') or data.get('image_url'),
        lat=float(data.get('lat', 0.0)),
        lng=float(data.get('lng', 0.0)),
        is_popular=bool(data.get('is_popular', False)),
        rating=float(data.get('rating', 4.8)),
        visitor_count=data.get('visitor_count', '1.0M+ visitors')
    )
    db.session.add(destination)
    db.session.commit()

    return jsonify({
        'message': 'Destination created successfully',
        'destination': destination.to_dict()
    }), 201


@admin_bp.route('/destinations/<string:dest_id>', methods=['PUT'])
@admin_required
def update_destination(current_user, dest_id):
    destination = Destination.query.get(dest_id)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404

    data = request.get_json() or {}
    if 'name' in data:
        destination.name = data['name'].strip()
    if 'country' in data:
        destination.country = data['country'].strip()
    if 'region' in data:
        destination.region = data['region'].strip()
    if 'description' in data:
        destination.description = data['description'].strip()
    if 'image_url' in data:
        destination.image_url = data['image_url'].strip()
    if 'banner_url' in data:
        destination.banner_url = data['banner_url'].strip()
    if 'lat' in data:
        destination.lat = float(data['lat'])
    if 'lng' in data:
        destination.lng = float(data['lng'])
    if 'is_popular' in data:
        destination.is_popular = bool(data['is_popular'])
    if 'rating' in data:
        destination.rating = float(data['rating'])
    if 'visitor_count' in data:
        destination.visitor_count = data['visitor_count'].strip()

    db.session.commit()
    return jsonify({
        'message': 'Destination updated successfully',
        'destination': destination.to_dict()
    }), 200


@admin_bp.route('/destinations/<string:dest_id>', methods=['DELETE'])
@admin_required
def delete_destination(current_user, dest_id):
    destination = Destination.query.get(dest_id)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404

    db.session.delete(destination)
    db.session.commit()
    return jsonify({'message': 'Destination deleted successfully'}), 200


# ---------------------------------------------------------
# 4. Hotels & Rooms Management
# ---------------------------------------------------------
@admin_bp.route('/hotels', methods=['GET'])
@admin_required
def admin_get_hotels(current_user):
    hotels = Hotel.query.order_by(Hotel.name.asc()).all()
    return jsonify({
        'count': len(hotels),
        'hotels': [h.to_dict(include_rooms=True) for h in hotels]
    }), 200


@admin_bp.route('/hotels', methods=['POST'])
@admin_required
def create_hotel(current_user):
    data = request.get_json() or {}
    destination_id = data.get('destination_id')
    name = data.get('name', '').strip()
    address = data.get('address', '').strip()
    starting_price = data.get('starting_price')

    if not destination_id or not name or not starting_price:
        return jsonify({'error': 'destination_id, name, and starting_price are required'}), 400

    destination = Destination.query.get(destination_id)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404

    gallery = data.get('gallery') or [data.get('image_url', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80')]
    amenities = data.get('amenities') or ["Free High-Speed WiFi", "Swimming Pool", "Spa & Wellness", "Fine Dining", "Air Conditioning"]

    hotel = Hotel(
        destination_id=destination_id,
        name=name,
        tagline=data.get('tagline', 'Luxury Stay & Comfort'),
        address=address or f"{name}, {destination.name}",
        description=data.get('description', 'Experience world-class luxury and top-tier hospitality in the heart of the city.'),
        stars=int(data.get('stars', 4)),
        rating=float(data.get('rating', 4.7)),
        review_count=int(data.get('review_count', 45)),
        starting_price=int(starting_price),
        lat=float(data.get('lat', destination.lat)),
        lng=float(data.get('lng', destination.lng)),
        image_url=data.get('image_url') or gallery[0],
        gallery_json=json.dumps(gallery),
        amenities_json=json.dumps(amenities),
        featured=bool(data.get('featured', False)),
        cancellation_policy=data.get('cancellation_policy', 'Free cancellation up to 48 hours before check-in')
    )
    db.session.add(hotel)
    db.session.flush()

    # Automatically add a default standard room if none provided
    default_room = Room(
        hotel_id=hotel.id,
        room_type="Deluxe King Room",
        name="Deluxe King Bed with City View",
        description="Spacious elegant room featuring king bedding, premium bath amenities, and panoramic views.",
        capacity=2,
        bed_type="1 Extra-Large King Bed",
        size_sqm=38,
        price_per_night=int(starting_price),
        perks_json=json.dumps(["Free WiFi", "Breakfast Included", "City View"]),
        available_count=6,
        image_url=hotel.image_url
    )
    db.session.add(default_room)
    db.session.commit()

    return jsonify({
        'message': 'Hotel created successfully with default room',
        'hotel': hotel.to_dict(include_rooms=True)
    }), 201


@admin_bp.route('/hotels/<string:hotel_id>', methods=['PUT'])
@admin_required
def update_hotel(current_user, hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({'error': 'Hotel not found'}), 404

    data = request.get_json() or {}
    if 'destination_id' in data:
        hotel.destination_id = data['destination_id']
    if 'name' in data:
        hotel.name = data['name'].strip()
    if 'tagline' in data:
        hotel.tagline = data['tagline'].strip()
    if 'address' in data:
        hotel.address = data['address'].strip()
    if 'description' in data:
        hotel.description = data['description'].strip()
    if 'stars' in data:
        hotel.stars = int(data['stars'])
    if 'rating' in data:
        hotel.rating = float(data['rating'])
    if 'starting_price' in data:
        hotel.starting_price = int(data['starting_price'])
    if 'lat' in data:
        hotel.lat = float(data['lat'])
    if 'lng' in data:
        hotel.lng = float(data['lng'])
    if 'image_url' in data:
        hotel.image_url = data['image_url'].strip()
    if 'gallery' in data and isinstance(data['gallery'], list):
        hotel.gallery_json = json.dumps(data['gallery'])
    if 'amenities' in data and isinstance(data['amenities'], list):
        hotel.amenities_json = json.dumps(data['amenities'])
    if 'featured' in data:
        hotel.featured = bool(data['featured'])
    if 'cancellation_policy' in data:
        hotel.cancellation_policy = data['cancellation_policy'].strip()

    db.session.commit()
    return jsonify({
        'message': 'Hotel updated successfully',
        'hotel': hotel.to_dict(include_rooms=True)
    }), 200


@admin_bp.route('/hotels/<string:hotel_id>', methods=['DELETE'])
@admin_required
def delete_hotel(current_user, hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({'error': 'Hotel not found'}), 404

    db.session.delete(hotel)
    db.session.commit()
    return jsonify({'message': 'Hotel and its rooms deleted successfully'}), 200


# Rooms under Hotel
@admin_bp.route('/hotels/<string:hotel_id>/rooms', methods=['POST'])
@admin_required
def create_room(current_user, hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({'error': 'Hotel not found'}), 404

    data = request.get_json() or {}
    room_type = data.get('room_type', '').strip()
    name = data.get('name', '').strip()
    price = data.get('price_per_night')

    if not room_type or not name or price is None:
        return jsonify({'error': 'room_type, name, and price_per_night are required'}), 400

    perks = data.get('perks') or ["Free WiFi", "Air Conditioning", "En-suite Bathroom"]

    room = Room(
        hotel_id=hotel_id,
        room_type=room_type,
        name=name,
        description=data.get('description', ''),
        capacity=int(data.get('capacity', 2)),
        bed_type=data.get('bed_type', '1 King Bed'),
        size_sqm=int(data.get('size_sqm', 35)),
        price_per_night=int(price),
        perks_json=json.dumps(perks),
        image_url=data.get('image_url') or hotel.image_url,
        available_count=int(data.get('available_count', 5))
    )
    db.session.add(room)
    db.session.commit()

    return jsonify({
        'message': 'Room added successfully',
        'room': room.to_dict()
    }), 201


@admin_bp.route('/rooms/<string:room_id>', methods=['PUT'])
@admin_required
def update_room(current_user, room_id):
    room = Room.query.get(room_id)
    if not room:
        return jsonify({'error': 'Room not found'}), 404

    data = request.get_json() or {}
    if 'room_type' in data:
        room.room_type = data['room_type'].strip()
    if 'name' in data:
        room.name = data['name'].strip()
    if 'description' in data:
        room.description = data['description'].strip()
    if 'capacity' in data:
        room.capacity = int(data['capacity'])
    if 'bed_type' in data:
        room.bed_type = data['bed_type'].strip()
    if 'size_sqm' in data:
        room.size_sqm = int(data['size_sqm'])
    if 'price_per_night' in data:
        room.price_per_night = int(data['price_per_night'])
    if 'perks' in data and isinstance(data['perks'], list):
        room.perks_json = json.dumps(data['perks'])
    if 'image_url' in data:
        room.image_url = data['image_url'].strip()
    if 'available_count' in data:
        room.available_count = int(data['available_count'])

    db.session.commit()
    return jsonify({
        'message': 'Room updated successfully',
        'room': room.to_dict()
    }), 200


@admin_bp.route('/rooms/<string:room_id>', methods=['DELETE'])
@admin_required
def delete_room(current_user, room_id):
    room = Room.query.get(room_id)
    if not room:
        return jsonify({'error': 'Room not found'}), 404

    db.session.delete(room)
    db.session.commit()
    return jsonify({'message': 'Room deleted successfully'}), 200


# ---------------------------------------------------------
# 5. Transport Tickets Management
# ---------------------------------------------------------
@admin_bp.route('/tickets', methods=['GET'])
@admin_required
def admin_get_tickets(current_user):
    tickets = Ticket.query.order_by(Ticket.departure_date.asc(), Ticket.departure_time.asc()).all()
    return jsonify({
        'count': len(tickets),
        'tickets': [t.to_dict() for t in tickets]
    }), 200


@admin_bp.route('/tickets', methods=['POST'])
@admin_required
def create_ticket(current_user):
    data = request.get_json() or {}
    transport_type = data.get('transport_type', 'flight').strip().lower()
    carrier = data.get('carrier', '').strip()
    carrier_code = data.get('carrier_code', '').strip()
    origin_city = data.get('origin_city', '').strip()
    destination_city = data.get('destination_city', '').strip()
    price = data.get('price')

    if not carrier or not carrier_code or not origin_city or not destination_city or price is None:
        return jsonify({'error': 'Carrier, code, origin, destination, and price are required'}), 400

    ticket = Ticket(
        transport_type=transport_type,
        carrier=carrier,
        carrier_logo=data.get('carrier_logo'),
        carrier_code=carrier_code,
        origin=data.get('origin', origin_city),
        origin_city=origin_city,
        destination=data.get('destination', destination_city),
        destination_city=destination_city,
        departure_time=data.get('departure_time', '09:00 AM'),
        arrival_time=data.get('arrival_time', '11:30 AM'),
        departure_date=data.get('departure_date', datetime.now().strftime('%Y-%m-%d')),
        duration=data.get('duration', '2h 30m'),
        stops=int(data.get('stops', 0)),
        class_type=data.get('class_type', 'Economy'),
        baggage_allowance=data.get('baggage_allowance', '1 Carry-on + 1 Checked Bag (23kg)'),
        price=int(price),
        seats_available=int(data.get('seats_available', 20)),
        lat_origin=float(data.get('lat_origin', 0.0)) if data.get('lat_origin') else None,
        lng_origin=float(data.get('lng_origin', 0.0)) if data.get('lng_origin') else None,
        lat_destination=float(data.get('lat_destination', 0.0)) if data.get('lat_destination') else None,
        lng_destination=float(data.get('lng_destination', 0.0)) if data.get('lng_destination') else None
    )
    db.session.add(ticket)
    db.session.commit()

    return jsonify({
        'message': 'Transport route created successfully',
        'ticket': ticket.to_dict()
    }), 201


@admin_bp.route('/tickets/<string:ticket_id>', methods=['PUT'])
@admin_required
def update_ticket(current_user, ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404

    data = request.get_json() or {}
    if 'transport_type' in data:
        ticket.transport_type = data['transport_type'].strip().lower()
    if 'carrier' in data:
        ticket.carrier = data['carrier'].strip()
    if 'carrier_code' in data:
        ticket.carrier_code = data['carrier_code'].strip()
    if 'carrier_logo' in data:
        ticket.carrier_logo = data['carrier_logo'].strip()
    if 'origin' in data:
        ticket.origin = data['origin'].strip()
    if 'origin_city' in data:
        ticket.origin_city = data['origin_city'].strip()
    if 'destination' in data:
        ticket.destination = data['destination'].strip()
    if 'destination_city' in data:
        ticket.destination_city = data['destination_city'].strip()
    if 'departure_time' in data:
        ticket.departure_time = data['departure_time'].strip()
    if 'arrival_time' in data:
        ticket.arrival_time = data['arrival_time'].strip()
    if 'departure_date' in data:
        ticket.departure_date = data['departure_date'].strip()
    if 'duration' in data:
        ticket.duration = data['duration'].strip()
    if 'stops' in data:
        ticket.stops = int(data['stops'])
    if 'class_type' in data:
        ticket.class_type = data['class_type'].strip()
    if 'baggage_allowance' in data:
        ticket.baggage_allowance = data['baggage_allowance'].strip()
    if 'price' in data:
        ticket.price = int(data['price'])
    if 'seats_available' in data:
        ticket.seats_available = int(data['seats_available'])

    db.session.commit()
    return jsonify({
        'message': 'Ticket updated successfully',
        'ticket': ticket.to_dict()
    }), 200


@admin_bp.route('/tickets/<string:ticket_id>', methods=['DELETE'])
@admin_required
def delete_ticket(current_user, ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404

    db.session.delete(ticket)
    db.session.commit()
    return jsonify({'message': 'Ticket deleted successfully'}), 200


# ---------------------------------------------------------
# 6. Travel Guides Management
# ---------------------------------------------------------
@admin_bp.route('/guides', methods=['GET'])
@admin_required
def admin_get_guides(current_user):
    guides = Guide.query.order_by(Guide.name.asc()).all()
    return jsonify({
        'count': len(guides),
        'guides': [g.to_dict() for g in guides]
    }), 200


@admin_bp.route('/guides', methods=['POST'])
@admin_required
def create_guide(current_user):
    data = request.get_json() or {}
    destination_id = data.get('destination_id')
    name = data.get('name', '').strip()
    daily_rate = data.get('daily_rate')

    if not destination_id or not name or daily_rate is None:
        return jsonify({'error': 'destination_id, name, and daily_rate are required'}), 400

    destination = Destination.query.get(destination_id)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404

    languages = data.get('languages') or ["English"]
    specialties = data.get('specialties') or ["Historical Walking Tour", "Culture & Sightseeing"]

    guide = Guide(
        destination_id=destination_id,
        name=name,
        title=data.get('title', 'Certified Tour Guide & Local Host'),
        photo_url=data.get('photo_url', f"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"),
        bio=data.get('bio', f"Passionate local storyteller showing you the secret gems of {destination.name}."),
        languages_json=json.dumps(languages),
        specialties_json=json.dumps(specialties),
        rating=float(data.get('rating', 4.9)),
        review_count=int(data.get('review_count', 25)),
        daily_rate=int(daily_rate),
        experience_years=int(data.get('experience_years', 5)),
        contact_email=data.get('contact_email', ''),
        is_verified=bool(data.get('is_verified', True)),
        featured=bool(data.get('featured', False)),
        lat=float(data.get('lat', destination.lat)),
        lng=float(data.get('lng', destination.lng))
    )
    db.session.add(guide)
    db.session.commit()

    return jsonify({
        'message': 'Travel Guide added successfully',
        'guide': guide.to_dict()
    }), 201


@admin_bp.route('/guides/<string:guide_id>', methods=['PUT'])
@admin_required
def update_guide(current_user, guide_id):
    guide = Guide.query.get(guide_id)
    if not guide:
        return jsonify({'error': 'Guide not found'}), 404

    data = request.get_json() or {}
    if 'destination_id' in data:
        guide.destination_id = data['destination_id']
    if 'name' in data:
        guide.name = data['name'].strip()
    if 'title' in data:
        guide.title = data['title'].strip()
    if 'photo_url' in data:
        guide.photo_url = data['photo_url'].strip()
    if 'bio' in data:
        guide.bio = data['bio'].strip()
    if 'languages' in data and isinstance(data['languages'], list):
        guide.languages_json = json.dumps(data['languages'])
    if 'specialties' in data and isinstance(data['specialties'], list):
        guide.specialties_json = json.dumps(data['specialties'])
    if 'rating' in data:
        guide.rating = float(data['rating'])
    if 'daily_rate' in data:
        guide.daily_rate = int(data['daily_rate'])
    if 'experience_years' in data:
        guide.experience_years = int(data['experience_years'])
    if 'contact_email' in data:
        guide.contact_email = data['contact_email'].strip()
    if 'is_verified' in data:
        guide.is_verified = bool(data['is_verified'])
    if 'featured' in data:
        guide.featured = bool(data['featured'])

    db.session.commit()
    return jsonify({
        'message': 'Guide updated successfully',
        'guide': guide.to_dict()
    }), 200


@admin_bp.route('/guides/<string:guide_id>', methods=['DELETE'])
@admin_required
def delete_guide(current_user, guide_id):
    guide = Guide.query.get(guide_id)
    if not guide:
        return jsonify({'error': 'Guide not found'}), 404

    db.session.delete(guide)
    db.session.commit()
    return jsonify({'message': 'Guide deleted successfully'}), 200


# ---------------------------------------------------------
# 7. Users & Roles Management
# ---------------------------------------------------------
@admin_bp.route('/users', methods=['GET'])
@admin_required
def admin_get_users(current_user):
    users = User.query.order_by(User.created_at.desc()).all()
    user_list = []
    for u in users:
        d = u.to_dict()
        d['bookings_count'] = u.bookings.count()
        user_list.append(d)

    return jsonify({
        'count': len(user_list),
        'users': user_list
    }), 200


@admin_bp.route('/users/<string:user_id>/role', methods=['PUT'])
@admin_required
def update_user_role(current_user, user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json() or {}
    new_role = data.get('role')
    if not new_role or new_role not in ['user', 'guide_partner', 'admin']:
        return jsonify({'error': 'Valid role (user, guide_partner, admin) is required'}), 400

    # Safeguard against demoting active logged in admin
    if user.id == current_user.id and new_role != 'admin':
        return jsonify({'error': 'You cannot revoke your own administrator privileges'}), 400

    user.role = new_role
    db.session.commit()

    d = user.to_dict()
    d['bookings_count'] = user.bookings.count()
    return jsonify({
        'message': f"Role updated to {new_role}",
        'user': d
    }), 200


@admin_bp.route('/users/<string:user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Safeguard against self-deletion
    if user.id == current_user.id:
        return jsonify({'error': 'You cannot delete your own administrator account'}), 400

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User account deleted successfully'}), 200


# ---------------------------------------------------------
# 8. Contact Inquiries Management
# ---------------------------------------------------------
@admin_bp.route('/contacts', methods=['GET'])
@admin_required
def admin_get_contacts(current_user):
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return jsonify({
        'count': len(messages),
        'contacts': [m.to_dict() for m in messages]
    }), 200


@admin_bp.route('/contacts/<string:contact_id>', methods=['DELETE'])
@admin_required
def delete_contact(current_user, contact_id):
    message = ContactMessage.query.get(contact_id)
    if not message:
        return jsonify({'error': 'Contact message not found'}), 404

    db.session.delete(message)
    db.session.commit()
    return jsonify({'message': 'Contact inquiry removed'}), 200
