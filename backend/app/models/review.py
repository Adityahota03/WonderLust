import uuid
from datetime import datetime, timezone
from ..extensions import db

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    hotel_id = db.Column(db.String(36), db.ForeignKey('hotels.id'), nullable=True)
    guide_id = db.Column(db.String(36), db.ForeignKey('guides.id'), nullable=True)
    rating = db.Column(db.Integer, nullable=False)  # 1 to 5
    title = db.Column(db.String(150), nullable=True)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else 'Verified Traveler',
            'user_avatar': self.user.avatar_url if self.user else None,
            'hotel_id': self.hotel_id,
            'guide_id': self.guide_id,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'created_at': self.created_at.strftime("%B %d, %Y") if self.created_at else None
        }
