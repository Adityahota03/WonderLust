from flask import Blueprint, request, jsonify
from ..models.destination import Destination

destinations_bp = Blueprint('destinations', __name__, url_prefix='/api/destinations')

@destinations_bp.route('', methods=['GET'])
def get_destinations():
    popular_only = request.args.get('popular', '').lower() == 'true'
    query = Destination.query
    if popular_only:
        query = query.filter_by(is_popular=True)
    
    destinations = query.all()
    return jsonify({
        'destinations': [d.to_dict() for d in destinations]
    }), 200

@destinations_bp.route('/<string:dest_id>', methods=['GET'])
def get_destination(dest_id):
    destination = Destination.query.get(dest_id)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404
        
    data = destination.to_dict()
    data['hotels'] = [h.to_dict() for h in destination.hotels.all()]
    data['guides'] = [g.to_dict() for g in destination.guides.all()]
    return jsonify({'destination': data}), 200
