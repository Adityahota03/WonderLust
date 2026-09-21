import uuid
import json
import random
import string
from datetime import datetime, timezone
from ..extensions import db

def generate_booking_ref():
    prefix = "TRV"
    chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=7))
    return f"{prefix}-{chars}"

class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reference_code = db.Column(db.String(20), unique=True, nullable=False, default=generate_booking_ref)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    booking_type = db.Column(db.String(30), nullable=False)  # 'hotel', 'ticket', 'guide'
    item_id = db.Column(db.String(36), nullable=False)       # ID of hotel/room/ticket/guide
    title = db.Column(db.String(200), nullable=False)        # E.g. "The Ritz Paris - Deluxe King"
    image_url = db.Column(db.String(500), nullable=True)
    destination_name = db.Column(db.String(100), nullable=True)
    details_json = db.Column(db.Text, nullable=False)        # Dates, guests, passengers, rooms etc.
    total_amount = db.Column(db.Integer, nullable=False)     # USD
    currency = db.Column(db.String(10), default='USD')
    status = db.Column(db.String(30), default='confirmed')   # 'pending', 'confirmed', 'cancelled'
    start_date = db.Column(db.String(30), nullable=True)
    end_date = db.Column(db.String(30), nullable=True)
    guest_name = db.Column(db.String(120), nullable=True)
    guest_email = db.Column(db.String(120), nullable=True)
    guest_phone = db.Column(db.String(40), nullable=True)
    special_requests = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    payment = db.relationship('Payment', backref='booking', uselist=False, cascade='all, delete-orphan')

    @property
    def details(self):
        return json.loads(self.details_json) if self.details_json else {}

    def to_dict(self):
        return {
            'id': self.id,
            'reference_code': self.reference_code,
            'user_id': self.user_id,
            'booking_type': self.booking_type,
            'item_id': self.item_id,
            'title': self.title,
            'image_url': self.image_url,
            'destination_name': self.destination_name,
            'details': self.details,
            'total_amount': self.total_amount,
            'currency': self.currency,
            'status': self.status,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'guest_name': self.guest_name,
            'guest_email': self.guest_email,
            'guest_phone': self.guest_phone,
            'special_requests': self.special_requests,
            'payment': self.payment.to_dict() if self.payment else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
