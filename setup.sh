#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Creating next-env.d.ts file..."
echo "/// <reference types=\"next\" />" > next-env.d.ts
echo "/// <reference types=\"next/image-types/global\" />" >> next-env.d.ts

echo "Would you like to run with the custom server? (y/n)"
read -r choice

if [[ "$choice" =~ ^[Yy]$ ]]; then
  echo "Starting the custom server..."
  npm run server
else
  echo "Starting the development server..."
  npm run dev
fi 