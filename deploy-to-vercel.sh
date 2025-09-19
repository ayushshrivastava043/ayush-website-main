#!/bin/bash

# 🚀 Ayush Portal - Vercel Deployment Script
# This script deploys the Ayush Portal to Vercel

echo "🚀 Deploying Ayush Portal to Vercel..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    print_error "index.html not found. Please run this script from the ayush_portal directory."
    exit 1
fi

print_status "Found index.html - we're in the right directory"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    
    # Try to install Vercel CLI
    if command -v npm &> /dev/null; then
        print_status "Installing Vercel CLI via npm..."
        npm install -g vercel@latest
    elif command -v yarn &> /dev/null; then
        print_status "Installing Vercel CLI via yarn..."
        yarn global add vercel@latest
    else
        print_error "Neither npm nor yarn found. Please install Vercel CLI manually:"
        echo "npm install -g vercel"
        echo "or visit: https://vercel.com/cli"
        exit 1
    fi
fi

print_status "Vercel CLI is available"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please log in..."
    vercel login
fi

print_status "Logged in to Vercel"

# Create .vercelignore file if it doesn't exist
if [ ! -f ".vercelignore" ]; then
    print_status "Creating .vercelignore file..."
    cat > .vercelignore << EOF
node_modules
.git
.gitignore
README.md
*.log
.env
.env.local
.env.production.local
.env.development.local
deployments
logs
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env
venv
.venv
pip-log.txt
pip-delete-this-directory.txt
.coverage
.pytest_cache
.mypy_cache
.tox
.cache
nosetests.xml
coverage.xml
*.cover
.hypothesis
.DS_Store
*.swp
*.swo
*~
EOF
    print_status ".vercelignore created"
fi

# Deploy to Vercel
print_header "Deploying to Vercel"

# Check if this is a new project or existing one
if [ -d ".vercel" ]; then
    print_status "Existing Vercel project detected. Deploying updates..."
    vercel --prod
else
    print_status "New Vercel project. Setting up deployment..."
    vercel --prod
fi

# Check deployment status
if [ $? -eq 0 ]; then
    print_status "Deployment successful!"
    
    # Get the deployment URL
    DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null)
    
    if [ -n "$DEPLOYMENT_URL" ] && [ "$DEPLOYMENT_URL" != "null" ]; then
        print_header "🎉 Deployment Complete!"
        echo "🌐 Your Ayush Portal is now live at:"
        echo "   https://$DEPLOYMENT_URL"
        echo ""
        echo "📊 You can manage your deployment at:"
        echo "   https://vercel.com/dashboard"
        echo ""
        echo "🔧 Useful commands:"
        echo "   vercel ls                    # List deployments"
        echo "   vercel logs                  # View logs"
        echo "   vercel domains               # Manage domains"
        echo "   vercel env                   # Manage environment variables"
    else
        print_status "Deployment completed successfully!"
        print_warning "Could not retrieve deployment URL automatically."
        echo "Check your Vercel dashboard: https://vercel.com/dashboard"
    fi
    
else
    print_error "Deployment failed!"
    echo "Please check the error messages above and try again."
    exit 1
fi

print_header "Deployment Summary"
echo "✅ Ayush Portal deployed to Vercel"
echo "🌐 Access your portal from anywhere in the world"
echo "📱 Mobile-friendly and fast loading"
echo "🔄 Automatic deployments on code changes"
echo ""
echo "Next steps:"
echo "1. Share the URL with others"
echo "2. Set up a custom domain (optional)"
echo "3. Configure environment variables if needed"
echo "4. Monitor performance in Vercel dashboard"
