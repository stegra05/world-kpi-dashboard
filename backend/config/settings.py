import os
from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Data file path
DATA_FILE = os.path.join(BASE_DIR, 'data', 'world_kpi_anonym.csv')

# API settings
API_V1_PREFIX = '/api/v1'
# TODO: Restrict CORS origins for production - this is a temporary configuration for testing only
CORS_ORIGINS = ["*"]

# Server settings
HOST = "0.0.0.0"
PORT = 8000
DEBUG = True 