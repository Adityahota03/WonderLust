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

if __name__ == '__main__':
    app.run()
