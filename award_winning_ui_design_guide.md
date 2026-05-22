# ContentAlchemy: Award-Winning UI Design Prompt
## For Claude Code / Claude API Integration

---

## Design Philosophy

Your UI should feel like it was designed by a $200K/year product designer at a Venture-backed startup. Reference:
- **Vercel.com** (clean, minimal, modern)
- **Linear.app** (sophisticated, fast, beautiful animations)
- **Figma.com** (playful but professional, great visual hierarchy)
- **Anthropic.com** (sleek, minimal, excellent typography)
- **Stripe.com** (high trust, clean, precision design)

This is NOT a college project. This is a professional SaaS.

---

## Design System

### Color Palette
```
Primary:         Indigo-600 (#4f46e5) — Actions, CTAs, highlights
Primary Light:   Indigo-50 (#eef2ff) — Backgrounds, light states
Accent:          Cyan-500 (#06b6d4) — Secondary actions, hover states
Success:         Emerald-500 (#10b981) — Positive feedback, success
Warning:         Amber-500 (#f59e0b) — Cautions, generating state
Error:           Red-500 (#ef4444) — Errors, delete
Neutral:         Gray-900 → Gray-50 — Text, borders, backgrounds

Background:      #ffffff (main), #f9fafb (secondary sections)
Text Primary:    #0f172a (Slate-900) — Headers, main text
Text Secondary:  #64748b (Slate-500) — Descriptions, metadata
Text Tertiary:   #94a3b8 (Slate-400) — Disabled, subtle

Gradient (Hero): linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)
```

### Typography
```
Font Family:     "Inter" (Google Fonts) for web, system fonts fallback
              Font Stack: Inter, -apple-system, BlinkMacSystemFont, Segoe UI

Font Sizes:
  H1 (Hero):     48px, weight 700, line-height 1.2
  H2 (Section):  32px, weight 600, line-height 1.3
  H3 (Card):     20px, weight 600, line-height 1.4
  Body:          16px, weight 400, line-height 1.6
  Small:         14px, weight 400, line-height 1.5
  Tiny:          12px, weight 500, line-height 1.4

Letter Spacing: Normal (no loose spacing, avoid trendy letter-spacing)
```

### Spacing System (8px base)
```
4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px

Card Padding:    24px (24px horizontal, 20px vertical for compactness)
Section Gap:     32px (between major sections)
Component Gap:   16px (between related items)
```

### Shadows & Depth
```
Subtle:         0 1px 2px rgba(0,0,0,0.05)
Light:          0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
Medium:         0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)
Heavy:          0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)

Cards:          Light shadow (subtle depth)
Modals/Dropdowns: Medium shadow
Floating Elements: Heavy shadow
```

### Border Radius
```
Small:          4px (inputs, small buttons)
Medium:         8px (cards, large buttons, inputs)
Large:          12px (hero sections, major containers)
Rounded:        9999px (pills, avatar circles)
```

### Animations & Motion
```
Duration:       Fast: 150ms, Normal: 250ms, Slow: 350ms
Easing:         cubic-bezier(0.4, 0, 0.2, 1) [ease-in-out]

Hover States:   Scale 1.02 + shadow increase (not color change)
Button Press:   Scale 0.98 + shadow decrease (tactile feedback)
Transitions:    All properties get smooth transitions
Loading:        Pulse or skeleton loaders (NO spinners)
Success:        Green checkmark with fade-in animation
Error:          Red shake (translateX animation)
```

---

## Layout & Structure

### Navigation Bar
```
- Height: 64px (fixed at top)
- Background: #ffffff with border-bottom: 1px solid #e2e8f0
- Padding: 0 32px
- Logo: 24px on left, typography "ContentAlchemy" in Indigo-600, bold
- Center: Navigation links (Dashboard, Library) in gray-600, no underline, hover → Indigo-600
- Right: User avatar (32px circle) + dropdown menu, Settings icon, Logout

No sticky background — light and minimal. Logo animation on hover: scale 1.05.
```

### Sidebar (Dashboard)
```
- Optional: Collapsible sidebar on desktop
- If included: 256px width, background #f9fafb
- Shows user avatar + name at top (rounded card)
- Navigation items: 40px height, 12px left padding, icon + text
- Active state: Indigo background, white text, rounded 8px on right side only
- Bottom: Settings, Logout, Feedback (subtle links in gray-600)

Mobile: Hamburger menu (no permanent sidebar)
```

