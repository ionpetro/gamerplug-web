# Matches Page Test Plan

## Overview
The Matches page (`/app/[locale]/app/matches`) displays users who have matched with you, similar to dating apps. Users can view their matches in grid or list view and navigate to profiles.

## Feature Description

### Core Functionality
- **Match Display**: Shows all users who have matched with the current user
- **View Modes**: Toggle between grid (6 columns) and list view
- **Profile Navigation**: Click on any match to view their full profile
- **Match Metadata**: Shows gamertag, age, platform icons, and match date
- **Empty State**: Encourages users to explore if no matches exist

### Current Limitations ⚠️
- **No Direct Messaging**: MessageCircle buttons are placeholders (lines 173-180, 284-291)
- **Chat Not Implemented**: Buttons do `e.preventDefault()` - they don't do anything
- **No Chat Integration**: Doesn't connect to Play Now chat or any messaging system

## Technical Details

### File Location
- **Path**: `app/[locale]/app/matches/page.tsx`
- **Lines**: 318 lines
- **Dependencies**: Supabase, Next.js Image, Lucide icons

### Database Schema

#### matches table
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Query Logic
```typescript
// Fetches matches where current user is either user1 or user2
.or(`user1_id.eq.${authUser.id},user2_id.eq.${authUser.id}`)
```

### State Management
- `matches`: Array of Match objects with matched user data
- `loading`: Boolean for loading state
- `viewMode`: 'grid' | 'list' toggle

### Data Flow
```
1. User loads matches page
2. Fetch all matches from database (user1 or user2 = current user)
3. Extract other user IDs
4. Fetch full user profiles for matched users
5. Combine matches with user data
6. Display in selected view mode
```

## Test Scenarios

### Test 1: Initial Load with Matches
**Prerequisites**: User has at least 3 matches in database

**Steps:**
1. Navigate to `/[locale]/app/matches`
2. Observe loading spinner
3. Wait for matches to load

**Expected Results:**
- ✅ Loading spinner shows (Loader2 component)
- ✅ Matches grid displays (default view)
- ✅ Each match card shows:
  - Profile image or default icon
  - Gamertag with @ prefix
  - Age (if available)
  - Platform icons (max 3 in grid, 2 in list)
  - Match date (formatted)
  - Sparkles icon (match indicator)
  - MessageCircle button (hover in grid, always in list)

---

### Test 2: Empty State
**Prerequisites**: User has no matches

**Steps:**
1. Navigate to `/[locale]/app/matches`
2. Observe empty state

**Expected Results:**
- ✅ Heart icon in circle
- ✅ "No matches yet" heading
- ✅ Descriptive text about mobile swiping
- ✅ "Explore Gamers" button linking to explore page

---

### Test 3: View Mode Toggle
**Steps:**
1. Load matches page with matches
2. Click List icon in top-right toggle
3. Click Grid icon

**Expected Results:**
- ✅ Grid view (default):
  - 6 columns on large screens
  - 3 columns on medium screens
  - 2 columns on small screens
  - Cards with aspect-square images
  - MessageCircle button appears on hover
- ✅ List view:
  - Full-width rows
  - Horizontal layout
  - 56x56px circular avatars
  - MessageCircle button always visible
- ✅ Active view highlighted in primary color
- ✅ Smooth transition between views

---

### Test 4: Profile Navigation
**Steps:**
1. Click on any match card
2. Observe navigation

**Expected Results:**
- ✅ Navigates to `/[locale]/app/profile/[gamertag]`
- ✅ Profile page loads correctly
- ✅ Can navigate back to matches

---

### Test 5: Match Date Formatting
**Test Cases:**
- Match created today → "Today"
- Match created yesterday → "Yesterday"
- Match created 3 days ago → "3 days ago"
- Match created 10 days ago → Full date (e.g., "3/7/2026")

**Steps:**
1. Create matches with different dates
2. Observe date formatting

**Expected Results:**
- ✅ Relative dates for recent matches
- ✅ Absolute dates for older matches
- ✅ Consistent formatting across view modes

---

### Test 6: Platform Icons Display
**Prerequisites**: Matches with different platform arrays

