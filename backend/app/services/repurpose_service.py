import asyncio
import httpx

from anthropic import AsyncAnthropic, AsyncAnthropicBedrock

from app.core.config import settings

DEMO_RESPONSES = {
    "tiktok": "[Hook] Understanding version control doesn't have to be difficult.\n\n[Main Content] Git is actually a simple database under the hood. It uses blobs to store compressed file content, trees to map folder structures, and commits to link snapshots together in a timeline history.\n\n[CTA] Drop a comment below if you want a detailed guide on resolving merge conflicts.",
    "linkedin": "Understanding the architecture of version control can save developers hours of troubleshooting.\n\nInstead of treating Git as a list of command-line tools to memorize, it helps to look at it as a graph database.\n\nHere are three key concepts:\n1. Blobs represent compressed snapshots of individual files.\n2. Trees represent directory structures, mapping names to blob hashes.\n3. Commits store snapshots of the root tree along with author metadata and parent references.\n\nWhen you learn the underlying data structure, resolving merge conflicts and tracking history changes becomes logical.\n\nHow do you teach version control in your engineering teams? Share your thoughts below.\n\n#SoftwareDevelopment #Git #Engineering #Productivity",
    "twitter": "1/ Git is not a complex mystery. It is a simple directed acyclic graph database.\n\nHere is a breakdown of how it works under the hood:\n\n2/ Every tracked file is a Blob, which holds only raw content, indexed by a hash key.\n\n3/ A Tree behaves like a directory. It lists names, permissions, and hashes of blobs or other sub-trees.\n\n4/ A Commit links to a root Tree snapshot and records parent hashes to form history branches.\n\n5/ Understanding this structure makes version control intuitive. Follow for more software architecture tips.",
    "instagram": "Mastering version control starts with understanding the graph architecture rather than memorizing terminal lines.\n\nWhen you commit, you are saving a snapshot of your project directory structure. Blobs store the files, Trees store the folders, and Commits link them together.\n\nWhat is your favorite Git command? Let me know in the comments below!\n\n#VersionControl #Git #SoftwareEngineering #CodingLife",
    "newsletter": "Subject: Building a mental model for version control\n\nBody:\nHey there,\n\nWhen learning software engineering, version control is often introduced as a set of CLI commands. However, understanding the database structure of Git is much more effective.\n\nHere are three key architectural concepts:\n\n1. Git handles file content using Blobs. Blobs store the data and ignore filenames.\n\n2. Directories are represented as Trees. These link names to hashes of files and subdirectories.\n\n3. Commits are snapshots that link back to their parent history.\n\nBy visualizing your repository as a directed graph, resolving conflicts becomes a matter of traversing history rather than guessing command sequences.\n\nKeep coding,\n[Your Name]",
    "youtube": "An in-depth explanation of version control graph architecture and internal structures.\n\nTimestamps:\n0:00 - Introduction to repository internals\n1:45 - How Blobs store file content\n3:30 - Defining Trees and directory snapshots\n5:15 - Commits and parent pointers\n7:30 - Visualizing merge conflicts\n9:15 - Practical tips for history management\n\n🔗 Links:\n→ Full architecture diagram: [link]\n→ Version control cheat sheet: [link]\n\nKey takeaways:\n• Blobs represent content snapshots\n• Trees store directory structures\n• Commits construct the history graph\n\n#VersionControl #SoftwareDevelopment #Coding",
    "email": "Subject: Understanding repository structures\nPreview: A graph-based approach to version control.\n\nHey [First Name],\n\nMany developers struggle with version control because they rely on memorized terminal commands.\n\nInstead of memorizing commands, visualizing the repository as a database of blobs, trees, and commits makes the workflow logical.\n\nUnderstanding these structures helps prevent merge errors and simplifies history management.\n\nLet me know if you would like resources on mastering repository internals.\n\nCTA: Download the Git Internals Guide",
    "reddit": "Title: Why version control should be taught using graph theory instead of command lists\n\nHey everyone,\n\nI have been mentoring junior engineers for several years, and version control is consistently a point of confusion. The typical approach is teaching command sequences for adding, committing, and pushing.\n\nHowever, I have found that explaining the graph architecture is far more successful. When developers realize that a repository is a directed acyclic graph of snapshots, the commands make sense automatically.\n\nBlobs hold file contents, Trees map directories, and Commits build the lineage.\n\nWhat are your thoughts on teaching internal data structures first?\n\nTL;DR: Teaching Git as a graph database instead of a set of CLI commands prevents confusion and resolves common merge errors.",
}