### Content Grid (Main Dashboard)
```
- Max-width: 1280px (containers), centered with padding
- Default padding: 32px on sides
- Three-column on large screens:
  - Left (2/3): Input panel + Results
  - Right (1/3): Format selection + Options

Tablet (768px-1024px): Two-column
Mobile (<768px): Single column (full width)

Breathing room: Content never feels cramped. Use whitespace intentionally.
```

---

## Component Specifications

### Buttons

**Primary Button (CTA)**
```
Background: Indigo-600
Text: White, 16px, weight 600
Padding: 12px 24px
Border Radius: 8px
Hover: Background → Indigo-700, shadow increase, scale 1.02
Active: Background → Indigo-800, scale 0.98
Disabled: Background → Gray-300, cursor not-allowed, opacity 0.5

Icon + Text: Icon on left, 8px gap, centered
Loading: Show spinner + "Generating..." text, disabled state
```

**Secondary Button**
```
Background: Gray-100
Text: Gray-900, 16px, weight 600
Border: None
Padding: 12px 24px
Border Radius: 8px
Hover: Background → Gray-200, scale 1.02
Active: Background → Gray-300, scale 0.98

Use for: Copy, Save, Cancel, Less important CTAs
```

**Ghost Button**
```
Background: Transparent
Text: Indigo-600, 16px, weight 500
Border: None
Padding: 12px 16px
Hover: Background → Indigo-50, text → Indigo-700
Active: text → Indigo-900, scale 0.98

Use for: Links, secondary navigation, close buttons
```

### Input Fields

**Text Input**
```
Background: White
Border: 1px solid #e2e8f0
Text: Gray-900, 16px
Placeholder: Gray-400, italic
Padding: 12px 16px
Border Radius: 8px

Focus State:
  - Border: 2px solid Indigo-600
  - Shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) [soft blue glow]
  - Background: White (no change)

Error State:
  - Border: 2px solid Red-500
  - Shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)
  - Helper text below in Red-600

Disabled State:
  - Background: Gray-50
  - Border: 1px solid Gray-200
  - Text: Gray-400
  - Cursor: not-allowed
```

**Textarea (Content Input)**
```
Same as Input, but min-height: 320px
Font: "Monaco" monospace, 14px (for code/long text readability)
Line-height: 1.6
Resize: Vertical only

Focus: Same blue glow + border
```

**Select Dropdown**
```
Background: White
Border: 1px solid #e2e8f0
Padding: 12px 16px
Border Radius: 8px
Icon: Chevron down in Gray-600, on right side

Open State:
  - Border: 2px solid Indigo-600
  - Shadow: Medium
  - Dropdown items background: White
  - Hover item: Background Indigo-50, text Indigo-900
  - Selected: Checkmark + Indigo-600 text

Mobile: Native select dropdown (system default)
```

### Cards

**Result Card**
```
Background: White
Border: 1px solid #e2e8f0
Border Radius: 12px
Padding: 24px
Margin Bottom: 16px
Box Shadow: Light

Hover:
  - Border: Indigo-200
  - Shadow: Medium
  - Transform: translateY(-2px)

Header (Format Name + Copy Button):
  - Flex row, space-between
  - Title: 16px, weight 600, Indigo-600
  - Copy Button: Ghost style, small

Content:
  - Font: 14px, Gray-800
  - Line Height: 1.6
  - Max-height: 400px, overflow-y auto if longer
  - Preserve formatting (use <pre> with whitespace: pre-wrap)
```

**Format Selection Grid**
```
Grid: auto-fill, minmax(120px, 1fr)
Gap: 12px

Each Format Button:
  - Background: Gray-100
  - Border: 2px solid transparent
  - Padding: 16px
  - Border Radius: 12px
  - Text: Gray-900, 14px center

Hover:
  - Border: Indigo-200
  - Background: Indigo-50

Selected State:
  - Border: 2px solid Indigo-600
  - Background: Indigo-50
  - Icon: Checkmark Indigo-600 (top right corner)
  - Box Shadow: 0 0 0 3px rgba(79, 70, 229, 0.1)

Icon: 24px emoji/icon above text
Text: Platform name (TikTok, LinkedIn, etc.)
```

### Tabs

