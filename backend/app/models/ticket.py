import uuid
from datetime import datetime
from ..extensions import db

class Ticket(db.Model):
    __tablename__ = 'tickets'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    transport_type = db.Column(db.String(30), nullable=False)  # 'flight', 'train', 'bus'
    carrier = db.Column(db.String(100), nullable=False)        # 'Air France', 'Shinkansen', 'Amtrak'
    carrier_logo = db.Column(db.String(500), nullable=True)
    carrier_code = db.Column(db.String(30), nullable=False)    # 'AF 1234', 'N700S', 'ES 9520'
    origin = db.Column(db.String(100), nullable=False)         # 'London Heathrow (LHR)'
    origin_city = db.Column(db.String(100), nullable=False)    # 'London'
    destination = db.Column(db.String(100), nullable=False)    # 'Paris Charles de Gaulle (CDG)'
    destination_city = db.Column(db.String(100), nullable=False) # 'Paris'
    departure_time = db.Column(db.String(50), nullable=False)  # '08:30 AM' or ISO format
    arrival_time = db.Column(db.String(50), nullable=False)    # '10:45 AM' or ISO format
    departure_date = db.Column(db.String(30), nullable=False)  # '2026-10-15'
    duration = db.Column(db.String(50), nullable=False)        # '1h 15m'
    stops = db.Column(db.Integer, default=0)                   # 0 = Direct, 1 = 1 stop
    class_type = db.Column(db.String(50), default='Economy')   # 'Economy', 'Business', 'First'
    baggage_allowance = db.Column(db.String(100), default='1 Carry-on + 1 Checked Bag (23kg)')
    price = db.Column(db.Integer, nullable=False)              # USD
    seats_available = db.Column(db.Integer, default=18)
    lat_origin = db.Column(db.Float, nullable=True)
    lng_origin = db.Column(db.Float, nullable=True)
    lat_destination = db.Column(db.Float, nullable=True)
    lng_destination = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'transport_type': self.transport_type,
            'carrier': self.carrier,
            'carrier_logo': self.carrier_logo,
            'carrier_code': self.carrier_code,
            'origin': self.origin,
            'origin_city': self.origin_city,
            'destination': self.destination,
            'destination_city': self.destination_city,
            'departure_time': self.departure_time,
            'arrival_time': self.arrival_time,
            'departure_date': self.departure_date,
            'duration': self.duration,
            'stops': self.stops,
            'class_type': self.class_type,
            'baggage_allowance': self.baggage_allowance,
            'price': self.price,
            'seats_available': self.seats_available,
            'lat_origin': self.lat_origin,
            'lng_origin': self.lng_origin,
            'lat_destination': self.lat_destination,
            'lng_destination': self.lng_destination
        }
