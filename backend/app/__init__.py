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

    # Auto create database tables safely
    try:
        with app.app_context():
            db.create_all()
    except Exception as e:
        app.logger.warning(f"Database table creation skipped or failed on boot: {e}")

    # Fallback route to serve frontend if Vercel routes non-API requests to Flask
    import os
    from flask import send_from_directory
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'dist'))

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path.startswith('api'):
            return jsonify({'error': 'Endpoint not found', 'path': f'/{path}'}), 404
        if os.path.exists(dist_dir):
            file_path = os.path.join(dist_dir, path)
            if path and os.path.isfile(file_path):
                return send_from_directory(dist_dir, path)
            index_path = os.path.join(dist_dir, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(dist_dir, 'index.html')
        return jsonify({'status': 'ok', 'app': 'Travel Booking Platform API'}), 200

    return app
