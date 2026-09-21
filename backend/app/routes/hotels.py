from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.hotel import Hotel, Room
from ..models.destination import Destination
from ..models.review import Review
from ..utils.auth_helpers import token_required

hotels_bp = Blueprint('hotels', __name__, url_prefix='/api/hotels')

@hotels_bp.route('', methods=['GET'])
def get_hotels():
    dest_id = request.args.get('destination_id')
    search = request.args.get('search', '').strip().lower()
    min_price = request.args.get('min_price', type=int)
    max_price = request.args.get('max_price', type=int)
    stars = request.args.get('stars', type=int)
    min_rating = request.args.get('min_rating', type=float)
    featured = request.args.get('featured', '').lower() == 'true'

    query = Hotel.query

    if dest_id:
        query = query.filter_by(destination_id=dest_id)
    if featured:
        query = query.filter_by(featured=True)
    if min_price is not None:
        query = query.filter(Hotel.starting_price >= min_price)
    if max_price is not None:
        query = query.filter(Hotel.starting_price <= max_price)
    if stars is not None:
        query = query.filter(Hotel.stars >= stars)
    if min_rating is not None:
        query = query.filter(Hotel.rating >= min_rating)
    if search:
        query = query.filter(
            (Hotel.name.ilike(f'%{search}%')) |
            (Hotel.address.ilike(f'%{search}%')) |
            (Hotel.description.ilike(f'%{search}%'))
        )

    hotels = query.all()
    return jsonify({
        'count': len(hotels),
        'hotels': [h.to_dict() for h in hotels]
    }), 200

@hotels_bp.route('/<string:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({'error': 'Hotel not found'}), 404

    data = hotel.to_dict(include_rooms=True)
    data['reviews'] = [r.to_dict() for r in hotel.reviews.order_by(Review.created_at.desc()).all()]
    return jsonify({'hotel': data}), 200

@hotels_bp.route('/<string:hotel_id>/reviews', methods=['POST'])
@token_required
def add_hotel_review(current_user, hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({'error': 'Hotel not found'}), 404

    data = request.get_json() or {}
    rating = data.get('rating', 5)
    title = data.get('title', '')
    comment = data.get('comment', '').strip()

    if not comment:
        return jsonify({'error': 'Review comment is required'}), 400

    review = Review(
        user_id=current_user.id,
        hotel_id=hotel.id,
        rating=int(rating),
        title=title,
        comment=comment
    )
    db.session.add(review)

    # Recalculate hotel rating
    current_reviews = hotel.reviews.all()
    total_rating = sum(r.rating for r in current_reviews) + int(rating)
    hotel.review_count = len(current_reviews) + 1
    hotel.rating = round(total_rating / hotel.review_count, 1)

    db.session.commit()

    return jsonify({
        'message': 'Review added successfully',
        'review': review.to_dict()
    }), 201
