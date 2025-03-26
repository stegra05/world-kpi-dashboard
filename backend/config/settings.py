import os
from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Data file path
DATA_FILE = os.path.join(BASE_DIR, 'data', 'world_kpi_anonym.csv')

# API settings
API_V1_PREFIX = '/api/v1'
CORS_ORIGINS = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]

# Server settings
HOST = "0.0.0.0"
PORT = 8000
DEBUG = True 