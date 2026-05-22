# Claude Code Prompt — ContentAlchemy
## AI-Powered Content Repurposing SaaS

---

You are a full-stack AI engineer. Build **ContentAlchemy** — a SaaS that takes one piece of content and transforms it into 10+ platform-specific formats using Claude API.

This is a portfolio project for a B.Tech fresher targeting 15–20 LPA. The codebase must be production-ready, beautifully designed, and deployed live within 5 weeks.

---

## Core Value Proposition

**Problem:** Content creators spend hours reformatting the same content for different platforms.  
**Solution:** Upload content once → Get 10+ platform-specific versions in seconds.  
**Result:** Creators save 10 hours/week and reach more audiences.

---

## MVP Scope (5-Week Build)

### What Users Can Do:
1. **Input content** (text paste, YouTube URL, blog link)
2. **Select output formats** (choose which formats to generate)
3. **Customize tone** (professional, casual, humorous, educational)
4. **Copy & share** generated content directly to clipboard or social media
5. **Save to library** (access past generations)
6. **Compare versions** (side-by-side view of all formats)

---

## Tech Stack — Final Decision

### Frontend
```
Framework:      Next.js 15 (App Router, TypeScript)
UI Library:     shadcn/ui + Tailwind CSS
Icons:          lucide-react
Copy to Clipboard: use-clipboard-copy
Code Highlighting: react-syntax-highlighter
Animations:     Framer Motion (smooth transitions)
State:          TanStack Query for API calls, Zustand for local state
```

### Backend
```
Framework:      FastAPI (Python)
LLM:            Claude API (claude-opus-4-20250514)
Database:       PostgreSQL (async SQLAlchemy)
Auth:           JWT + httpOnly cookies
File Handling:  aiohttp for fetching URLs
Cache:          Redis for request deduplication
```

### Deployment
```
Frontend:       Vercel (1-click from GitHub)
Backend:        Railway or Render
Database:       Neon (PostgreSQL) or Railway Postgres
```

---

## Folder Structure

```
content-alchemy/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── signup/page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Main repurposing interface
│   │   │   │   ├── library/page.tsx  # Past generations
│   │   │   │   └── settings/page.tsx # Account settings
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # Landing page
│   │   ├── components/
│   │   │   ├── InputPanel.tsx        # Content input area
│   │   │   ├── OutputFormats.tsx     # Format selection grid
│   │   │   ├── GenerationResult.tsx  # Display generated content
│   │   │   ├── CompareView.tsx       # Side-by-side comparison
│   │   │   ├── Navbar.tsx
│   │   │   └── ui/                   # shadcn components
│   │   ├── lib/
│   │   │   ├── api.ts                # Axios instance
│   │   │   └── utils.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   └── next.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── repurpose.py      # Main endpoint
│   │   │   │   └── library.py        # Save/retrieve history
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── generation.py         # Store past generations
│   │   ├── schemas/
│   │   │   └── repurpose.py
│   │   ├── services/
│   │   │   ├── content_extractor.py  # Extract from URLs/uploads
│   │   │   ├── repurpose_service.py  # THE CORE — Claude prompts
│   │   │   └── cache.py              # Redis
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Database Schema (PostgreSQL)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_content TEXT NOT NULL,
    content_source VARCHAR(50), -- 'text_paste', 'youtube_url', 'blog_link'
    tone VARCHAR(50) DEFAULT 'casual', -- 'professional', 'casual', 'humorous', 'educational'
    
    -- Generated outputs (stored as JSONB for flexibility)
    tiktok_script TEXT,
    linkedin_post TEXT,
    twitter_thread TEXT,
    instagram_caption TEXT,
    newsletter_draft TEXT,
    youtube_description TEXT,
    email_subject TEXT,
    reddit_post TEXT,
    
    generation_time_ms INT, -- How long it took to generate
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

---

## Core API Endpoints

```python
# routes/repurpose.py

