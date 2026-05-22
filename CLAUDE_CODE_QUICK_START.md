# ContentAlchemy: Quick Start Guide for Claude Code
## Using Both Prompts to Build a Beautiful SaaS

---

## What You're Building

**ContentAlchemy** is a SaaS that takes content (blog post, video transcript, article) and transforms it into 10+ platform-specific formats:
- TikTok scripts
- LinkedIn posts
- Twitter threads
- Instagram captions
- Newsletter drafts
- YouTube descriptions
- And more...

All powered by Claude API + beautiful modern UI.

**Timeline:** 5 weeks  
**Target:** 50+ beta users  
**LPA Signal:** 16–21 LPA

---

## Your Two Prompts

You have **two separate prompts** to use in Claude Code:

### 1️⃣ **ContentAlchemy Technical Prompt** 
File: `content_alchemy_prompt.md`
- Full-stack architecture
- Database schema
- API endpoints with Claude integration
- Frontend components
- Deployment instructions

### 2️⃣ **Award-Winning UI Design Prompt**
File: `award_winning_ui_design_guide.md`
- Design system (colors, typography, spacing)
- Component specifications
- Layout details
- Micro-interactions
- Accessibility guidelines

---

## How to Use These Prompts

### Step 1: Start Claude Code Session #1 (Backend + Architecture)

1. Open Claude Code (new session)
2. Copy the entire **content_alchemy_prompt.md**
3. Paste into Claude Code as your first message
4. **Claude will:**
   - Create all folder structure
   - Generate all Python files (FastAPI, SQLAlchemy models, Claude service)
   - Generate docker-compose.yml
   - Create database migrations
   - Show you exact API implementation

**Expected output:** Complete backend codebase ready to test

### Step 2: Start Claude Code Session #2 (Frontend + UI)

1. Open Claude Code (new session)
2. First, paste the **award_winning_ui_design_guide.md**
3. Then say: "Using this design system, build the frontend for ContentAlchemy with these pages:"
   ```
   - Landing page (/)
   - Login/Signup (/auth/login, /auth/signup)
   - Dashboard (/dashboard) with:
     * Input panel for content
     * Format selection grid
     * Generation results display
   - Library (/dashboard/library) showing past generations
   - Account settings (/dashboard/settings)
   ```

4. **Claude will:**
   - Generate all Next.js pages
   - Create all React components with design specs
   - Implement animations with Framer Motion
   - Use correct colors, spacing, shadows
   - Add proper form handling with React Hook Form

**Expected output:** Beautiful, production-ready frontend

---

## Weekly Build Plan

### **Week 1: Backend Setup**
**Goal:** Get API running locally

```bash
# Step 1: Run Claude Code with technical prompt
# Output: backend/ folder with all Python code

# Step 2: Local setup
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# Step 3: Database
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
alembic upgrade head

# Step 4: Test API
python -m uvicorn app.main:app --reload
# Visit http://localhost:8000/docs
```

**Check:** Can you register a user and login?

---

### **Week 2: Claude API Integration**

**Goal:** Generate content for one format (TikTok)

The technical prompt includes `repurpose_service.py` which has all the prompts ready. You just need to:

```python
# In backend/app/services/repurpose_service.py
# All the prompts are already there, just test them:

matcher = RepurposeService()
result = await matcher.generate_all_formats(
    content="A blog post about AI...",
    tone="casual",
    formats=["tiktok"]
)
# Should return a TikTok script
```

**Check:** Does the Claude API call work? Can you see TikTok script generation?

---

### **Week 3: Frontend Build**

**Goal:** Build the dashboard UI (input + results)

```bash
# Step 1: Run Claude Code with design prompt
# Output: frontend/ folder with Next.js project

# Step 2: Install & run locally
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

**What to build (in order):**
1. Login/Signup pages (auth flow)
2. Dashboard layout (navbar + sidebar + main content area)
3. Input panel (tabs for paste/YouTube/blog)
4. Format selection grid
5. Generation results display

**Check:** Can you see all the pages? Do buttons have hover states? Is the design award-winning quality?

---

### **Week 4: Connect Frontend to Backend**

**Goal:** Make the end-to-end flow work

```typescript
// In frontend/src/lib/api.ts
const API_URL = "http://localhost:8000";

