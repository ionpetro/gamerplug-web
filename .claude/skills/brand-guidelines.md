# GamerPlug Brand Guidelines

## Brand Identity

**Brand Name:** GAMERPLUG
- Display: GAMER<span style="color: #FF0034">PLUG</span>
- Font: Extrabold, italic, tight tracking
- The "PLUG" portion uses the brand red color

**Tagline/Description:** Gaming analytics platform that helps gamers track performance, view detailed stats, and improve their gameplay.

---

## Color Palette

### Primary Brand Color
- **Brand Red:** `#FF0034` - The core brand color used throughout
  - Primary buttons
  - Hover states
  - Accent elements
  - Brand highlights
  - Logo "PLUG" text
  - Email variant: `#FF3B30`

### Base Colors (OKLCH Format)

**Light Mode:**
- Background: `oklch(0.05 0 0)` - Deep black `#0D0D0D`
- Foreground: `oklch(0.98 0 0)` - Pure white `#FAFAFA`
- Card: `oklch(0.08 0 0)` - Dark card background `#141414`
- Secondary: `oklch(0.15 0 0)` - Dark gray `#262626`
- Muted: `oklch(0.25 0 0)` - Muted dark gray `#404040`
- Muted Foreground: `oklch(0.7 0 0)` - Muted text `#B3B3B3`
- Border: `oklch(0.2 0 0)` - Border color `#333333`
- Input: `oklch(0.12 0 0)` - Input field background `#1F1F1F`

**Dark Mode (Enhanced contrast):**
- Background: `oklch(0.03 0 0)` - Even darker `#080808`
- Card: `oklch(0.06 0 0)` - Slightly lighter cards `#0F0F0F`
- Secondary: `oklch(0.12 0 0)` - Darker secondary `#1F1F1F`
- Muted: `oklch(0.18 0 0)` - Darker muted `#2E2E2E`
- Border: `oklch(0.15 0 0)` - Darker borders `#262626`

### Chart/Data Visualization Colors
- Chart 1: `#FF0034` (Primary red)
- Chart 2: `oklch(0.6 0.25 15)` (Orange tone)
- Chart 3: `oklch(0.98 0 0)` (White)
- Chart 4: `oklch(0.05 0 0)` (Black)
- Chart 5: `oklch(0.4 0 0)` (Dark gray)

### Email Template Colors
- Background: `#000000` (Black)
- Secondary: `#111111` (Dark Gray)
- Accent: `#FF3B30` (Red variant)
- Text: `#FFFFFF` (White)
- Secondary Text: `#CCCCCC` (Light Gray)

---

## Typography

### Font Families

**Primary Sans-Serif:**
```css
"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif
```

**Monospace:**
```css
ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace
```

**Handwritten (Decorative):**
```css
"Caveat", "Brush Script MT", cursive
```
- Used for: Hero section "scan me" labels and decorative elements

### Text Styles & Scales

**Size Scale:**
- `text-xs` - Extra small (badges, descriptions)
- `text-sm` - Small (secondary text)
- `text-xl` - Medium (card titles)
- `text-4xl` - Large headings
- `text-6xl` - Hero headings (desktop)
- `text-7xl` - Extra large CTA sections

**Weight Scale:**
- `font-medium` - 500
- `font-semibold` - 600
- `font-bold` - 700
- `font-extrabold` - 800 (brand name)
- `font-black` - 900 (hero headlines)

**Common Patterns:**
- Headlines: Bold/black, italic, uppercase
- Titles: Semibold to bold
- Body: Regular weight
- Brand name: Extrabold, italic, tight tracking
- CTA text: Bold, uppercase

### Text Effects

**Gradient Text:**
```css
text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent
```

**Line Height:**
- `leading-none` - Tight line height for titles
- Default for body text

---

## Spacing & Layout

### Border Radius Token
- Base: `--radius: 0.625rem` (10px)
- Small: `calc(var(--radius) - 4px)` = 6px
- Medium: `calc(var(--radius) - 2px)` = 8px
- Large: `var(--radius)` = 10px
- Extra Large: `calc(var(--radius) + 4px)` = 14px

**Common Usage:**
- `rounded-md` - Medium radius (buttons, badges)
- `rounded-lg` - Large radius (cards, inputs)
- `rounded-xl` - Extra large (feature cards)
- `rounded-2xl` - Double extra large (hero sections)
- `rounded-full` - Fully rounded (avatars, icons)

### Container & Grid
- Container: `container mx-auto px-4 md:px-6`
- Mobile padding: `px-4`
- Desktop padding: `px-6`

### Gap Scales
- `gap-1.5` - 6px
- `gap-2` - 8px
- `gap-4` - 16px
- `gap-6` - 24px
- `gap-8` - 32px
- `gap-12` - 48px
- `gap-16` - 64px

### Component Spacing
- **Buttons:** `h-9 px-4 py-2` (default), `h-8 px-3` (sm), `h-10 px-6` (lg)
- **Badges:** `px-2 py-0.5`
- **Cards:** `p-8` with `px-6 py-6` for header/content
- **Sections:** `mb-20`, `py-12`, `py-24`

