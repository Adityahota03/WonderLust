import uuid
from ..extensions import db

class Destination(db.Model):
    __tablename__ = 'destinations'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    region = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    banner_url = db.Column(db.String(500), nullable=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    is_popular = db.Column(db.Boolean, default=False)
    rating = db.Column(db.Float, default=4.8)
    visitor_count = db.Column(db.String(50), default="1.2M+ yearly visitors")

    # Relationships
    hotels = db.relationship('Hotel', backref='destination', lazy='dynamic')
    guides = db.relationship('Guide', backref='destination', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'country': self.country,
            'region': self.region,
            'description': self.description,
            'image_url': self.image_url,
            'banner_url': self.banner_url or self.image_url,
            'lat': self.lat,
            'lng': self.lng,
            'is_popular': self.is_popular,
            'rating': self.rating,
            'visitor_count': self.visitor_count,
            'hotel_count': self.hotels.count(),
            'guide_count': self.guides.count()
        }
