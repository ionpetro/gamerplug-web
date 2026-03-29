# Chat Feature Test Plan

## Overview
The Play Now chat feature is a real-time game lobby system located at `/app/[locale]/app/play-now/page.tsx`.

## Feature Description

### Core Functionality
- **Game-specific lobbies**: Users can select different game lobbies from a vertical icon strip
- **Real-time messaging**: Uses Supabase Realtime channels for instant message delivery
- **Participant tracking**: Shows online user counts for each lobby
- **Message history**: Loads last 150 messages per lobby
- **User profiles**: Displays avatars and clickable gamertags
- **Message grouping**: Groups consecutive messages from same user within 5 minutes

### Technical Stack
- **Frontend**: Next.js 15 with React 19
- **Database**: Supabase
- **Real-time**: Supabase Realtime Broadcast channels
- **Authentication**: Supabase Auth with PKCE flow

## UI Components

### 1. Game Icon Strip (Left Sidebar)
- Width: 80px
- Shows game icons in a vertical scrollable list
- Active game has:
  - Red pill indicator on left edge
  - Rounded square shape with primary ring
- Hover effects: Partial pill indicator, rounded corners

### 2. Main Chat Area (Center)
- **Header**:
  - Game name with # prefix
  - Participant count with Users icon
- **Messages Container**:
  - Scrollable message list
  - Auto-scrolls to bottom on new messages
  - Empty state shows game icon and welcome message
- **Message Display**:
  - Avatar (or initial letter in colored circle)
  - Gamertag (clickable, links to profile)
  - Timestamp (HH:MM format)
  - Message text (word-wrapped)
  - Grouped messages hide avatar/header
- **Input Bar**:
  - Text input with game name placeholder
  - Send button (disabled when empty)
  - Enter key to send (Shift+Enter for new line)

### 3. Calendar Panel (Right Sidebar)
- Width: 288px
- Hidden on mobile (< lg breakpoint)
- Shows scheduling functionality

## Test Scenarios

### Test 1: Initial Load
**Steps:**
1. Navigate to `/[locale]/app/play-now`
2. Verify loading skeleton appears
3. Wait for lobbies to load

**Expected Results:**
- Loading skeleton with 8 game icons
- Chat skeleton with 5 message placeholders
- Calendar skeleton
- Transition to actual content when loaded

### Test 2: Game Selection
**Steps:**
1. Click on different game icons in left sidebar
2. Observe active state changes
3. Verify chat content switches

**Expected Results:**
- Active game shows red pill indicator
- Active icon has rounded square shape with ring
- Chat header updates with game name
- Message history loads for selected game
- Participant count updates

### Test 3: Send Message
**Steps:**
1. Select a game lobby
2. Type a message in input field
3. Click Send button (or press Enter)

**Expected Results:**
- Message appears immediately in chat
- Input field clears
- Message includes user avatar/initial
- Message includes gamertag and timestamp
- Message persists in database
- Other users receive message via broadcast

### Test 4: Message Grouping
**Steps:**
1. Send multiple messages quickly
2. Observe message display

**Expected Results:**
- First message shows avatar and gamertag
- Subsequent messages (within 5 min) hide avatar
- Messages are visually grouped with reduced spacing

### Test 5: Real-time Updates
**Steps:**
1. Open app in two different browsers/users
2. Send message from User A
3. Observe in User B's chat

**Expected Results:**
- Message appears in User B's chat without refresh
- Message has correct avatar, gamertag, timestamp
- Chat auto-scrolls to show new message

### Test 6: Empty State
**Steps:**
1. Select a game with no messages
2. Observe empty state

**Expected Results:**
- Game icon displayed at 64x64px
- "Welcome to #[GameName]" heading
- Descriptive text encouraging first message

### Test 7: Profile Navigation
**Steps:**
1. Click on a gamertag in chat
2. Verify navigation

**Expected Results:**
- Navigates to `/[locale]/app/profile/[gamertag]`
- Profile page loads correctly