---

## Component Design Patterns

### Buttons

**Variants:**
- `default` - Primary red background, white text
- `destructive` - Red destructive action
- `outline` - Border only, transparent background
- `secondary` - Secondary background
- `ghost` - No background, only hover state
- `link` - Text link style

**Sizes:**
- `sm` - Small (h-8, px-3)
- `default` - Medium (h-9, px-4)
- `lg` - Large (h-10, px-6)
- `icon` - Square icon button

**Behavior:**
- Smooth transitions on all states
- Hover: Slight opacity change or background shift
- Active: Slightly darker

### Cards

**Structure:**
- Container: Flex column with gap-6
- Border radius: `rounded-xl`
- Shadow: `shadow-sm`
- Background: Card color (`oklch(0.08 0 0)`)

**Subcomponents:**
- CardHeader - Title and description area
- CardTitle - Semibold, text-xl
- CardDescription - Muted foreground color
- CardContent - Main content area (px-6)
- CardFooter - Actions area at bottom
- CardAction - Clickable action items

**Hover Effects:**
- Border color: `border-primary/50`
- Subtle scale or shadow enhancement
- Smooth transition (300ms)

### Badges

**Variants:**
- `default` - Primary color
- `secondary` - Secondary background
- `destructive` - Red for errors
- `outline` - Border only

**Style:**
- Size: `text-xs`
- Padding: `px-2 py-0.5`
- Border radius: `rounded-md`
- Inline-flex with center alignment

### Navigation

**Navbar:**
- Fixed position at top
- Blur background: `backdrop-filter: blur(12px)`
- Border bottom: Subtle border
- Height: Auto with padding
- Logo: Left aligned, 24-32px height
- Links: Center or right aligned
- Mobile: Hamburger menu pattern

**Sidebar:**
- Background: `oklch(0.08 0 0)`
- Accent: `oklch(0.15 0 0)`
- Primary: Red for active states

---

## Visual Effects & Animations

### Gradient Backgrounds

**Hero Gradient:**
```css
linear-gradient(135deg, oklch(0.03 0 0) 0%, oklch(0.15 0.1 18) 50%, oklch(0.05 0 0) 100%)
```

**Card Gradient:**
```css
linear-gradient(145deg, oklch(0.08 0 0) 0%, oklch(0.12 0.05 18) 100%)
```

**Accent Gradient:**
```css
linear-gradient(90deg, #FF0034 0%, #FF0034 100%)
```

**Tailwind Gradients:**
- `bg-gradient-to-r from-primary to-accent`
- Common for text and button effects

### Blur Effects
- Navbar blur: `blur(12px)`
- Hero gradient blobs: `blur-[150px]`
- Background overlays: `blur-3xl`

### Custom Animations

**Float Animation:**
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
animation: float 6s ease-in-out infinite;
```

**Hover States:**
- Scale: `hover:scale-105`
- Opacity: `hover:opacity-80`
- Border: `hover:border-primary`
- Background: `hover:bg-primary`

**Transitions:**
- Duration: `transition-all duration-300`
- Smooth easing for all interactive elements

### Scroll Effects
- Reveal animations on scroll
- Parallax on background elements
- Fade-in for sections

---

## Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: oklch(0.05 0 0); /* Dark */
}
::-webkit-scrollbar-thumb {
  background: oklch(0.25 0 0); /* Medium gray */
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #FF0034; /* Brand red */
}
```

### Text Selection

```css
::selection {
  background: #FF0034;
  color: oklch(0.98 0 0); /* White */
}
```

---

## Icons

**Library:** Lucide React

**Common Sizes:**
- Small: 14-16px
- Medium: 20px
- Large: 24px
- Extra Large: 32-48px

