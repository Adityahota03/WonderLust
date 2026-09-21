from flask import Blueprint, request, jsonify
from ..models.ticket import Ticket

tickets_bp = Blueprint('tickets', __name__, url_prefix='/api/tickets')

@tickets_bp.route('', methods=['GET'])
def get_tickets():
    origin = request.args.get('origin', '').strip()
    destination = request.args.get('destination', '').strip()
    transport_type = request.args.get('transport_type', '').strip().lower() # flight, train, bus
    date = request.args.get('date', '').strip()
    max_price = request.args.get('max_price', type=int)
    class_type = request.args.get('class_type', '').strip()

    query = Ticket.query

    if origin:
        query = query.filter(
            (Ticket.origin_city.ilike(f'%{origin}%')) |
            (Ticket.origin.ilike(f'%{origin}%'))
        )
    if destination:
        query = query.filter(
            (Ticket.destination_city.ilike(f'%{destination}%')) |
            (Ticket.destination.ilike(f'%{destination}%'))
        )
    if transport_type and transport_type != 'all':
        query = query.filter_by(transport_type=transport_type)
    if max_price is not None:
        query = query.filter(Ticket.price <= max_price)
    if class_type:
        query = query.filter_by(class_type=class_type)

    tickets = query.order_by(Ticket.price.asc()).all()
    return jsonify({
        'count': len(tickets),
        'tickets': [t.to_dict() for t in tickets]
    }), 200

@tickets_bp.route('/<string:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    return jsonify({'ticket': ticket.to_dict()}), 200
