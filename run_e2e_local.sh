#!/bin/bash

echo "Building and starting Docker Compose for testing..."
docker compose -f docker-compose.test.yml build
docker compose -f docker-compose.test.yml up -d

echo "Waiting for services to be ready (30s)..."
sleep 30

echo "Running Playwright E2E tests..."
cd e2e
npx playwright test

echo "Tearing down Docker Compose..."
cd ..
docker compose -f docker-compose.test.yml down -v

echo "Done!"
