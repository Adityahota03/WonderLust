import uuid
from flask import Blueprint, request, jsonify
from ..utils.auth_helpers import token_required

payments_bp = Blueprint('payments', __name__, url_prefix='/api/payments')

@payments_bp.route('/checkout', methods=['POST'])
@token_required
def checkout(current_user):
    data = request.get_json() or {}
    amount = data.get('amount')
    currency = data.get('currency', 'USD')
    
    if not amount:
        return jsonify({'error': 'Amount is required'}), 400

    # Simulate payment intent creation
    client_secret = f"pi_{uuid.uuid4().hex}_secret_{uuid.uuid4().hex[:10]}"
    return jsonify({
        'client_secret': client_secret,
        'amount': amount,
        'currency': currency,
        'status': 'requires_payment_method',
        'publishable_key': 'pk_test_simulated_travel_token'
    }), 200

@payments_bp.route('/webhook', methods=['POST'])
def payment_webhook():
    # Simulated webhook callback for Stripe/PayPal
    payload = request.get_json() or {}
    event_type = payload.get('type', 'payment_intent.succeeded')
    return jsonify({'received': True, 'event': event_type}), 200
