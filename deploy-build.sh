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

# Back to root and run collectstatic
cd ..
cd backend
python manage.py collectstatic --noinput

# Start the server with Gunicorn
cd ..
gunicorn backend.vizipedia.wsgi -D

# Indicate successful completion
echo "Deployment completed successfully."