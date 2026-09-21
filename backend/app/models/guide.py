import uuid
import json
from ..extensions import db

class Guide(db.Model):
    __tablename__ = 'guides'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    destination_id = db.Column(db.String(36), db.ForeignKey('destinations.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(150), default="Certified Local Expert & Tour Host")
    photo_url = db.Column(db.String(500), nullable=False)
    bio = db.Column(db.Text, nullable=False)
    languages_json = db.Column(db.Text, nullable=False)    # JSON array ["English", "French", "Japanese"]
    specialties_json = db.Column(db.Text, nullable=False)  # JSON array ["Culinary Tours", "Historical Walk", "Photography"]
    rating = db.Column(db.Float, default=4.9)
    review_count = db.Column(db.Integer, default=58)
    daily_rate = db.Column(db.Integer, nullable=False)     # USD per day/tour
    experience_years = db.Column(db.Integer, default=7)
    contact_email = db.Column(db.String(120), nullable=True)
    is_verified = db.Column(db.Boolean, default=True)
    featured = db.Column(db.Boolean, default=False)
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)

    @property
    def languages(self):
        return json.loads(self.languages_json) if self.languages_json else ["English"]

    @property
    def specialties(self):
        return json.loads(self.specialties_json) if self.specialties_json else ["Culture & Sightseeing"]

    def to_dict(self):
        return {
            'id': self.id,
            'destination_id': self.destination_id,
            'destination_name': self.destination.name if self.destination else '',
            'country': self.destination.country if self.destination else '',
            'name': self.name,
            'title': self.title,
            'photo_url': self.photo_url,
            'bio': self.bio,
            'languages': self.languages,
            'specialties': self.specialties,
            'rating': self.rating,
            'review_count': self.review_count,
            'daily_rate': self.daily_rate,
            'experience_years': self.experience_years,
            'is_verified': self.is_verified,
            'featured': self.featured,
            'lat': self.lat or (self.destination.lat if self.destination else 0),
            'lng': self.lng or (self.destination.lng if self.destination else 0)
        }
