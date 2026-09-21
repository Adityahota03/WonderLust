from flask import Blueprint, request, jsonify
from ..models.hotel import Hotel
from ..models.ticket import Ticket
from ..models.guide import Guide
from ..models.destination import Destination

search_bp = Blueprint('search', __name__, url_prefix='/api/search')

@search_bp.route('', methods=['GET'])
def search_all():
    item_type = request.args.get('type', 'all').lower()  # 'all', 'hotel', 'ticket', 'guide'
    query = request.args.get('query', '').strip()
    destination_query = request.args.get('destination', '').strip()
    min_price = request.args.get('min_price', type=int)
    max_price = request.args.get('max_price', type=int)
    min_rating = request.args.get('min_rating', type=float)

    results = {
        'hotels': [],
        'tickets': [],
        'guides': [],
        'destinations': []
    }

    # Search Destinations
    if not destination_query and query:
        dest_matches = Destination.query.filter(
            (Destination.name.ilike(f'%{query}%')) |
            (Destination.country.ilike(f'%{query}%'))
        ).all()
        results['destinations'] = [d.to_dict() for d in dest_matches]

    # 1. Hotels Search
    if item_type in ['all', 'hotel', 'hotels']:
        hotel_q = Hotel.query
        search_term = destination_query or query
        if search_term:
            hotel_q = hotel_q.join(Destination).filter(
                (Hotel.name.ilike(f'%{search_term}%')) |
                (Hotel.address.ilike(f'%{search_term}%')) |
                (Destination.name.ilike(f'%{search_term}%')) |
                (Destination.country.ilike(f'%{search_term}%'))
            )
        if min_price is not None:
            hotel_q = hotel_q.filter(Hotel.starting_price >= min_price)
        if max_price is not None:
            hotel_q = hotel_q.filter(Hotel.starting_price <= max_price)
        if min_rating is not None:
            hotel_q = hotel_q.filter(Hotel.rating >= min_rating)

        results['hotels'] = [h.to_dict() for h in hotel_q.all()]

    # 2. Tickets Search
    if item_type in ['all', 'ticket', 'tickets']:
        ticket_q = Ticket.query
        search_term = destination_query or query
        if search_term:
            ticket_q = ticket_q.filter(
                (Ticket.destination_city.ilike(f'%{search_term}%')) |
                (Ticket.destination.ilike(f'%{search_term}%')) |
                (Ticket.origin_city.ilike(f'%{search_term}%')) |
                (Ticket.carrier.ilike(f'%{search_term}%'))
            )
        if max_price is not None:
            ticket_q = ticket_q.filter(Ticket.price <= max_price)

        results['tickets'] = [t.to_dict() for t in ticket_q.all()]

    # 3. Guides Search
    if item_type in ['all', 'guide', 'guides']:
        guide_q = Guide.query
        search_term = destination_query or query
        if search_term:
            guide_q = guide_q.join(Destination).filter(
                (Guide.name.ilike(f'%{search_term}%')) |
                (Guide.bio.ilike(f'%{search_term}%')) |
                (Guide.specialties_json.ilike(f'%{search_term}%')) |
                (Destination.name.ilike(f'%{search_term}%')) |
                (Destination.country.ilike(f'%{search_term}%'))
            )
        if max_price is not None:
            guide_q = guide_q.filter(Guide.daily_rate <= max_price)
        if min_rating is not None:
            guide_q = guide_q.filter(Guide.rating >= min_rating)

        results['guides'] = [g.to_dict() for g in guide_q.all()]

    total_results = len(results['hotels']) + len(results['tickets']) + len(results['guides'])

    return jsonify({
        'query': query,
        'type': item_type,
        'total_count': total_results,
        'results': results
    }), 200
