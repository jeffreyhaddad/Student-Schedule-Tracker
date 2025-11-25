#!/bin/bash

echo "Setting up Student Tracker Database..."

# Create database if it doesn't exist
sudo -u postgres psql -c "CREATE DATABASE student_tracker;" 2>/dev/null || echo "Database already exists"

# Load schema
sudo -u postgres psql -d student_tracker -f database/schema.sql

echo "✓ Database setup complete!"
echo "✓ Schema loaded successfully"
echo ""
echo "Sample credentials:"
echo "  Username: johndoe"
echo "  Email: johndoe@email.com"
echo ""
echo "To start the server: npm run start:dev"
