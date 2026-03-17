#!/bin/bash

# Chat Feature Test Script
# This script helps validate the chat feature setup

set -e

echo "================================"
echo "Chat Feature Test Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Environment Variables
echo "1. Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${RED}✗ NEXT_PUBLIC_SUPABASE_URL not set${NC}"
    echo "  Please add this in Cursor Dashboard (Cloud Agents > Secrets)"
    ENV_OK=false
else
    echo -e "${GREEN}✓ NEXT_PUBLIC_SUPABASE_URL is set${NC}"
    ENV_OK=true
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}✗ NEXT_PUBLIC_SUPABASE_ANON_KEY not set${NC}"
    echo "  Please add this in Cursor Dashboard (Cloud Agents > Secrets)"
    ENV_OK=false
else
    echo -e "${GREEN}✓ NEXT_PUBLIC_SUPABASE_ANON_KEY is set${NC}"
fi

echo ""

# Check 2: Dependencies
echo "2. Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo -e "${RED}✗ node_modules not found${NC}"
    echo "  Running: npm install"
    npm install
else
    echo -e "${GREEN}✓ node_modules exists${NC}"
fi

if [ ! -f "node_modules/@supabase/supabase-js/package.json" ]; then
    echo -e "${RED}✗ @supabase/supabase-js not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ @supabase/supabase-js installed${NC}"
fi

echo ""

# Check 3: Chat page exists
echo "3. Checking chat feature files..."
if [ ! -f "app/[locale]/app/play-now/page.tsx" ]; then
    echo -e "${RED}✗ Chat page not found${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Chat page exists${NC}"
fi

if [ ! -f "lib/supabase.ts" ]; then
    echo -e "${RED}✗ Supabase client not found${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Supabase client exists${NC}"
fi

echo ""

# Check 4: Dev server
echo "4. Checking dev server..."
if lsof -i :3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Dev server running on port 3001${NC}"
    SERVER_RUNNING=true
elif lsof -i :3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Dev server running on port 3000${NC}"
    SERVER_RUNNING=true
else
    echo -e "${YELLOW}⚠ Dev server not running${NC}"
    echo "  Start it with: npm run dev"
    SERVER_RUNNING=false
fi

echo ""

# Check 5: Database connectivity (if env vars are set)
if [ "$ENV_OK" = true ]; then
    echo "5. Testing Supabase connection..."
    
    # Create a simple test script
    cat > /tmp/test-supabase.mjs << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

try {
    const { data, error } = await supabase.from('games').select('id').limit(1);
    if (error) {
        console.error('ERROR:', error.message);
        process.exit(1);
    }
    console.log('SUCCESS: Connected to Supabase');
    process.exit(0);
} catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
}
EOF

    if node /tmp/test-supabase.mjs 2>&1 | grep -q "SUCCESS"; then
        echo -e "${GREEN}✓ Supabase connection successful${NC}"
    else
        echo -e "${RED}✗ Supabase connection failed${NC}"
        echo "  Check your credentials and database setup"
    fi
    
    rm -f /tmp/test-supabase.mjs
else
    echo "5. Skipping database test (env vars not set)"
fi

echo ""
echo "================================"
echo "Test Summary"
echo "================================"

if [ "$ENV_OK" = true ] && [ "$SERVER_RUNNING" = true ]; then
    echo -e "${GREEN}✓ Ready to test chat feature!${NC}"
    echo ""
    echo "Access the chat at:"
    if lsof -i :3001 > /dev/null 2>&1; then
        echo "  http://localhost:3001/en/app/play-now"
    else
        echo "  http://localhost:3000/en/app/play-now"
    fi
    echo ""
    echo "Test checklist:"
    echo "  1. Select different game lobbies"
    echo "  2. Send messages in chat"
    echo "  3. Test real-time updates (open in 2 browsers)"
    echo "  4. Click on gamertags to view profiles"
    echo "  5. Test message grouping (send multiple messages)"
    echo ""
else
    echo -e "${YELLOW}⚠ Setup incomplete${NC}"
    echo ""
    if [ "$ENV_OK" != true ]; then
        echo "Next steps:"
        echo "  1. Add Supabase credentials to Cursor Dashboard"
        echo "     (Cloud Agents > Secrets)"
        echo "     - NEXT_PUBLIC_SUPABASE_URL"
        echo "     - NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo ""
    fi
    if [ "$SERVER_RUNNING" != true ]; then
        echo "  2. Start the dev server: npm run dev"
        echo ""
    fi
fi

echo "For detailed test plan, see: CHAT_FEATURE_TEST_PLAN.md"
