#!/bin/bash

# Exit on error
set -e

# Configuration
APP_DIR="/var/www/world-kpi-dashboard"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
NGINX_CONF="/etc/nginx/sites-available/world-kpi-dashboard"
NGINX_ENABLED="/etc/nginx/sites-enabled/world-kpi-dashboard"
SERVICE_FILE="/etc/systemd/system/world-kpi-backend.service"

# Create application directory
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Backend deployment
echo "Deploying backend..."
cd $BACKEND_DIR

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create logs directory
mkdir -p logs

# Copy environment file
cp .env.production .env

# Frontend deployment
echo "Deploying frontend..."
cd $FRONTEND_DIR

# Install dependencies
npm install

# Build frontend
npm run build

# Configure Nginx
echo "Configuring Nginx..."
sudo cp deploy/nginx.conf $NGINX_CONF
sudo ln -sf $NGINX_CONF $NGINX_ENABLED
sudo rm -f /etc/nginx/sites-enabled/default

# Configure systemd service
echo "Configuring systemd service..."
sudo cp backend/world-kpi-backend.service $SERVICE_FILE
sudo systemctl daemon-reload
sudo systemctl enable world-kpi-backend

# Set permissions
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

# Restart services
echo "Restarting services..."
sudo systemctl restart world-kpi-backend
sudo systemctl restart nginx

echo "Deployment completed successfully!" 