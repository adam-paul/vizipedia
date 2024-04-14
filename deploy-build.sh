#!/bin/bash

# Build the frontend and collect static files for Heroku deployment

# Navigate to frontend and build the React app
cd frontend
npm install
npm run build

# Check if build directories exist
if [ ! -d "build/static" ] || [ ! -d "build/markdown" ]; then
  echo "Build directories not found after npm build."
  exit 1
fi

# Navigate back to root and run collectstatic
cd ..
python backend/manage.py collectstatic --noinput

# Start the server with Gunicorn
gunicorn backend.vizipedia.wsgi --log-file -