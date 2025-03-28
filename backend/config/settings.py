import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Default CORS origins for development
DEFAULT_CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

# Load CORS origins from environment variable
CORS_ORIGINS = os.getenv('BACKEND_CORS_ORIGINS', ','.join(DEFAULT_CORS_ORIGINS)).split(',')

# Default data file path
DEFAULT_DATA_PATH = os.path.join(BASE_DIR, 'data', 'world_kpi_anonym.csv')

# Load data file path from environment variable
DATA_FILE = os.getenv('BACKEND_DATA_PATH', DEFAULT_DATA_PATH)

# API settings
API_V1_PREFIX = '/api/v1'

# Server settings
HOST = "0.0.0.0"
PORT = 8000
DEBUG = True 