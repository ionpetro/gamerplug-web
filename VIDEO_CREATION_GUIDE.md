# Video Creation Guide for Chat Feature

## Overview
This guide explains how to create a demonstration video of the Gamerplug chat feature.

## Prerequisites

### 1. Environment Setup
Add these secrets in **Cursor Dashboard** (Cloud Agents > Secrets):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
Ensure your Supabase database has:
- `games` table with sample games
- `users` table with test accounts
- `user_games` table linking users to games
- `play_now_messages` table for chat messages
- Realtime enabled for broadcasting

### 3. Test Accounts
Create 2-3 test user accounts for demonstration:
- User A: "TestGamer1"
- User B: "ProPlayer2"
- User C: "CasualFan3" (optional)

### 4. Dev Server Running
```bash
npm run dev
# Accessible at http://localhost:3000 or http://localhost:3001
```

## Manual Testing Capability

To record a video, you need **manual testing capabilities** which allow browser interaction and screen recording.

### Enable Manual Testing
1. Visit https://cursor.com/onboard
2. Complete the onboarding flow for manual testing
3. This enables browser automation and video recording

Once enabled, the Cloud Agent can:
- Open and control a browser
- Navigate to the chat page
- Type messages and click elements
- Record all interactions as video
- Save the video file

## Video Structure (60-90 seconds)

### Scene 1: Introduction (5 sec)
**Shot**: Landing page or app home
**Action**: 
- Show the app logo/branding
- Navigate to "Play Now" from menu

**Narration/Caption**: 
> "Introducing Gamerplug's real-time chat feature"

---

### Scene 2: Loading State (3 sec)
**Shot**: Play Now page loading
**Action**:
- Show skeleton loaders briefly
- Transition to loaded content

**Caption**: 
> "Fast loading with skeleton UI"

---

### Scene 3: Lobby Overview (8 sec)
**Shot**: Full interface with all three panels
**Action**:
- Pan from left sidebar to right panel
- Highlight:
  - Game icon strip (left)
  - Chat area (center)
  - Calendar panel (right)

**Caption**: 
> "Game lobbies • Real-time chat • Scheduling"

---

### Scene 4: Game Selection (10 sec)
**Shot**: Focus on left sidebar and chat area
**Action**:
- Click on "League of Legends" icon
  - Show active state (red pill, rounded corners)
  - Show participant count update
- Click on "Valorant" icon
  - Show smooth transition
- Click on "Fortnite" icon
  - Show different messages load

**Caption**: 
> "Switch between game lobbies instantly"

---

### Scene 5: Empty State (4 sec)
**Shot**: Chat area with empty lobby
**Action**:
- Select a game with no messages
- Show empty state:
  - Game icon
  - Welcome message
  - "Be the first to say something"

**Caption**: 
> "Clean empty states for new lobbies"

---

### Scene 6: Sending Messages (15 sec)
**Shot**: Chat area with input focused
**Action**:
1. Type: "Hey everyone! Looking for a team 🎮"
   - Show typing in input field
   - Press Enter
   - Message appears with avatar and timestamp
2. Type: "Anyone up for ranked?"
   - Send with send button
   - Show message groups with previous
3. Type: "I main support roles"
   - Show immediate appearance

**Caption**: 
> "Send messages with Enter or click"

---

### Scene 7: Real-time Demo (20 sec)
**Shot**: Split screen or picture-in-picture with two browsers

**Setup**:
- Browser A: User "TestGamer1" 
- Browser B: User "ProPlayer2"

**Action**:
1. User B types: "I'm down! What rank are you?"
   - Show typing in Browser B
   - Message instantly appears in Browser A
2. User A types: "Gold III, pushing for Platinum"
   - Show in Browser A
   - Instantly appears in Browser B
3. User B types: "Perfect, I'm Gold II"
   - Real-time sync
4. Show both users see each other's messages instantly

**Caption**: 
> "Real-time messaging with zero delay"

---

### Scene 8: Profile Navigation (5 sec)
**Shot**: Chat area, then profile page
**Action**:
- Hover over "ProPlayer2" gamertag (show hover effect)
- Click on gamertag
- Navigate to profile page
- Show profile loads

**Caption**: 
> "Click gamertags to view profiles"

---

### Scene 9: Message Features (5 sec)
**Shot**: Chat area with multiple messages
**Action**:
- Scroll up through message history
- Show different avatars
- Show timestamps
- Show message grouping
- Auto-scroll to bottom when new message arrives

**Caption**: 
> "Message history • Timestamps • Smart grouping"

---

### Scene 10: Responsive Design (5 sec)
**Shot**: Browser window resizing
**Action**:
- Start at desktop width (show all 3 panels)
- Resize to tablet (hide calendar)
- Resize to mobile (keep chat functional)
- Return to desktop

**Caption**: 
> "Responsive design for all devices"

---

### Scene 11: Participant List (5 sec)
**Shot**: Header area with participant count
**Action**:
- Show "12 online" in header
- Highlight Users icon
- Show count updates when user joins/leaves

**Caption**: 
> "See who's online in each lobby"

---

### Scene 12: Closing (5 sec)
**Shot**: Full interface, zoom out slightly
**Action**:
- Show active chat with multiple users
- Final pan across interface
- Fade to logo or CTA

**Caption**: 
> "Connect, chat, and game together with Gamerplug"

---

## Technical Specifications

