import uuid
import json
from ..extensions import db

class Hotel(db.Model):
    __tablename__ = 'hotels'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    destination_id = db.Column(db.String(36), db.ForeignKey('destinations.id'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    tagline = db.Column(db.String(255), nullable=True)
    address = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    stars = db.Column(db.Integer, default=4)
    rating = db.Column(db.Float, default=4.5)
    review_count = db.Column(db.Integer, default=120)
    starting_price = db.Column(db.Integer, nullable=False)  # USD per night
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    gallery_json = db.Column(db.Text, nullable=True)  # JSON array of image URLs
    amenities_json = db.Column(db.Text, nullable=True)  # JSON array of amenity strings
    featured = db.Column(db.Boolean, default=False)
    cancellation_policy = db.Column(db.String(200), default="Free cancellation up to 48 hours before check-in")

    # Relationships
    rooms = db.relationship('Room', backref='hotel', lazy='dynamic', cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='hotel', lazy='dynamic', cascade='all, delete-orphan')

    @property
    def gallery(self):
        return json.loads(self.gallery_json) if self.gallery_json else [self.image_url]

    @property
    def amenities(self):
        return json.loads(self.amenities_json) if self.amenities_json else ["Free WiFi", "Air Conditioning", "Room Service"]

    def to_dict(self, include_rooms=False):
        data = {
            'id': self.id,
            'destination_id': self.destination_id,
            'destination_name': self.destination.name if self.destination else '',
            'country': self.destination.country if self.destination else '',
            'name': self.name,
            'tagline': self.tagline,
            'address': self.address,
            'description': self.description,
            'stars': self.stars,
            'rating': self.rating,
            'review_count': self.review_count,
            'starting_price': self.starting_price,
            'lat': self.lat,
            'lng': self.lng,
            'image_url': self.image_url,
            'gallery': self.gallery,
            'amenities': self.amenities,
            'featured': self.featured,
            'cancellation_policy': self.cancellation_policy
        }
        if include_rooms:
            data['rooms'] = [room.to_dict() for room in self.rooms.all()]
        return data


class Room(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hotel_id = db.Column(db.String(36), db.ForeignKey('hotels.id'), nullable=False)
    room_type = db.Column(db.String(80), nullable=False)  # 'Deluxe King', 'Ocean Suite', 'Executive Villa'
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    capacity = db.Column(db.Integer, default=2)  # Max guests
    bed_type = db.Column(db.String(80), default="1 King Bed")
    size_sqm = db.Column(db.Integer, default=35)
    price_per_night = db.Column(db.Integer, nullable=False)
    perks_json = db.Column(db.Text, nullable=True)  # JSON array: ["Ocean View", "Free Breakfast"]
    image_url = db.Column(db.String(500), nullable=True)
    available_count = db.Column(db.Integer, default=5)

    @property
    def perks(self):
        return json.loads(self.perks_json) if self.perks_json else ["Free High-Speed WiFi", "Breakfast Included"]

    def to_dict(self):
        return {
            'id': self.id,
            'hotel_id': self.hotel_id,
            'room_type': self.room_type,
            'name': self.name,
            'description': self.description,
            'capacity': self.capacity,
            'bed_type': self.bed_type,
            'size_sqm': self.size_sqm,
            'price_per_night': self.price_per_night,
            'perks': self.perks,
            'image_url': self.image_url,
            'available_count': self.available_count
        }
