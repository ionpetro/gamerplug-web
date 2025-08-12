# GamerPlug Email Templates

These are custom email templates for GamerPlug's authentication emails.

## How to Configure in Supabase

### 1. Access Email Templates
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**

### 2. Configure Confirm Signup Template
1. Click on **Confirm signup** template
2. Replace the content with the HTML from `confirm-signup-gmail.html` (Gmail-optimized version)
3. Update the subject line to: `Welcome to GamerPlug - Confirm Your Account` (no emojis to avoid spam)

### 3. Configure Magic Link Template  
1. Click on **Magic Link** template
2. Replace the content with the HTML from `magic-link-gmail.html` (Gmail-optimized version)
3. Update the subject line to: `Your GamerPlug Login Link`

### 4. Gmail Spam Prevention
To avoid Gmail spam filters:
- Use the `-gmail.html` versions (table-based layout)
- Avoid excessive emojis in subject lines
- Keep text-to-image ratio high
- Use standard fonts (Arial, Helvetica)
- Include plain text versions if possible

### 4. Important Variables
Make sure these Supabase variables are preserved in your templates:
- `{{ .ConfirmationURL }}` - The confirmation/magic link URL
- `{{ .SiteURL }}` - Your site URL (if needed)
- `{{ .Email }}` - User's email address (if needed)

### 5. Test Your Templates
1. After saving, test by:
   - Creating a new account (for confirm signup)
   - Using magic link login (for magic link)
2. Check that emails render correctly on:
   - Desktop email clients
   - Mobile email apps
   - Web email interfaces

## Template Features

### Confirm Signup Template
- 🎮 Gaming-themed design
- ✨ Clear call-to-action button
- 📱 Mobile responsive
- 🚀 Features overview
- 🔒 Security information

### Magic Link Template
- ✨ Magic-themed design
- 🚀 Quick sign-in button
- 🔒 Security notice
- 📱 Mobile responsive
- 🎮 Gaming branding

## Customization Options

You can customize:
- Colors (change hex codes in CSS)
- Fonts (update font-family in CSS)
- Logo (replace emoji with image URL)
- Social links (update href attributes)
- Footer content
- Feature descriptions

## Color Scheme
- Background: `#000000` (Black)
- Secondary: `#111111` (Dark Gray)
- Accent: `#FF3B30` (Red)
- Text: `#ffffff` (White)
- Secondary Text: `#cccccc` (Light Gray)

## Support
If you need help customizing these templates, check the Supabase documentation or reach out to support.