### Video Settings
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps minimum, 60 fps preferred
- **Codec**: H.264
- **Format**: MP4
- **Bitrate**: 8-10 Mbps for high quality
- **Audio**: 
  - Optional background music (low volume, 20-30%)
  - Optional voiceover narration
  - Or silent with captions

### Screen Recording Settings
- **Browser**: Chrome or Firefox (latest version)
- **Window Size**: 1920x1080 or scale appropriately
- **Cursor**: Show cursor for clicks, hide for text
- **Browser UI**: Hide bookmarks bar, extensions
- **Focus Mode**: Minimize distractions

### Editing
- **Software**: Any video editor (e.g., iMovie, DaVinci Resolve, Adobe Premiere)
- **Transitions**: Smooth cuts, no fancy effects
- **Captions**: 
  - Font: Sans-serif, bold
  - Position: Lower third or top third
  - Duration: Long enough to read comfortably
  - Color: White text with dark shadow/background

## Recording Checklist

### Pre-Recording
- [ ] Supabase credentials configured
- [ ] Dev server running (port 3000 or 3001)
- [ ] Test accounts created and logged in
- [ ] Sample games seeded in database
- [ ] Browser window sized to 1920x1080
- [ ] Screen recorder ready (OBS, QuickTime, etc.)
- [ ] Test messages prepared
- [ ] Multiple browsers/accounts ready for real-time demo

### During Recording
- [ ] Clear browser cache and cookies
- [ ] Log in as test user
- [ ] Navigate smoothly (no fast movements)
- [ ] Pause briefly after each action
- [ ] Show loading states
- [ ] Demonstrate all key features
- [ ] Ensure text is readable
- [ ] No sensitive information visible

### Post-Recording
- [ ] Trim beginning and end
- [ ] Add captions/text overlays
- [ ] Add background music (optional)
- [ ] Add intro/outro (optional)
- [ ] Export at correct specifications
- [ ] Review for quality and clarity
- [ ] Test playback on different devices

## Sample Messages for Demo

### Lobby: League of Legends
```
TestGamer1: "LF duo partner for ranked, aiming for Diamond!"
ProPlayer2: "What role do you main?"
TestGamer1: "I'm an ADC main, comfort picks are Jinx and Kai'Sa"
ProPlayer2: "Perfect! I main support. Let's queue up!"
CasualFan3: "Can I join? I play mid lane"
```

### Lobby: Valorant
```
ProPlayer2: "Anyone want to run some unrated games?"
TestGamer1: "I'm down! Need to warm up before ranked"
ProPlayer2: "Cool, I'll create a custom lobby"
```

### Lobby: Fortnite
```
CasualFan3: "New season looks amazing! 🎮"
TestGamer1: "Yeah! The new map changes are sick"
ProPlayer2: "Anyone want to drop at Tilted?"
```

## Tools & Resources

### Screen Recording
- **OBS Studio** (Free, Windows/Mac/Linux)
- **QuickTime** (Free, Mac only)
- **ShareX** (Free, Windows)
- **Loom** (Free tier available, web-based)
- **ScreenFlow** (Paid, Mac)

### Video Editing
- **DaVinci Resolve** (Free version available)
- **iMovie** (Free, Mac)
- **Shotcut** (Free, cross-platform)
- **Adobe Premiere Pro** (Paid)
- **Final Cut Pro** (Paid, Mac)

### Background Music
- **YouTube Audio Library** (Free)
- **Incompetech** (Free with attribution)
- **Epidemic Sound** (Paid subscription)
- **Artlist** (Paid subscription)

### Stock Footage (if needed)
- **Pexels** (Free)
- **Pixabay** (Free)
- **Coverr** (Free)

## Alternative: Automated Video Creation

If manual testing is enabled, the Cloud Agent can create the video programmatically:

```javascript
// Pseudo-code for automated video creation
1. Open browser with Puppeteer/Playwright
2. Navigate to http://localhost:3001/en/app/play-now
3. Start screen recording
4. Execute test scenarios:
   - Click game icons
   - Type and send messages
   - Switch between lobbies
   - Open profile pages
5. Stop recording
6. Save video file
7. (Optional) Add captions with ffmpeg
```

## Delivery

### Video File
- **Filename**: `gamerplug-chat-demo.mp4`
- **Location**: `/workspace/videos/` or cloud storage
- **Thumbnail**: Still frame showing chat interface

### Supplementary Files
- **Script/Storyboard**: This guide
- **Test Plan**: `CHAT_FEATURE_TEST_PLAN.md`
- **Raw Footage**: Keep for re-edits

## Notes

1. **Authentication**: Ensure test users are properly authenticated before recording
2. **Data Privacy**: Use only test data, no real user information
3. **Performance**: Clear browser cache to show realistic loading times
4. **Consistency**: Use the same test accounts throughout the video
5. **Timing**: Record during off-peak hours to avoid Supabase rate limits

## Next Steps

Once this guide is ready:
1. Enable manual testing via https://cursor.com/onboard
2. Configure Supabase credentials in Cursor Dashboard
3. Run the test script: `./scripts/test-chat-feature.sh`
4. Follow this guide to record the video
5. Edit and finalize the video
6. Commit video to repository or upload to hosting service

---

**Questions or Issues?**
- See `CHAT_FEATURE_TEST_PLAN.md` for detailed test scenarios
- Check `.env.local.example` for required environment variables
- Review `app/[locale]/app/play-now/page.tsx` for feature implementation