@router.post("/api/repurpose")
async def repurpose_content(
    content: str = Form(...),
    source_type: str = Form("text_paste"),  # text_paste, youtube_url, blog_link
    tone: str = Form("casual"),
    formats: list[str] = Form(...),  # ['tiktok', 'linkedin', 'twitter']
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Main endpoint: Take content → Generate multiple formats
    """
    start_time = time.time()
    
    # Extract content if URL
    if source_type == "youtube_url":
        content = await extract_youtube_transcript(content)
    elif source_type == "blog_link":
        content = await extract_blog_content(content)
    
    # Check cache
    cache_key = f"repurpose:{hash(content)}:{tone}:{sorted(formats)}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Generate content for each format
    service = RepurposeService()
    results = await service.generate_all_formats(content, tone, formats)
    
    # Store in DB
    generation = Generation(
        user_id=current_user.id,
        original_content=content,
        content_source=source_type,
        tone=tone,
        tiktok_script=results.get('tiktok'),
        linkedin_post=results.get('linkedin'),
        twitter_thread=results.get('twitter'),
        instagram_caption=results.get('instagram'),
        newsletter_draft=results.get('newsletter'),
        youtube_description=results.get('youtube'),
        email_subject=results.get('email'),
        reddit_post=results.get('reddit'),
        generation_time_ms=int((time.time() - start_time) * 1000)
    )
    db.add(generation)
    await db.commit()
    
    # Cache for 24 hours
    await redis_client.setex(cache_key, 86400, json.dumps(results))
    
    return {
        "success": True,
        "generation_id": str(generation.id),
        "results": results,
        "time_ms": int((time.time() - start_time) * 1000)
    }

@router.get("/api/library")
async def get_generation_library(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = 20,
    offset: int = 0
):
    """Get user's past generations"""
    generations = await db.execute(
        select(Generation)
        .where(Generation.user_id == current_user.id)
        .order_by(Generation.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return generations.scalars().all()
```

---

## Services: The Claude Prompts (repurpose_service.py)

```python
from anthropic import AsyncAnthropic

class RepurposeService:
    def __init__(self):
        self.client = AsyncAnthropic(api_key=settings.CLAUDE_API_KEY)
    
    async def generate_all_formats(self, content: str, tone: str, formats: list[str]):
        """Generate content for requested formats using Claude"""
        
        results = {}
        
        # Define format-specific prompts
        prompts = {
            "tiktok": self.get_tiktok_prompt(content, tone),
            "linkedin": self.get_linkedin_prompt(content, tone),
            "twitter": self.get_twitter_prompt(content, tone),
            "instagram": self.get_instagram_prompt(content, tone),
            "newsletter": self.get_newsletter_prompt(content, tone),
            "youtube": self.get_youtube_prompt(content, tone),
            "email": self.get_email_prompt(content, tone),
            "reddit": self.get_reddit_prompt(content, tone),
        }
        
        # Generate only requested formats (parallel calls)
        tasks = [
            self.call_claude(prompts[fmt], fmt)
            for fmt in formats if fmt in prompts
        ]
        
        generated = await asyncio.gather(*tasks)
        
        for fmt, text in zip(formats, generated):
            results[fmt] = text
        
        return results
    
    async def call_claude(self, prompt: str, format_name: str):
        """Call Claude API with streaming"""
        response = await self.client.messages.create(
            model="claude-opus-4-20250514",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    
    def get_tiktok_prompt(self, content: str, tone: str) -> str:
        return f"""
You are a TikTok viral content expert. Your job is to convert content into a TikTok script.

Original content: {content}

Tone: {tone}

Create a TikTok script (max 150 words) that:
- Hooks in first 3 seconds
- Uses trending language and energy
- Includes trending sounds/music suggestions (e.g., #sound "song name")
- Ends with a clear CTA (like, follow, comment)
- Works for {tone} tone

Format the output as:
[Hook] - First 3 seconds to grab attention
[Main Content] - The core idea
[CTA] - Call to action
[Suggested Sound] - Trending audio

Output ONLY the script, no explanations.
"""
    
    def get_linkedin_prompt(self, content: str, tone: str) -> str:
        return f"""
You are a LinkedIn content strategist. Convert content into a professional LinkedIn post.

Original content: {content}

Tone: {tone}

Create a LinkedIn post that:
- Opens with a hook/question
- Is 150-200 words
- Includes 3 key takeaways or insights
- Ends with a professional CTA (share thoughts, connect, etc.)
- Uses appropriate emojis for {tone}
- If applicable, includes hashtags

Output ONLY the post, no explanations.
"""
    
    def get_twitter_prompt(self, content: str, tone: str) -> str:
        return f"""
You are a Twitter/X viral content expert. Convert content into a Twitter thread.

Original content: {content}

Tone: {tone}

Create a Twitter thread (5-7 tweets) that:
- Tweet 1: Attention-grabbing hook
- Tweets 2-6: Expand on ideas (each tweet under 280 chars)
- Last tweet: Call to action + relevant hashtags
- Uses {tone} voice throughout
- Each tweet should stand alone AND build on previous

Format as numbered tweets:
1/ [tweet text]
2/ [tweet text]
...

Output ONLY the thread, no explanations.
"""
    
    def get_instagram_prompt(self, content: str, tone: str) -> str:
        return f"""
You are an Instagram content expert. Create an Instagram caption + hashtag strategy.

Original content: {content}

Tone: {tone}

Create an Instagram post caption that:
- Is 150-200 words
- Has a compelling opening line
- Uses line breaks for readability
- Includes 15-20 relevant hashtags
- Ends with an engagement question or CTA
- Matches {tone} voice
- Include emoji usage

Format as:
[Caption]

[Hashtags]

Output ONLY the caption with hashtags, no explanations.
"""
    
    def get_newsletter_prompt(self, content: str, tone: str) -> str:
        return f"""
You are an email newsletter expert. Convert content into newsletter content.

Original content: {content}

Tone: {tone}

Create newsletter content (subject line + body) that:

Subject line: Catchy, under 50 chars, creates curiosity
Body: 200-300 words, engaging, includes:
  - Brief intro/hook
  - 3 key points from original content
  - Short story or example if relevant
  - Clear CTA (read more, sign up, etc.)
  - Professional yet {tone} in voice

Format as:
Subject: [line]

Body:
[newsletter content]

Output ONLY the subject and body, no explanations.
"""
    
    # ... similar prompts for youtube, email, reddit
```

---

## Frontend: Key Components

```typescript
// components/InputPanel.tsx
export function InputPanel() {
  const [content, setContent] = useState("");
  const [sourceType, setSourceType] = useState("text_paste");
  const [tone, setTone] = useState("casual");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/repurpose", {
        content,
        source_type: sourceType,
        tone,
        formats: selectedFormats
      });
      // Display results
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Input */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="paste">
          <TabsList>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
            <TabsTrigger value="youtube">YouTube URL</TabsTrigger>
            <TabsTrigger value="blog">Blog Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste">
            <Textarea 
              placeholder="Paste your blog post, article, or transcript..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-80"
            />
          </TabsContent>
          
          {/* YouTube & Blog inputs */}
        </Tabs>
      </div>
      
      {/* Right: Options */}
      <div className="space-y-6">
        <div>
          <Label>Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Formats to Generate</Label>
          <div className="grid grid-cols-2 gap-3">
            {FORMATS.map(fmt => (
              <button
                key={fmt.id}
                onClick={() => toggleFormat(fmt.id)}
                className={`p-3 rounded-lg border-2 transition ${
                  selectedFormats.includes(fmt.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl">{fmt.icon}</div>
                <div className="text-sm font-medium">{fmt.name}</div>
              </button>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={!content || selectedFormats.length === 0 || isLoading}
          className="w-full h-12"
          size="lg"
        >
          {isLoading ? "✨ Creating..." : "✨ Generate"}
        </Button>
      </div>
    </div>
  );
}
```

```typescript
// components/GenerationResult.tsx
export function GenerationResult({ results }) {
  const [copied, setCopied] = useState(null);
  
  const copyToClipboard = (text, format) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(results).map(([format, text]) => (
        <Card key={format} className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold capitalize">{format}</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(text, format)}
            >
              {copied === format ? "✓ Copied" : "Copy"}
            </Button>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
        </Card>
      ))}
    </div>
  );
}
```

---

## 5-Week Build Timeline

**Week 1:** Auth + Landing page + Basic UI scaffold  
**Week 2:** Input panel + Format selection + Integrate Claude API  
**Week 3:** Complete all format prompts + Database storage  
**Week 4:** Frontend polish + Library view + Comparison view  
**Week 5:** Testing + Deploy + Get 50 beta users

---

## Deployment Checklist

- [ ] GitHub Actions CI/CD set up
- [ ] Environment variables configured on Vercel + Railway
- [ ] Database migrations run (`alembic upgrade head`)
- [ ] Test full user flow end-to-end
- [ ] Monitor Claude API costs (set daily limit in dashboard)
- [ ] Add rate limiting to prevent abuse
- [ ] Write a 500-word Medium article explaining the architecture

---

## Success Metrics

By end of week 5:
- ✅ Live URL on Vercel + Railway
- ✅ 50+ beta users
- ✅ Average generation time < 3 seconds
- ✅ 0 runtime errors for 7 days
- ✅ Reddit/HackerNews post gets 100+ upvotes
- ✅ 3-4 content creators using it actively

---

## Bonus: Growth Hacks (After MVP)

1. **Share on ProductHunt** — Easy way to get 500+ users in 1 day
2. **Make it free for first 10 generations** — Hook users, convert to paid
3. **Add scheduling to socials** — "Save time, auto-post to TikTok/LinkedIn" (partnership with Buffer/Later)
4. **Add YouTube timestamp finder** — "Auto-find best clips from YouTube videos"
5. **Affiliate link to hosting** — Get creators to use your SaaS, earn commission on their growth

---

## Start Building

You're ready. This is a 5-week project that will get you 15-20 LPA offers because:
1. It's **real product** (solves actual problem)
2. It's **live and deployed** (not local code)
3. It uses **modern tech** (Claude API, Vercel, Railway)
4. It has **real users** (content creators will use it)
5. It's **beautiful** (design matters for portfolio)

Begin with the Django Code prompt right now. Week 1 focus: Auth + Landing page.

Let's go. 🚀