```
Tab List:
  - Display: flex, gap 0 (no space between)
  - Border Bottom: 1px solid #e2e8f0

Tab Item:
  - Padding: 16px 24px
  - Border: None
  - Background: Transparent
  - Text: Gray-600, 16px, weight 500
  - Cursor: pointer
  - Position: relative

Active Tab:
  - Text: Indigo-600, weight 600
  - Border Bottom: 3px solid Indigo-600 (extends full height)

Hover (Inactive):
  - Text: Gray-900
  - Background: Gray-50

Tab Content:
  - Padding: 24px 0
  - Animation: Fade in 150ms (opacity)
```

### Modal / Dialog

```
Overlay:
  - Background: rgba(0, 0, 0, 0.4) [subtle darkening]
  - Backdrop Filter: blur(4px) [frosted glass effect]
  - Animation: Fade in 150ms

Modal Box:
  - Background: White
  - Border Radius: 16px [larger for modals]
  - Padding: 32px
  - Max-width: 500px
  - Box Shadow: Heavy
  - Animation: Scale up from center (0.9 → 1.0, 200ms)

Close Button:
  - Top right corner
  - Ghost button style
  - Icon: X (lucide-react)

Header:
  - Title: 24px, weight 700, Gray-900
  - Subtitle: 14px, Gray-600, margin-top 8px

Actions (Bottom):
  - Button group, gap 12px
  - Primary button on right
  - Secondary button on left
  - Margin Top: 32px
```

### Loading States

**Skeleton Loader (Preferred)**
```
Shape: Match the actual element (text = thin rect, card = rounded rect)
Color: Linear gradient animation #f3f4f6 → #e5e7eb → #f3f4f6
Animation: -webkit-gradient moving left-to-right, 2 second loop
Timing: 100ms per skeleton loader
Usage: Replace actual content while loading
```

**Generating Animation**
```
When Claude is generating:
  - Result card has: pulse opacity animation (0.5 → 1.0 → 0.5)
  - Loader text: "✨ Generating..." with animated dots (one appears every 300ms)
  - Progress bar: Optional 100% width blue line under navbar (deterministic time OR indeterminate)

Duration: Show for at least 500ms even if fast (avoid jarring UI)
Completion: Fade out + slide in results
```

### Badges / Tags

```
Default Badge:
  - Background: Gray-100
  - Text: Gray-700, 12px, weight 500
  - Padding: 4px 12px
  - Border Radius: 12px
  - Border: None

Success Badge:
  - Background: Emerald-100
  - Text: Emerald-700

Warning Badge:
  - Background: Amber-100
  - Text: Amber-700

Info Badge:
  - Background: Cyan-100
  - Text: Cyan-700
```

---

## Page Layouts

### Landing Page (/)

**Hero Section** (Height: 100vh or min 600px)
```
Background: Gradient (Indigo-600 → Cyan-500 at 135deg)
Text: White
Content centered, max-width 800px

H1: "Content. Once. Everywhere." (48px, weight 700)
Subtitle: "One piece of content, transformed into 10+ formats. In seconds." (20px, Gray-100)
CTA Button: "Try Free" (Primary button, white text, Indigo-600 background)

Below: "50+ creators already generating" (small gray text + 3 avatar circles)

Right side: Hero illustration or screenshot (optional, add via Figma)
```

**Features Section**
```
2 columns on desktop, 1 on mobile
Each feature card:
  - Large emoji/icon (48px)
  - Title: 20px, weight 600
  - Description: 14px, Gray-600
  - Example "Before/After" (optional)

Features:
  1. "Content Input" - Paste, YouTube URL, Blog link
  2. "Smart Repurposing" - AI transforms to 10+ formats
  3. "Copy & Share" - One-click copy or schedule to socials
  4. "Save & Reuse" - Library of past generations
```

**Pricing Section** (Not MVP, but design for it)
```
Simple pricing:
  - Free: 3 generations/day
  - Pro: $5/month, unlimited
  - Team: $30/month, up to 5 people

Cards side-by-side, Free on left, Pro highlighted (slightly larger, shadow)
```

**FAQ Section**
```
Accordion component (collapsible Q&A)
Each Q opens to show A
Animation: 200ms expand/collapse
Styling: Simple Q text in Gray-900, A in Gray-600
```

### Dashboard Page (/dashboard)

**Main Layout:**
```
Navbar at top (64px)
Content area with 3-column grid:
  - Left 2/3: Input panel + Results
  - Right 1/3: Options panel (tone, formats)

Or full-width on mobile (stack vertically)
```

