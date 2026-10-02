import os
import sys
from dotenv import load_dotenv

# Ensure backend directory is in python path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Load environment variables
for env_path in [os.path.join(backend_dir, '.env'), os.path.join(root_dir, '.env')]:
    if os.path.exists(env_path):
        load_dotenv(env_path)
load_dotenv()

from app import create_app

app = create_app()


class VercelPathRewriteFix:
    """
    Middleware to handle Vercel's updated routing engine where internal
    rewrites route requests using the destination path (e.g. /api/index.py).
    Restores the original requested URI from Vercel edge headers so Flask routes match.
    """
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        original_uri = (
            environ.get('HTTP_X_FORWARDED_URI')
            or environ.get('HTTP_X_VERCEL_FORWARDED_PATH')
            or environ.get('HTTP_X_MATCHED_PATH')
        )
        if original_uri:
            # Strip query parameters (they remain available in QUERY_STRING)
            clean_path = original_uri.split('?')[0]
            if clean_path and not clean_path.endswith('.py'):
                environ['PATH_INFO'] = clean_path

        return self.wsgi_app(environ, start_response)


app.wsgi_app = VercelPathRewriteFix(app.wsgi_app)

if __name__ == '__main__':
    app.run()
