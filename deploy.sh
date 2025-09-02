#!/bin/bash

# 🚀 Chatbot Beta - Deployment Script
# This script deploys the chatbot to production

echo "🚀 Deploying Chatbot Beta to Production..."
echo "=================================================="

# Configuration
APP_NAME="chatbot_beta"
DEPLOY_DIR="/opt/chatbot_beta"
SERVICE_NAME="chatbot-beta"
USER="chatbot"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

echo "✅ Running as root"

# Create deployment directory
echo "🔧 Creating deployment directory..."
mkdir -p $DEPLOY_DIR
mkdir -p $DEPLOY_DIR/logs
mkdir -p $DEPLOY_DIR/backups

# Copy application files
echo "🔧 Copying application files..."
cp -r * $DEPLOY_DIR/
chown -R $USER:$USER $DEPLOY_DIR

# Create systemd service file
echo "🔧 Creating systemd service..."
cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=Chatbot Beta Flask Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$DEPLOY_DIR
Environment=PATH=$DEPLOY_DIR/venv/bin
ExecStart=$DEPLOY_DIR/venv/bin/python tester_dashboard.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
echo "🔧 Enabling systemd service..."
systemctl daemon-reload
systemctl enable $SERVICE_NAME

# Create nginx configuration (if nginx is installed)
if command -v nginx &> /dev/null; then
    echo "🔧 Creating nginx configuration..."
    cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /static/ {
        alias $DEPLOY_DIR/assets/;
        expires 30d;
    }
}
EOF

    # Enable nginx site
    ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    echo "✅ Nginx configuration created and enabled"
else
    echo "⚠️  Nginx not found, skipping nginx configuration"
fi

# Set up firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    echo "🔧 Configuring firewall..."
    ufw allow 5001/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "✅ Firewall configured"
else
    echo "⚠️  UFW not found, skipping firewall configuration"
fi

# Start the service
echo "🔧 Starting chatbot service..."
systemctl start $SERVICE_NAME

# Check service status
echo "🔧 Checking service status..."
sleep 3
systemctl status $SERVICE_NAME --no-pager

echo ""
echo "🎉 Deployment Complete!"
echo "=================================================="
echo "📁 Application deployed to: $DEPLOY_DIR"
echo "🔧 Service name: $SERVICE_NAME"
echo "🌐 Access URL: http://your-domain.com"
echo "📊 Service status: systemctl status $SERVICE_NAME"
echo "📝 Logs: journalctl -u $SERVICE_NAME -f"
echo ""
echo "🔧 Useful commands:"
echo "   Start: systemctl start $SERVICE_NAME"
echo "   Stop: systemctl stop $SERVICE_NAME"
echo "   Restart: systemctl restart $SERVICE_NAME"
echo "   Status: systemctl status $SERVICE_NAME"
echo "   Logs: journalctl -u $SERVICE_NAME -f"
echo "=================================================="

