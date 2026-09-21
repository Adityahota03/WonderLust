from flask import Flask, jsonify
from .config import Config
from .extensions import db, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.destinations import destinations_bp
    from .routes.hotels import hotels_bp
    from .routes.tickets import tickets_bp
    from .routes.guides import guides_bp
    from .routes.search import search_bp
    from .routes.bookings import bookings_bp
    from .routes.payments import payments_bp
    from .routes.contact import contact_bp
    from .routes.admin import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(destinations_bp)
    app.register_blueprint(hotels_bp)
    app.register_blueprint(tickets_bp)
    app.register_blueprint(guides_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(admin_bp)

    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({'status': 'ok', 'app': 'Travel Booking Platform API', 'version': '1.0.0'}), 200

    # Auto create database tables
    with app.app_context():
        db.create_all()

    return app