**Colors:**
- Primary: `text-primary` (#FF0034)
- Muted: `text-muted-foreground`
- White: `text-white`

**Usage:**
- Icons in buttons: Left aligned, 16-20px
- Feature icons: 24-32px with primary color
- Navigation icons: 20-24px

---

## Responsive Design

### Breakpoints
- Mobile: Base styles (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

### Patterns
- Mobile-first approach
- Hide on mobile: `hidden md:flex`
- Show on desktop: `md:block`
- Responsive text: `text-4xl md:text-6xl`
- Responsive padding: `px-4 md:px-6`
- Responsive layout: Single column → Multi-column

### Container Queries
- Card header: `@container/card-header`
- Allows components to respond to container size

---

## Brand Assets

### Logos
- Primary: `/public/logo.svg` (preferred)
- PNG: `/public/logo.png`
- WebP: `/public/logo.webp`
- New version: `/public/logo-new.png`
- Favicon: `/public/logo-new.ico`

**Logo Usage:**
- Minimum size: 120px width
- Clear space: Equal to height of "G" letter
- Backgrounds: Always use on dark backgrounds
- Color variations: Full color (white + red) or all white

### App Icons
- Apple Touch: `/public/apple-touch-icon.png` (180x180)
- Favicon 16x16: `/public/favicon-16x16.png`
- Favicon 32x32: `/public/favicon-32x32.png`
- Android 192x192: `/public/android-chrome-192x192.png`
- Android 512x512: `/public/android-chrome-512x512.png`

### Team Images
- Location: `/public/images/team/`
- Format: PNG with transparent backgrounds
- Size: Consistent dimensions across team members

### Game Assets
- CDN: `d11fcxbq4rxmpu.cloudfront.net/assets/`
- Supported games: Apex Legends, Overwatch 2, Battlefield 6, League of Legends, PUBG, Fortnite, Call of Duty, Marvel Rivals, Rocket League, Counter-Strike 2, Valorant

---

## Landing Page Components

### Hero Section
- Large bold headline (text-7xl, font-black, italic)
- Red gradient blob backgrounds (blur-[150px])
- Background grid overlay
- QR code for app download
- Primary CTA button (red)
- Secondary text describing value proposition

### Feature Cards
- 2xl rounded corners
- Hover effects: Border color change to primary/50
- Icons: 24px, primary color
- Title: Semibold, text-xl
- Description: Muted foreground
- "Coming Soon" badges where applicable

### Call-to-Action Sections
- Gradient borders
- Large text (text-7xl)
- Bold, italic typography
- Red primary buttons
- Clear value proposition

### Game Ticker
- Horizontal scrolling carousel
- Game logos/icons
- Smooth infinite scroll animation
- Consistent sizing across game assets

---

## Email Templates

### Design Principles
- Dark theme consistent with web app
- Simple, focused layout
- Mobile-responsive
- Gmail-optimized (separate templates)
- Plain text fallback versions

### Color Scheme
- Background: `#000000`
- Content areas: `#111111`
- Accent/CTA: `#FF3B30`
- Text: `#FFFFFF`
- Secondary text: `#CCCCCC`

### Components
- Header with logo
- Main content area
- CTA button (red, rounded)
- Footer with unsubscribe

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Primary red (#FF0034) used only for accents, not body text
- High contrast mode support via OKLCH color system

### Focus States
- Visible focus rings on interactive elements
- Keyboard navigation support
- Skip links for screen readers

### Typography
- Minimum font size: 14px (text-sm)
- Readable line height
- Sufficient spacing between interactive elements

---

## Technical Stack

### Frameworks & Libraries
- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS v4** - Styling
- **TypeScript** - Type safety
- **class-variance-authority** - Component variants
- **clsx** - Conditional classes
- **tailwind-merge** - Smart class merging
- **Lucide React** - Icon library

### Configuration
- Style system: "new-york"
- CSS variables: Enabled
- Base color: "neutral"
- Path aliases: `@/*` for imports

---

## Best Practices

### Color Usage
✅ **DO:**
- Use brand red (#FF0034) for primary actions, accents, and highlights
- Maintain high contrast (white text on dark backgrounds)
- Use OKLCH color space for smooth gradients
- Apply red to interactive hover states

❌ **DON'T:**
- Use red for large text blocks (readability)
- Mix color formats (stick to OKLCH)
- Use low-contrast color combinations

### Typography
✅ **DO:**
- Use extrabold italic for brand name
- Apply tight tracking to headlines
- Use gradient text effects for emphasis
- Maintain consistent font stack

❌ **DON'T:**
- Mix too many font weights in one section
- Use decorative fonts for body text
- Ignore responsive text sizing

### Layout
✅ **DO:**
- Follow mobile-first approach
- Use consistent spacing (gap scales)
- Apply smooth transitions to all interactions
- Maintain 8px base unit for spacing

❌ **DON'T:**
- Hardcode pixel values (use Tailwind classes)
- Skip responsive breakpoints
- Forget hover/focus states

### Components
✅ **DO:**
- Use variants for component flexibility
- Apply consistent border radius (10px base)
- Include hover and focus states
- Add smooth transitions (300ms)

❌ **DON'T:**
- Create one-off components without reusability
- Ignore accessibility (focus, keyboard nav)
- Skip loading and error states

---

## Code Examples

### Button with Brand Styling
```tsx
<button className="h-10 px-6 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all duration-300">
  Get Started
</button>
```

### Card with Gradient
```tsx
<div className="rounded-xl bg-card p-8 shadow-sm border border-primary/20 hover:border-primary/50 transition-all duration-300">
  <h3 className="text-xl font-semibold mb-3">Feature Title</h3>
  <p className="text-muted-foreground">Feature description goes here</p>
</div>
```

### Gradient Text Heading
```tsx
<h1 className="text-7xl font-black italic leading-none">
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
    Level Up Your Game
  </span>
</h1>
```

### Brand Name Display
```tsx
<span className="font-sans font-extrabold text-2xl tracking-tight italic">
  GAMER<span className="text-primary">PLUG</span>
</span>
```

---

## Version History

- **v1.0** - Initial brand guidelines based on codebase analysis (January 2026)
