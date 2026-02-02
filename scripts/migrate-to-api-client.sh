#!/bin/bash

# Script to migrate all direct fetch() calls to use apiClient
# This ensures MSW can properly intercept all requests

VENUE_APP_DIR="/home/omid/WebstormProjects/smartClubCRM/apps/venue-app"

echo "🔍 Finding all files with fetch() calls..."

# Find all TypeScript/TSX files with fetch calls
FILES=$(grep -r "await fetch(" "$VENUE_APP_DIR/app" --include="*.tsx" --include="*.ts" | grep -v node_modules | cut -d: -f1 | sort -u)

echo "📝 Found the following files:"
echo "$FILES"

echo ""
echo "✅ Manual migration required for each file:"
echo "1. Add: import { apiClient } from '@/lib/api-client';"
echo "2. Replace:"
echo "   OLD: const response = await fetch('/api/...');"
echo "        const data = await response.json();"
echo "   NEW: const result = await apiClient.get('/...');"
echo ""
echo "3. Update error handling to use result.success, result.data, result.error"

echo ""
echo "📋 Files to migrate:"
echo "$FILES"