export const repurpose = async (content: string, tone: string, formats: string[]) => {
  const response = await fetch(`${API_URL}/api/repurpose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ content, tone, formats })
  });
  return response.json();
};
```

**Test flow:**
1. User types content in input panel
2. Click "✨ Generate"
3. See loading skeleton
4. Results appear with all formats
5. Copy buttons work
6. Results saved to library

**Check:** Can you generate 5 formats and see them all on screen?

---

### **Week 5: Polish + Deploy**

**Goal:** Ship to production

```bash
# 1. Deploy backend to Railway
git push origin main
# Railway auto-deploys from GitHub

# 2. Update frontend API URL
# In next.config.ts or .env:
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app

# 3. Deploy frontend to Vercel
npm run build
vercel deploy

# 4. Test production
# Visit https://your-vercel-app.vercel.app
```

**Checklist:**
- [ ] Backend deployed and responding
- [ ] Frontend deployed and accessible
- [ ] Auth works on production
- [ ] Can generate content on production
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## Pro Tips

### 💡 Prompt Engineering Tips

When Claude Code outputs code, you can iterate:

**If you want to refine the design:**
> "Make the input panel have a gradient background from indigo to cyan. Also, the copy button should have a green success state."

**If you want to add a feature:**
> "Add a 'Compare' view where users can see all generated formats side-by-side instead of in a grid. Make it a new page."

**If something's not working:**
> "The Claude API calls are taking 5+ seconds. Add a loading state that shows 'Generating...' with animated dots. Also, cache results so the same content doesn't get re-generated."

### 📱 Testing on Mobile

Always test on mobile before pushing:
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
# Or on Windows: ipconfig

# Visit from phone
http://[YOUR_IP]:3000
```

Make sure:
- [ ] Navbar looks good (hamburger menu for mobile)
- [ ] Input panel is readable (not too small)
- [ ] Buttons are 44px+ (thumb-friendly)
- [ ] No horizontal scroll

### 🔐 Environment Variables

Create `.env.local` in both frontend and backend:

```bash
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/contentalchemy
CLAUDE_API_KEY=sk-ant-...
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-min-32-chars

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=ContentAlchemy
```

Never commit these files!

### 🚀 Getting Your First 50 Users

By week 5, you want 50+ beta users. Here's how:

1. **Week 4:** Share with 5 content creators you know
   - "I built a tool that auto-generates TikTok scripts from blog posts. Try it?"
   - They'll give feedback

2. **Week 5:** Iterate based on feedback
   - "I made the copy button bigger"
   - "I added support for podcast descriptions"

3. **Week 5:** Launch on ProductHunt
   - Write a good title: "ContentAlchemy - Turn 1 blog post into 10 social posts instantly"
   - Get 500+ upvotes = viral validation

4. **Week 5:** Post on Reddit
   - r/SideProjects: "Built a SaaS that repurposes content for creators"
   - r/webdev: "Full-stack app built with Next.js + FastAPI + Claude API"
   - r/Entrepreneur: "Launched ContentAlchemy - helping creators save time"

5. **Week 5:** HackerNews
   - "Show HN: ContentAlchemy — repurpose content to 10+ platforms instantly"
   - Gets 50-200 upvotes usually

---

## Troubleshooting

### "Claude API calls are slow"
**Solution:** Add caching with Redis. The technical prompt already includes this. Make sure Redis is running:
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

### "Frontend not connecting to backend"
**Solution:** Check CORS in fastapi:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-vercel-app.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### "Design looks off on mobile"
**Solution:** Use the responsive breakpoints from the UI guide. Test on actual phone or use DevTools device emulation.

### "Lighthouse score is low"
**Solution:** 
- Images: Use Next.js <Image> component
- Fonts: Preload Inter from Google Fonts
- Code: Split large components with dynamic imports
- CSS: Unused Tailwind utilities are removed automatically

### "Users getting rate limited by Claude API"
**Solution:** Add a rate limit to the endpoint:
```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.post("/api/repurpose")
@limiter.limit("10/minute")
async def repurpose_content(...):
    # Now max 10 requests per minute
```

---

## What an Interviewer Will Ask

**Q: "Tell me about ContentAlchemy"**
> "I built a full-stack SaaS that helps creators save hours of content repurposing. Users paste or upload a blog post, and the app uses Claude API to instantly generate TikTok scripts, LinkedIn posts, Twitter threads, Instagram captions, and more. I used Next.js + TypeScript on the frontend with award-winning design inspired by Vercel and Linear, FastAPI for the backend with async PostgreSQL, and integrated Claude's latest model for content generation. I added Redis caching so identical content doesn't get re-processed, and deployed to Vercel + Railway. Got 50+ beta users in week one after launch on ProductHunt."

**Q: "What was the hardest part?"**
> "Optimizing Claude API calls was tricky. Initial latency was 5+ seconds because I was calling Claude sequentially for each format. I refactored to make parallel async calls and added Redis caching with content hashing. That brought latency down to under 2 seconds for cached requests. I also had to learn how to write effective prompts for Claude to generate platform-specific content reliably."

**Q: "How would you scale this?"**
> "For scaling, I'd: (1) Add job queues with Celery for longer-running generations, (2) use PostgreSQL connection pooling, (3) add CDN for frontend assets, (4) implement user quotas and pricing tiers, (5) monitor with Sentry for errors and usage patterns, and (6) maybe add a mobile app with React Native."

---

## Final Checklist Before Shipping

- [ ] Backend runs locally without errors
- [ ] Frontend has award-winning design quality
- [ ] Can generate content for all 8 formats
- [ ] Loading states are smooth (no spinners)
- [ ] Copy buttons work
- [ ] Library saves generations
- [ ] Deployed to Vercel + Railway
- [ ] GitHub repo is clean (good commit messages)
- [ ] README has architecture diagram
- [ ] Tests pass (at least happy path)
- [ ] Lighthouse > 90 on all metrics
- [ ] 50+ beta users signed up
- [ ] ProductHunt launch went well
- [ ] Medium article published explaining the build

---

## Next Steps

1. **This week:** Read both prompts carefully
2. **Next week:** Start Claude Code Session #1 (backend)
3. **Week 2:** Start Claude Code Session #2 (frontend)
4. **Week 3-4:** Integrate and test locally
5. **Week 5:** Deploy and launch

By end of week 5, you'll have a **live, deployed SaaS with real users**. That's a 15–20 LPA conversation starter right there.

Good luck! 🚀

Questions? The prompts are comprehensive. Just paste them into Claude Code and start building.
