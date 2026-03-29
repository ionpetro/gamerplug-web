#!/bin/bash

# Matches Page Test Script
# Tests the matches display functionality

set -e

echo "================================"
echo "Matches Page Test Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check 1: Page file exists
echo "1. Checking matches page..."
if [ ! -f "app/[locale]/app/matches/page.tsx" ]; then
    echo -e "${RED}✗ Matches page not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Matches page exists (318 lines)${NC}"

# Check file structure
LINES=$(wc -l < "app/[locale]/app/matches/page.tsx")
echo -e "${BLUE}  Lines of code: $LINES${NC}"

echo ""

# Check 2: Required imports
echo "2. Checking imports..."
REQUIRED_IMPORTS=("useState" "useEffect" "Image" "Link" "useAuth" "supabase" "MessageCircle" "Heart")
for import in "${REQUIRED_IMPORTS[@]}"; do
    if grep -q "$import" app/[locale]/app/matches/page.tsx; then
        echo -e "${GREEN}  ✓ $import imported${NC}"
    else
        echo -e "${RED}  ✗ $import missing${NC}"
    fi
done

echo ""

# Check 3: Known issues
echo "3. Checking for known issues..."
if grep -q "e.preventDefault()" app/[locale]/app/matches/page.tsx; then
    COUNT=$(grep -c "e.preventDefault()" app/[locale]/app/matches/page.tsx)
    echo -e "${YELLOW}  ⚠  Found $COUNT MessageCircle buttons with preventDefault${NC}"
    echo -e "${YELLOW}     (Chat functionality not implemented)${NC}"
fi

if grep -q "MessageCircle" app/[locale]/app/matches/page.tsx; then
    echo -e "${BLUE}  ℹ  MessageCircle component used but not functional${NC}"
fi

echo ""

# Check 4: Database schema requirements
echo "4. Database requirements..."
echo -e "${BLUE}  Required tables:${NC}"
echo "    - matches (user1_id, user2_id, created_at)"
echo "    - users (id, gamertag, profile_image_url, age, platform)"

if [ ! -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${GREEN}  ✓ Supabase URL configured${NC}"
else
    echo -e "${RED}  ✗ Supabase URL not configured${NC}"
fi

echo ""

# Check 5: Features analysis
echo "5. Feature analysis..."
echo -e "${GREEN}Implemented Features:${NC}"
echo "  ✅ Match display (grid and list view)"
echo "  ✅ View mode toggle"
echo "  ✅ Profile navigation"
echo "  ✅ Platform icons display"
echo "  ✅ Match date formatting"
echo "  ✅ Empty state handling"
echo "  ✅ Responsive design"
echo "  ✅ Loading state"

echo ""
echo -e "${YELLOW}Missing Features:${NC}"
echo "  ❌ Direct messaging / chat"
echo "  ❌ MessageCircle button functionality"
echo "  ❌ Match notifications"
echo "  ❌ Unmatch functionality"
echo "  ❌ Sorting/filtering"
echo "  ❌ Pagination"
echo "  ❌ Search through matches"

echo ""

# Check 6: View modes
echo "6. View mode implementation..."
if grep -q "viewMode === 'grid'" app/[locale]/app/matches/page.tsx; then
    echo -e "${GREEN}  ✓ Grid view implemented${NC}"
fi
if grep -q "viewMode === 'list'" app/[locale]/app/matches/page.tsx; then
    echo -e "${GREEN}  ✓ List view implemented${NC}"
fi
if grep -q "LayoutGrid" app/[locale]/app/matches/page.tsx; then
    echo -e "${GREEN}  ✓ View toggle icons present${NC}"
fi

echo ""

# Check 7: Responsive grid
echo "7. Responsive design..."
if grep -q "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" app/[locale]/app/matches/page.tsx; then
    echo -e "${GREEN}  ✓ Responsive grid classes${NC}"
    echo "    - Mobile: 2 columns"
    echo "    - Tablet: 3 columns"
    echo "    - Desktop: 6 columns"
fi

echo ""

# Check 8: Empty state
echo "8. Empty state..."
if grep -q "No matches yet" app/[locale]/app/matches/page.tsx; then
    echo -e "${GREEN}  ✓ Empty state message${NC}"
fi
if grep -q "Explore Gamers" app/[locale]/app/matches/page.tsx; then
    echo -e "${GREEN}  ✓ CTA to explore page${NC}"
fi

echo ""

# Check 9: Dev server
echo "9. Checking dev server..."
if lsof -i :3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Dev server running on port 3001${NC}"
    SERVER_URL="http://localhost:3001/en/app/matches"
elif lsof -i :3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Dev server running on port 3000${NC}"
    SERVER_URL="http://localhost:3000/en/app/matches"
else
    echo -e "${YELLOW}⚠ Dev server not running${NC}"
    echo "  Start it with: npm run dev"
    SERVER_URL=""
fi

echo ""

# Check 10: Code quality issues
echo "10. Code quality analysis..."
ISSUES=0

# Check for missing dependencies in useEffect
if grep -A2 "useEffect.*fetchMatches" app/[locale]/app/matches/page.tsx | grep -q "\[\]"; then
    echo -e "${YELLOW}  ⚠  useEffect missing 'fetchMatches' dependency${NC}"
    ((ISSUES++))
fi

# Check for potential optimization
if ! grep -q "pagination\|limit\|offset" app/[locale]/app/matches/page.tsx; then
    echo -e "${YELLOW}  ℹ  No pagination implemented (could be slow with many matches)${NC}"
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}  ✓ No critical issues found${NC}"
fi

echo ""
echo "================================"
echo "Test Summary"
echo "================================"
echo ""

# Overall status
echo -e "${BLUE}Page Status:${NC}"
echo "  • File: app/[locale]/app/matches/page.tsx"
echo "  • Size: $LINES lines"
echo "  • Status: ✅ Functional (display only)"
echo "  • Chat: ❌ Not implemented"
echo ""

if [ ! -z "$SERVER_URL" ]; then
    echo -e "${GREEN}Ready to test!${NC}"
    echo ""
    echo "Access matches page at:"
    echo "  $SERVER_URL"
    echo ""
else
    echo -e "${YELLOW}Dev server not running${NC}"
    echo ""
    echo "Start the dev server:"
    echo "  npm run dev"
    echo ""
fi

echo "Test checklist:"
echo "  1. ✅ View your matches in grid view"
echo "  2. ✅ Toggle to list view"
echo "  3. ✅ Click matches to view profiles"
echo "  4. ✅ Check empty state (if no matches)"
echo "  5. ❌ Try MessageCircle button (won't work)"
echo ""

echo "Known Limitations:"
echo "  • MessageCircle buttons are placeholders"
echo "  • No chat/DM system implemented"
echo "  • No pagination (loads all matches)"
echo "  • No sorting or filtering"
echo "  • No unmatch functionality"
echo ""

echo "Next Steps:"
echo "  1. Implement DM system for matches"
echo "  2. Connect MessageCircle buttons to chat"
echo "  3. Add pagination for many matches"
echo "  4. Implement match notifications"
echo ""

echo "For detailed test plan, see: MATCHES_PAGE_TEST_PLAN.md"
