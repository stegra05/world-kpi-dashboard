#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Creating next-env.d.ts file..."
echo "/// <reference types=\"next\" />" > next-env.d.ts
echo "/// <reference types=\"next/image-types/global\" />" >> next-env.d.ts

echo "Starting the development server..."
npm run dev 