**Test Cases:**
- User with 1 platform: Shows 1 icon
- User with 3 platforms: Shows 3 icons (grid), 2 icons (list)
- User with 5 platforms: Shows 3 icons (grid), 2 icons (list)
- User with no platform: Shows only date

**Expected Results:**
- ✅ Platform icons display correctly
- ✅ Icons are 14x14px
- ✅ Proper truncation in each view mode
- ✅ Icons from getPlatformAssetUrl()

---

### Test 7: MessageCircle Button (Current Behavior)
**Steps:**
1. In grid view, hover over match card
2. Click MessageCircle button
3. In list view, click MessageCircle button

**Expected Results:**
- ⚠️ **Known Issue**: Buttons do nothing
- ✅ Click is prevented (e.preventDefault())
- ✅ Button shows hover effects
- ❌ No chat opens (not implemented)

---

### Test 8: Responsive Design
**Steps:**
1. Test at 1920px (desktop)
2. Test at 1024px (tablet)
3. Test at 768px (small tablet)
4. Test at 375px (mobile)

**Expected Results:**
- ✅ Desktop (1920px):
  - 6 columns in grid view
  - View toggle visible
  - Full layout
- ✅ Tablet (1024px):
  - 3-4 columns in grid view
  - View toggle visible
- ✅ Mobile (375px):
  - 2 columns in grid view
  - View toggle visible
  - Touch-friendly buttons

---

### Test 9: Profile Images
**Test Cases:**
- User with profile_image_url: Shows image
- User without profile_image_url: Shows Users icon

**Expected Results:**
- ✅ Images load with Next.js Image component
- ✅ Images are object-cover (no distortion)
- ✅ Default icon centered and styled
- ✅ Grid: Square aspect ratio
- ✅ List: Circular 56x56px

---

### Test 10: Background Effects
**Steps:**
1. Observe page background
2. Check visual hierarchy

**Expected Results:**
- ✅ Primary blob (top-left, 520px, primary/20, blur 190px)
- ✅ Accent blob (bottom-right, 600px, accent/25, blur 200px)
- ✅ Grid pattern overlay with radial mask
- ✅ Effects are pointer-events-none
- ✅ Content is readable over background

---

## Performance Considerations

### Database Queries
1. **Matches Query**: Fetches all matches for user (could be 100+)
2. **Users Query**: Fetches all matched user profiles in single query
3. **No Pagination**: Loads all matches at once

### Optimization Opportunities
- [ ] Implement pagination (show 20-50 at a time)
- [ ] Add infinite scroll
- [ ] Cache match data
- [ ] Optimize image loading with blur placeholders

---

## Known Issues & Missing Features

### Critical Issues ❌
1. **No Chat System**: MessageCircle buttons don't work
2. **No Direct Messaging**: Can't message matches directly
3. **No Notifications**: Users don't know when they get new matches

### Missing Features 🚧
1. **Chat Integration**: Should open a chat/DM system
2. **Unmatch Functionality**: No way to remove a match
3. **Match Details**: No info on why users matched
4. **Sorting/Filtering**: Can't sort by recent, game, etc.
5. **Search**: Can't search through matches
6. **Favorites**: Can't favorite certain matches
7. **Block/Report**: No moderation tools

### UI Improvements 💡
1. **Skeleton Loaders**: Show skeletons instead of just spinner
2. **Animations**: Add stagger animations on load
3. **Tooltips**: Show platform names on icon hover
4. **Badge Indicators**: Show "New" badge for recent matches

---

## Chat Implementation Options

### Option 1: Direct Messaging System
Create a new DM feature with:
- Private 1-on-1 conversations
- Message history per match
- Real-time updates via Supabase
- Notifications for new messages

**Database Changes:**
```sql
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY,
  match_id UUID REFERENCES matches(id),
  sender_id UUID REFERENCES users(id),
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  match_id UUID UNIQUE REFERENCES matches(id),
  last_message_at TIMESTAMPTZ,
  unread_count_user1 INTEGER DEFAULT 0,
  unread_count_user2 INTEGER DEFAULT 0
);
```

