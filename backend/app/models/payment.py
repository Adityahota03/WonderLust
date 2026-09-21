import uuid
import random
import string
from datetime import datetime, timezone
from ..extensions import db

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = db.Column(db.String(36), db.ForeignKey('bookings.id'), nullable=False, unique=True)
    amount = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.String(10), default='USD')
    status = db.Column(db.String(30), default='succeeded')  # 'succeeded', 'pending', 'failed', 'refunded'
    payment_method = db.Column(db.String(50), default='Credit Card')
    provider_ref = db.Column(db.String(100), nullable=False)
    card_last4 = db.Column(db.String(4), default='4242')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'amount': self.amount,
            'currency': self.currency,
            'status': self.status,
            'payment_method': self.payment_method,
            'provider_ref': self.provider_ref,
            'card_last4': self.card_last4,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