### Test 8: Input Validation
**Steps:**
1. Try to send empty message
2. Try to send whitespace-only message
3. Type message but don't send

**Expected Results:**
- Send button disabled when empty/whitespace
- Message not sent on Enter for empty input
- Input preserves typed text until sent

### Test 9: Scroll Behavior
**Steps:**
1. Open lobby with many messages
2. Scroll up to read history
3. Send new message or receive one

**Expected Results:**
- Can scroll through message history
- Auto-scroll to bottom on new message
- Smooth scrolling animation

### Test 10: Responsive Design
**Steps:**
1. Test on mobile viewport (< 1024px)
2. Test on tablet viewport
3. Test on desktop viewport

**Expected Results:**
- Calendar hidden on mobile/tablet
- Game icons remain accessible
- Chat remains functional
- Touch interactions work properly

## Environment Requirements

### Required Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Tables
- `games`: Game information (id, name, display_name)
- `users`: User profiles (id, gamertag, profile_image_url)
- `user_games`: User-game relationships
- `play_now_messages`: Chat messages (id, game_id, user_id, gamertag, profile_image_url, message_text, created_at)

### Supabase Configuration
- Realtime enabled on `play_now_messages` table (or broadcast-only mode)
- Proper RLS policies for reading/writing messages
- Authentication enabled

## Known Limitations

1. **Message Limit**: Only last 150 messages are kept per lobby in memory
2. **No Editing**: Messages cannot be edited after sending
3. **No Deletion**: Messages cannot be deleted by users
4. **No Reactions**: No emoji reactions or message reactions
5. **No Typing Indicators**: No "user is typing..." feature
6. **No Read Receipts**: No indication of who read messages
7. **Text Only**: No support for images, files, or rich media
8. **No Moderation**: No built-in blocking or reporting

## Performance Considerations

1. **Message Loading**: Fetches 150 messages per lobby on selection
2. **Real-time Subscription**: One channel per selected lobby
3. **Channel Cleanup**: Properly unsubscribes when switching lobbies
4. **Broadcast Self**: Set to false to avoid receiving own messages twice
5. **Message Deduplication**: Checks message ID before adding to prevent duplicates

## Accessibility Notes

- Keyboard navigation: Enter to send, Shift+Enter for newline
- Clickable gamertags for navigation
- Visual focus indicators on active game
- Readable contrast ratios
- Semantic HTML structure

## Video Recording Checklist

### Setup
- [ ] Ensure Supabase credentials are configured
- [ ] Start dev server on http://localhost:3001
- [ ] Create 2-3 test user accounts
- [ ] Seed database with sample games
- [ ] Prepare test messages

### Recording Shots
1. **Intro** (5 seconds)
   - Show landing page or app overview
   - Navigate to Play Now

2. **Loading State** (3 seconds)
   - Show skeleton loaders

3. **Lobby Selection** (10 seconds)
   - Click through 3-4 different game lobbies
   - Show active state changes
   - Show participant counts

4. **Empty State** (5 seconds)
   - Select lobby with no messages
   - Show empty state UI

5. **Send Messages** (20 seconds)
   - Type and send 3-4 messages
   - Show immediate appearance
   - Show message grouping
   - Show timestamps

6. **Real-time Demo** (20 seconds)
   - Split screen or switch between two users
   - Send message from User A
   - Show instant appearance in User B's chat
   - Send reply from User B

7. **Profile Navigation** (5 seconds)
   - Click on gamertag
   - Show profile page loads

8. **Features Summary** (5 seconds)
   - Quick pan of all three panels
   - Show calendar panel on desktop

### Video Specifications
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps minimum
- **Duration**: 60-90 seconds
- **Format**: MP4 (H.264 codec)
- **Audio**: Optional narration or background music
- **Captions**: Recommended for accessibility

## Test Completion Criteria

- ✅ All 10 test scenarios pass
- ✅ No console errors during normal operation
- ✅ Real-time updates work reliably
- ✅ UI is responsive across devices
- ✅ Video demonstrates core functionality
- ✅ Performance is acceptable (< 100ms message latency)