class RepurposeService:
    def __init__(self):
        self.client = None
        self.use_gemini = False
        if settings.GEMINI_API_KEY:
            self.use_gemini = True
        elif settings.CLAUDE_API_KEY:
            if settings.CLAUDE_API_KEY.startswith("bedrock-"):
                self.client = AsyncAnthropicBedrock()
            else:
                self.client = AsyncAnthropic(api_key=settings.CLAUDE_API_KEY)

    async def generate_all_formats(self, content: str, tone: str, formats: list[str]) -> dict[str, str]:
        if not self.use_gemini and not self.client:
            await asyncio.sleep(0.5)
            return self._generate_dynamic_mock_responses(content, tone, formats)

        prompts = {
            "tiktok": self._tiktok_prompt(content, tone),
            "linkedin": self._linkedin_prompt(content, tone),
            "twitter": self._twitter_prompt(content, tone),
            "instagram": self._instagram_prompt(content, tone),
            "newsletter": self._newsletter_prompt(content, tone),
            "youtube": self._youtube_prompt(content, tone),
            "email": self._email_prompt(content, tone),
            "reddit": self._reddit_prompt(content, tone),
        }

        if self.use_gemini:
            tasks = [
                self._call_gemini(prompts[fmt], fmt)
                for fmt in formats
                if fmt in prompts
            ]
        else:
            tasks = [
                self._call_claude(prompts[fmt], fmt)
                for fmt in formats
                if fmt in prompts
            ]

        generated = await asyncio.gather(*tasks, return_exceptions=True)
        valid_formats = [fmt for fmt in formats if fmt in prompts]
        results = {}
        for fmt, result in zip(valid_formats, generated):
            if isinstance(result, Exception):
                results[fmt] = f"[Error generating {fmt}: {str(result)[:100]}]"
            else:
                results[fmt] = result
        return results

    async def _call_gemini(self, prompt: str, format_name: str) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers, timeout=30.0)
            if response.status_code != 200:
                raise Exception(f"Gemini API returned status {response.status_code}: {response.text}")
            data = response.json()
            try:
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError) as e:
                raise Exception(f"Failed to parse Gemini API response: {data}")

    async def _call_claude(self, prompt: str, format_name: str) -> str:
        response = await self.client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text

    def _tiktok_prompt(self, content: str, tone: str) -> str:
        return f"""You are a content writer. Convert this content into a short TikTok video script.
Do NOT use any emojis.

Original content: {content}

Tone: {tone}

Create a script (max 150 words) that:
- Hooks in first 3 seconds
- Uses natural, clear spoken language
- Ends with a clear call to action (follow, comment)
- Works for {tone} tone

Format:
[Hook] - First 3 seconds
[Main Content] - The core idea
[CTA] - Call to action

Output ONLY the script, no explanations."""

    def _linkedin_prompt(self, content: str, tone: str) -> str:
        return f"""You are a professional editor. Convert this into a LinkedIn post.
Do NOT use any emojis.

Original content: {content}

Tone: {tone}

Create a LinkedIn post that:
- Opens with a clear hook or question
- Is 150-200 words
- Includes 3 key takeaways or insights in clean text paragraphs
- Ends with a professional question or call to action
- Includes relevant hashtags at the bottom

Output ONLY the post, no explanations."""

    def _twitter_prompt(self, content: str, tone: str) -> str:
        return f"""You are a content writer. Convert this into a Twitter thread.
Do NOT use any emojis.

Original content: {content}

Tone: {tone}

Create a Twitter thread (5-7 tweets) that:
- Tweet 1: Hook or introduction
- Tweets 2-6: Expand on ideas (each under 280 chars)
- Last tweet: Call to action or concluding point
- Uses {tone} voice throughout

Format as numbered tweets:
1/ [tweet text]
2/ [tweet text]

Output ONLY the thread, no explanations."""

    def _instagram_prompt(self, content: str, tone: str) -> str:
        return f"""You are a caption writer. Create an Instagram caption + hashtag list.
Do NOT use any emojis.

Original content: {content}

Tone: {tone}

Create an Instagram post caption that:
- Is 150-200 words
- Has a clear opening line
- Uses standard line breaks for readability
- Includes 10-15 relevant hashtags
- Ends with an engagement question
- Matches {tone} voice

Format:
[Caption]

[Hashtags]

Output ONLY the caption with hashtags, no explanations."""

    def _newsletter_prompt(self, content: str, tone: str) -> str:
        return f"""You are an editor. Convert this into newsletter content.
Do NOT use any emojis.

Original content: {content}

Tone: {tone}

Create newsletter content that:
Subject line: Catchy, under 50 chars
Body: 200-300 words including:
  - Brief introduction
  - 3 key points from original content
  - Short example or summary
  - Clear call to action
  - Professional yet {tone} voice

Format:
Subject: [line]

Body:
[newsletter content]

Output ONLY the subject and body, no explanations."""

    def _youtube_prompt(self, content: str, tone: str) -> str:
        return f"""You are a content writer. Create a YouTube video description.
Do NOT use any emojis.

Original content: {content}

Tone: {tone}

Create a description that:
- Compelling first 2 lines
- Includes timestamps list format
- Contains relevant search terms
- Links section placeholder
- Is 200-300 words total
- Matches {tone} voice

Output ONLY the description, no explanations."""

    def _email_prompt(self, content: str, tone: str) -> str:
        return f"""You are a writer. Create a professional email.
Do NOT use any emojis.

Original content: {content}

Tone: {tone}

Create an email that:
- Subject line: Under 50 chars
- Preview text: 90 chars max
- Body: 150-200 words
- Clear call to action text
- P.S. line
- Matches {tone} voice

Format:
Subject: [line]
Preview: [text]

[email body]

CTA: [button text]
P.S. [line]

Output ONLY the email, no explanations."""

    def _reddit_prompt(self, content: str, tone: str) -> str:
        return f"""You are a writer. Convert this into a Reddit post.
Do NOT use any emojis.

Original content: {content}

Tone: {tone}

Create a Reddit post that:
- Has a clear title
- Body is 200-300 words
- Feels authentic and informational
- Includes a TL;DR summary at the end
- Asks a question for community discussion
- Matches {tone} voice

Format:
Title: [post title]

[post body]

TL;DR: [summary]

Output ONLY the post, no explanations."""

    def _generate_dynamic_mock_responses(self, content: str, tone: str, formats: list[str]) -> dict[str, str]:
        lines = [line.strip() for line in content.splitlines() if line.strip()]
        title = lines[0] if lines else "New Platform Update"
        if len(title) > 100:
            title = title[:97] + "..."
            
        paragraphs = lines[1:5] if len(lines) > 1 else lines[:4]
        if not paragraphs:
            paragraphs = ["No content available to repurpose."]
            
        body_text = "\n\n".join(paragraphs)
        
        import re
        # Find words of length > 3 first, then grab the first 4 for tags
        words = [w for w in re.findall(r'[a-zA-Z0-9]+', title) if len(w) > 3]
        hashtags = " ".join(f"#{w.capitalize()}" for w in words[:5])
        if not hashtags:
            hashtags = "#Tech #Innovation #Update"

        results = {}
        for fmt in formats:
            if fmt == "tiktok":
                results["tiktok"] = (
                    f"[Hook] Here is what you need to know about: {title}!\n\n"
                    f"[Main Content] {paragraphs[0] if len(paragraphs) > 0 else ''}\n"
                    f"{paragraphs[1] if len(paragraphs) > 1 else ''}\n\n"
                    f"[CTA] What do you think about this? Drop a comment below!\n\n"
                    f"[Notice: Configure GEMINI_API_KEY in backend/.env for real AI generation]"
                )
            elif fmt == "linkedin":
                results["linkedin"] = (
                    f"Let's talk about {title}.\n\n"
                    f"{paragraphs[0] if len(paragraphs) > 0 else ''}\n\n"
                    f"Key insights:\n"
                    f"• {paragraphs[1][:200] + '...' if len(paragraphs) > 1 else 'Platform evolution'}\n"
                    f"• {paragraphs[2][:200] + '...' if len(paragraphs) > 2 else 'Strategic shift'}\n\n"
                    f"How do you think this will impact the industry? Let's discuss in the comments.\n\n"
                    f"{hashtags}\n\n"
                    f"[Notice: Configure GEMINI_API_KEY in backend/.env for real AI generation]"
                )
            elif fmt == "twitter":
                results["twitter"] = (
                    f"1/ Here's the breakdown on: {title}\n\n"
                    f"2/ {paragraphs[0][:240] + '...' if len(paragraphs) > 0 else ''}\n\n"
                    f"3/ {paragraphs[1][:240] + '...' if len(paragraphs) > 1 else ''}\n\n"
                    f"4/ {paragraphs[2][:240] + '...' if len(paragraphs) > 2 else ''}\n\n"
                    f"5/ What's your take on this? Follow for more updates! {hashtags}\n\n"
                    f"[Notice: Configure GEMINI_API_KEY in backend/.env for real AI]"
                )
            elif fmt == "instagram":
                results["instagram"] = (
                    f"Significant changes are happening: {title}.\n\n"
                    f"{paragraphs[0] if len(paragraphs) > 0 else ''}\n\n"
                    f"{paragraphs[1] if len(paragraphs) > 1 else ''}\n\n"
                    f"What's your favorite part of this update? Let me know in the comments below!\n\n"
                    f"{hashtags}\n\n"
                    f"[Notice: Configure GEMINI_API_KEY in backend/.env for real AI generation]"
                )
            elif fmt == "newsletter":
                results["newsletter"] = (
                    f"Subject: Deep Dive: {title}\n\n"
                    f"Body:\n"
                    f"Hey there,\n\n"
                    f"We're seeing a massive shift: {title}.\n\n"
                    f"Here is a quick summary of the key points:\n\n"
                    f"- {paragraphs[0] if len(paragraphs) > 0 else ''}\n"
                    f"- {paragraphs[1] if len(paragraphs) > 1 else ''}\n"
                    f"- {paragraphs[2] if len(paragraphs) > 2 else ''}\n\n"
                    f"Read more about it in our full digest.\n\n"
                    f"Best,\n"
                    f"The ContentAlchemy Team\n\n"
                    f"[Notice: Configure GEMINI_API_KEY in backend/.env]"
                )
            elif fmt == "youtube":
                results["youtube"] = (
                    f"An in-depth explanation of {title}.\n\n"
                    f"Timestamps:\n"
                    f"0:00 - Introduction to the update\n"
                    f"1:45 - Core changes and structural shifts\n"
                    f"3:30 - Key impacts and future outlook\n\n"
                    f"Key takeaways:\n"
                    f"• {paragraphs[0][:200] + '...' if len(paragraphs) > 0 else ''}\n"
                    f"• {paragraphs[1][:200] + '...' if len(paragraphs) > 1 else ''}\n\n"
                    f"{hashtags}\n\n"
                    f"[Notice: Configure GEMINI_API_KEY in backend/.env]"
                )
            elif fmt == "email":
                results["email"] = (
                    f"Subject: Briefing on {title}\n"
                    f"Preview: Strategic updates and takeaways.\n\n"
                    f"Hey [First Name],\n\n"
                    f"I wanted to share a quick update on: {title}.\n\n"
                    f"{paragraphs[0] if len(paragraphs) > 0 else ''}\n\n"
                    f"Let me know if you would like resources or further discussion on this.\n\n"
                    f"Best regards,\n"
                    f"[Your Name]\n\n"
                    f"[Notice: Configure GEMINI_API_KEY in backend/.env]"
                )
            elif fmt == "reddit":
                results["reddit"] = (
                    f"Title: Thoughts on the latest update: {title}?\n\n"
                    f"Hey everyone,\n\n"
                    f"There is a big shift happening: {title}.\n\n"
                    f"{paragraphs[0] if len(paragraphs) > 0 else ''}\n\n"
                    f"{paragraphs[1] if len(paragraphs) > 1 else ''}\n\n"
                    f"What are your thoughts on this strategy? Do you think it will be successful?\n\n"
                    f"TL;DR: {paragraphs[0][:200]}...\n\n"
                    f"[Notice: Configure GEMINI_API_KEY in backend/.env]"
                )
            else:
                results[fmt] = f"[Mock Mode] Extracted content from URL:\n\n{body_text[:500]}..."
        return results