### Option 2: Redirect to Play Now Chat
Link MessageCircle buttons to Play Now:
```typescript
<Link href={`/${locale}/app/play-now`}>
  <MessageCircle size={16} />
</Link>
```

Pros:
- ✅ Uses existing chat system
- ✅ No new development needed
- ✅ Public lobby context

Cons:
- ❌ Not private
- ❌ Other users can see
- ❌ Not specific to the match

### Option 3: Hybrid Approach
- Default: Direct messages for matches
- Fallback: Play Now for public chat
- Add "Invite to Lobby" button for Play Now

---

## Test Automation Script

```bash
#!/bin/bash
# Test matches page functionality

echo "Testing Matches Page..."

# 1. Check page file exists
if [ ! -f "app/[locale]/app/matches/page.tsx" ]; then
  echo "❌ Matches page not found"
  exit 1
fi
echo "✅ Page file exists"

# 2. Check for matches table
echo "Checking database schema..."
# (requires Supabase connection)

# 3. Verify components are imported
grep -q "MessageCircle" app/[locale]/app/matches/page.tsx && echo "✅ Icons imported"
grep -q "supabase" app/[locale]/app/matches/page.tsx && echo "✅ Supabase imported"

# 4. Check for known issues
if grep -q "e.preventDefault()" app/[locale]/app/matches/page.tsx; then
  echo "⚠️  MessageCircle buttons are disabled (known issue)"
fi

echo ""
echo "Manual testing required:"
echo "  1. Navigate to http://localhost:3001/en/app/matches"
echo "  2. Test view mode toggle"
echo "  3. Click on match cards to view profiles"
echo "  4. Note: Chat buttons don't work yet"
```

---

## Success Criteria

### Must Have ✅
- [x] Matches load and display correctly
- [x] Profile navigation works
- [x] View modes toggle properly
- [x] Empty state shows when no matches
- [x] Responsive design works across devices

### Should Have ⏳
- [ ] Chat/DM system implemented
- [ ] MessageCircle buttons functional
- [ ] Skeleton loaders during loading
- [ ] Pagination for many matches
- [ ] Sort/filter options

### Nice to Have 💡
- [ ] Match animations on load
- [ ] Match suggestions
- [ ] Icebreaker messages
- [ ] Match statistics
- [ ] Export matches list

---

## Video Recording Checklist

### Setup
- [ ] Create test matches in database
- [ ] Prepare users with different platforms
- [ ] Have profile images ready
- [ ] Test both view modes

### Scenes to Record (30-45 seconds)

1. **Loading State** (3s)
   - Show spinner while loading

2. **Grid View** (8s)
   - Display 6-12 matches
   - Show hover effects
   - Highlight Sparkles badges

3. **List View** (7s)
   - Toggle to list view
   - Show horizontal layout
   - Display more user info

4. **Profile Navigation** (7s)
   - Click on a match
   - Navigate to profile
   - Return to matches

5. **Empty State** (5s)
   - Show no matches state
   - Highlight CTA button

6. **Responsive** (10s)
   - Show desktop → tablet → mobile
   - Demonstrate grid adaptation

### Annotations
- Add text: "MessageCircle buttons - Coming Soon!"
- Highlight: "Toggle between Grid & List views"
- Note: "Click any match to view full profile"

---

## Related Documentation
- [CHAT_FEATURE_TEST_PLAN.md](./CHAT_FEATURE_TEST_PLAN.md) - Play Now chat system
- [CHAT_FEATURE_SUMMARY.md](./CHAT_FEATURE_SUMMARY.md) - Chat feature overview

---

## Recommendations

### Short-term (Next Sprint)
1. Implement basic DM system for matches
2. Add skeleton loaders
3. Fix MessageCircle button functionality
4. Add match notifications

### Medium-term (1-2 months)
1. Add pagination
2. Implement sorting/filtering
3. Add unmatch functionality
4. Create match statistics page

### Long-term (3+ months)
1. Match suggestions/recommendations
2. Advanced matching algorithm
3. Match quality scoring
4. Integration with gaming sessions
