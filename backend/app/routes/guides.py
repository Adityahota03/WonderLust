from flask import Blueprint, request, jsonify
from ..models.guide import Guide

guides_bp = Blueprint('guides', __name__, url_prefix='/api/guides')

@guides_bp.route('', methods=['GET'])
def get_guides():
    dest_id = request.args.get('destination_id')
    search = request.args.get('search', '').strip().lower()
    max_rate = request.args.get('max_rate', type=int)
    featured = request.args.get('featured', '').lower() == 'true'

    query = Guide.query

    if dest_id:
        query = query.filter_by(destination_id=dest_id)
    if featured:
        query = query.filter_by(featured=True)
    if max_rate is not None:
        query = query.filter(Guide.daily_rate <= max_rate)
    if search:
        query = query.filter(
            (Guide.name.ilike(f'%{search}%')) |
            (Guide.bio.ilike(f'%{search}%')) |
            (Guide.specialties_json.ilike(f'%{search}%'))
        )

    guides = query.order_by(Guide.rating.desc()).all()
    return jsonify({
        'count': len(guides),
        'guides': [g.to_dict() for g in guides]
    }), 200

@guides_bp.route('/<string:guide_id>', methods=['GET'])
def get_guide(guide_id):
    guide = Guide.query.get(guide_id)
    if not guide:
        return jsonify({'error': 'Guide not found'}), 404
    return jsonify({'guide': guide.to_dict()}), 200
