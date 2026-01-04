#!/bin/bash
# Initialize Cloudflare D1 database with schema

set -e

echo "🗄️  Initializing Fitness RPG database..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler is not installed. Install it with: npm install"
    exit 1
fi

# Execute schema on remote database
echo "📝 Creating database schema..."
wrangler d1 execute fitness-rpg-ts --remote --file=./schema.sql

echo "✅ Database initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Create a .dev.vars file with your STRAVA_CLIENT_SECRET"
echo "2. Run 'npm run dev' to start local development"
echo "3. Or run 'npm run deploy' to deploy to production"
