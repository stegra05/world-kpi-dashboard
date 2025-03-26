import multiprocessing
import os
from dotenv import load_dotenv

load_dotenv()

# Server socket
bind = f"{os.getenv('HOST', '0.0.0.0')}:{os.getenv('PORT', '8000')}"

# Worker processes
workers = int(os.getenv('WORKERS', multiprocessing.cpu_count() * 2 + 1))
worker_class = "uvicorn.workers.UvicornWorker"

# Timeouts
timeout = 120
keepalive = 5

# Logging
accesslog = "logs/access.log"
errorlog = "logs/error.log"
loglevel = os.getenv('LOG_LEVEL', 'info')

# Process name
proc_name = "world_kpi_backend"

# Worker tmp directory
worker_tmp_dir = "/dev/shm"

# SSL configuration (if using HTTPS)
# keyfile = "path/to/key.pem"
# certfile = "path/to/cert.pem" 