**Input Panel Component**
```
Background: White with border #e2e8f0
Padding: 24px
Border Radius: 12px

Tabs: "Paste Text", "YouTube URL", "Blog Link"
Below: Large textarea or input field with placeholder

Visual hierarchy:
  - Label above (14px, weight 600, Gray-900)
  - Input below (16px)
  - Helper text below (12px, Gray-600)
```

**Options Panel (Right Side)**
```
Background: Gray-50 (subtle distinction)
Padding: 24px
Border Radius: 12px

Section 1: Tone Selector
  - Label: "Choose Tone" (14px, weight 600)
  - Select dropdown with 4 options

Section 2: Format Grid
  - Label: "Select Formats" (14px, weight 600)
  - 2-column grid of format buttons
  - Each button: Icon + label, selectable

Section 3: Generate Button
  - Full width, primary button (48px height)
  - "✨ Generate" with loading state

Spacing between sections: 24px
```

**Results Area**
```
Display once generation complete
Grid: 2 columns (desktop), 1 (mobile)
Gap: 16px

Each result card:
  - White background, light border
  - Format name as header (Indigo-600, 16px, weight 600)
  - Copy button on top right
  - Content below (scrollable if long)
  - Icons for each format (lucide-react)

Animation: Stagger in from top (each card delays 100ms)
Success feedback: Checkmark icon + toast "Copied to clipboard"
```

### Library Page (/dashboard/library)

```
Header: "Your Generations" (32px, weight 600)
Subtitle: "All past content conversions" (Gray-600)

Filter/Sort: 
  - Sort by: Newest first, Oldest first, Most used
  - Filter by: TikTok, LinkedIn, etc. (tag-like buttons)

Grid: Responsive grid of generation cards
Each card:
  - Original content snippet (first 100 chars)
  - Date + time (Gray-500, small)
  - Formats generated (5 icon badges)
  - Actions: View details, Delete
  - Hover: Opens detail modal or expands card

No results state:
  - Illustration (simple SVG or emoji)
  - Text: "No generations yet. Start by creating content above."
  - Link: "Create your first" (blue link)
```

---

## Micro-Interactions

### Copy to Clipboard
```
Before: Ghost button "Copy" in Gray-600
On Hover: Button becomes Indigo-50 background
On Click:
  1. Icon changes to ✓ (checkmark)
  2. Text changes to "Copied!" in Emerald-600
  3. Button scales 1.05 briefly
  4. Toast notification appears (bottom right, green)
After 2s: Reset to "Copy"
```

### Button Hover States
```
Primary Button:
  - Background darkens (Indigo-700)
  - Shadow increases (Light → Medium)
  - Scale: 1.02
  - Cursor: pointer

Ghost Button:
  - Background appears (Indigo-50)
  - Text color increases (Gray-600 → Gray-900)
  - Scale: 1.02

Secondary Button:
  - Background lightens (Gray-200)
  - Scale: 1.02
```

### Form Focus States
```
When user clicks input:
  1. Border color changes (Gray-300 → Indigo-600)
  2. Soft glow appears (rgba(79, 70, 229, 0.1) shadow)
  3. Placeholder text fades (opacity 0.3)
  4. Smooth transition (150ms)

On blur (lose focus):
  1. Border reverts to Gray-300
  2. Glow disappears
  3. Placeholder reappears
```

### Loading State Transition
```
Step 1: User clicks "Generate"
  - Button becomes disabled
  - Icon changes to spinner
  - Text changes to "Generating..."

Step 2: While Claude is thinking
  - Loading skeleton appears in results area
  - Pulse animation on skeleton
  - Timer shows "0s" increasing

Step 3: Result arrives
  - Skeleton fades out (200ms)
  - Results fade in (200ms)
  - Staggered card appearance (each 100ms offset)

Step 4: User interaction
  - Results appear with green copy buttons ready
  - No additional loading states
```

---

## Responsive Design

### Breakpoints
```
Mobile:     < 640px
Tablet:     640px - 1024px
Desktop:    > 1024px
Large:      > 1280px
```

### Mobile-First Approach
```
Base styles for mobile (single column, full width)
@media (min-width: 640px) → Tablet adjustments
@media (min-width: 1024px) → Desktop multi-column

Key changes:
  - Mobile: 16px padding, 1-column grid
  - Tablet: 24px padding, 2-column grid
  - Desktop: 32px padding, 3-column grid
  - Font sizes: -2px on mobile
```

### Navigation on Mobile
```
Navbar: Keep fixed at top
Logo: "CA" instead of "ContentAlchemy" (save space)
Navigation: Hamburger menu (3 horizontal lines icon)
  - Tap opens drawer from left
  - Drawer items: Dashboard, Library, Settings, Logout
  - Drawer: 90% width, white background, slides in 300ms

No sidebar on mobile: All navigation goes to hamburger
```

---

## Dark Mode (Optional, for V2)

Not required for MVP, but design should support it:
```
Color overrides:
  - Background: #0f172a instead of white
  - Text: #f1f5f9 instead of #0f172a
  - Borders: #1e293b instead of #e2e8f0
  - Cards: #1e293b instead of white
  - Shadows: No change (still black-based)

All other specs remain the same.
```

---

## Accessibility (WCAG 2.1 AA)

### Contrast Ratios
```
Text: 4.5:1 minimum (all text vs background)
Large text (18px+): 3:1 minimum
Interactive elements: 3:1 minimum

✓ Indigo-600 on White: 7.2:1 (PASS)
✓ Gray-600 on White: 5.4:1 (PASS)
✓ Gray-700 on Gray-100: 8.1:1 (PASS)
```

### Keyboard Navigation
```
Tab order: Top to bottom, left to right
Focus visible: 2px Indigo-600 outline with 2px gap
Buttons: Keyboard-accessible with Space or Enter
Links: Underline on focus, not hover
Modals: Focus trapped inside (return to trigger on close)
```

### Screen Reader
```
Use semantic HTML: <button>, <input>, <label>, <header>, etc.
Images: Always include alt text (or aria-hidden="true" if decorative)
Icons: Use aria-label for icon-only buttons
Form errors: Connect errors to inputs with aria-describedby
Loading: Use aria-live="polite" for status updates
```

---

## Copy & Messaging

### Button Labels
```
Primary CTA: "✨ Generate" (with icon)
Success: "✓ Copied!" (on copy button)
Loading: "Generating..." (during generation)
Error: "Retry" or "Try Again"
Disabled: "Select formats to continue"
```

### Placeholder Text
```
Input: "Paste your blog post, article, or transcript..."
URL input: "Paste YouTube URL or blog link..."
```

### Toast Messages
```
Success: "✓ Copied to clipboard!" (Green, bottom-right, 3s)
Error: "⚠ Something went wrong. Try again." (Red, bottom-right, 5s)
Info: "ℹ You've generated 3 formats today" (Blue, bottom-right, 3s)
```

---

## Design Checklist Before Shipping

- [ ] All buttons have hover + active states
- [ ] All inputs have focus states with blue glow
- [ ] All text has correct line-height and letter-spacing
- [ ] Cards have subtle shadows, not harsh
- [ ] Loading states use skeletons, not spinners
- [ ] Modals center properly on all screen sizes
- [ ] Mobile layout tested on 375px (iPhone SE) and 768px (iPad)
- [ ] Contrast ratios verified (use WebAIM tool)
- [ ] Animations are smooth (no jank, 60fps)
- [ ] Images optimized (use Next.js <Image>)
- [ ] Forms are accessible (labels connected to inputs)
- [ ] No console errors or warnings
- [ ] Lighthouse score > 90 on all metrics

---

## Tools & Resources

### Design System (Use These)
```
Colors: https://tailwindcss.com/docs/customization/colors
Shadows: Tailwind shadow utilities
Spacing: Tailwind space scale
Typography: Inter font from Google Fonts
Icons: lucide-react (24px default size)
Animations: Framer Motion for complex animations
```

### Components (Use shadcn/ui)
```
Buttons: <Button>
Inputs: <Input>, <Textarea>
Selects: <Select>
Tabs: <Tabs>
Cards: <Card>
Dialogs: <Dialog>
Toasts: sonner library
```

### Lighthouse Targets
```
Performance: > 90
Accessibility: > 95
Best Practices: > 95
SEO: > 95
```

---

## Final Note

This is NOT a side project. This is a **professional SaaS**. Every pixel matters. Every animation should feel intentional. Every color should have purpose.

When someone visits your app, they should think: "This startup probably raised $2M." Not: "Cool college project."

That's the bar. Design to that.

Now go build something beautiful. ✨
