import aiohttp
from bs4 import BeautifulSoup
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)


async def extract_youtube_transcript(url: str) -> str:
    video_id = None
    if "youtu.be/" in url:
        video_id = url.split("youtu.be/")[-1].split("?")[0]
    elif "v=" in url:
        video_id = url.split("v=")[-1].split("&")[0]
    elif "shorts/" in url:
        video_id = url.split("shorts/")[-1].split("?")[0]

    if not video_id:
        raise ValueError("Invalid YouTube URL. Please paste a valid YouTube video link.")

    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Try to get manually created transcript first, then auto-generated
        transcript = None
        try:
            transcript = transcript_list.find_manually_created_transcript(["en", "hi", "es", "fr", "de", "pt", "ja", "ko", "zh"])
        except NoTranscriptFound:
            pass

        if not transcript:
            try:
                transcript = transcript_list.find_generated_transcript(["en", "hi", "es", "fr", "de", "pt", "ja", "ko", "zh"])
            except NoTranscriptFound:
                pass

        # If still nothing, try getting any available transcript and translate to English
        if not transcript:
            for t in transcript_list:
                transcript = t
                break

        if not transcript:
            raise ValueError("No transcript available for this video. Try a video with captions enabled.")

        # If not in English, try translating to English
        if transcript.language_code != "en":
            try:
                transcript = transcript.translate("en")
            except Exception:
                pass  # Use original language if translation fails

        fetched = transcript.fetch()
        text = " ".join(entry["text"] for entry in fetched)

        if len(text) < 50:
            raise ValueError("Transcript is too short. Try a different video.")

        return text

    except TranscriptsDisabled:
        raise ValueError("Transcripts are disabled for this video. The video owner has turned off captions. Try a different video.")
    except VideoUnavailable:
        raise ValueError("This video is unavailable or private. Try a different video.")
    except NoTranscriptFound:
        raise ValueError("No transcript found for this video. Try a video with subtitles/captions enabled.")
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "Too Many Requests" in error_msg:
            raise ValueError("YouTube is rate-limiting requests. Please wait a minute and try again.")
        if "Could not retrieve" in error_msg:
            raise ValueError("Could not retrieve transcript. This video may not have captions. Try pasting the content as text instead.")
        raise ValueError(f"Failed to extract transcript: {error_msg[:150]}")


async def extract_blog_content(url: str) -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as resp:
            if resp.status != 200:
                raise ValueError(f"Failed to fetch URL: status {resp.status}")
            html = await resp.text()

    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "iframe", "noscript"]):
        tag.decompose()

    main_content = None
    articles = soup.find_all("article")
    for art in articles:
        art_text = art.get_text(separator=" ", strip=True)
        if len(art_text) > 800:
            main_content = art
            break

    if not main_content:
        main = soup.find("main")
        if main and len(main.get_text(separator=" ", strip=True)) > 800:
            main_content = main

    if not main_content:
        body_classes = [
            "post-body-content", "post-story-body-content", "article-body", "post-body",
            "entry-content", "article-content", "story-content", "post-content",
            "article-text", "story-text", "main-content", "story-card"
        ]
        for cls in body_classes:
            elem = soup.find(class_=cls)
            if elem and len(elem.get_text(separator=" ", strip=True)) > 500:
                main_content = elem
                break

    if not main_content:
        candidates = []
        for container in soup.find_all(["div", "section", "article"]):
            p_children = container.find_all("p", recursive=False)
            if p_children:
                p_text = " ".join(p.get_text() for p in p_children)
                if len(p_text) > 200:
                    candidates.append((container, len(p_text)))
        if candidates:
            candidates.sort(key=lambda x: x[1], reverse=True)
            main_content = candidates[0][0]

    if not main_content:
        main_content = soup.find("body")

    if not main_content:
        raise ValueError("Could not extract content from URL")

    text_elements = main_content.find_all(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li"])
    if text_elements:
        text = "\n".join(elem.get_text(separator=" ", strip=True) for elem in text_elements if elem.get_text(separator=" ", strip=True))
    else:
        text = main_content.get_text(separator="\n", strip=True)

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    filtered_lines = []
    for line in lines:
        if len(line) < 15 and not any(line.startswith(c) for c in ["-", "*", "1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9."]):
            continue
        filtered_lines.append(line)
    if not filtered_lines:
        filtered_lines = lines

    # Try to find a clean page title/headline and prepend it if not already present
    page_title = ""
    h1_elem = soup.find("h1")
    if h1_elem:
        page_title = h1_elem.get_text(strip=True)
    if not page_title and soup.title:
        page_title = soup.title.get_text(strip=True)
    
    if page_title:
        for suffix in [" - Business Insider", " | Business Insider", " - BI", " | Reuters", " - The New York Times", " | TechCrunch"]:
            if page_title.endswith(suffix):
                page_title = page_title[:-len(suffix)].strip()
                break
        if not filtered_lines or filtered_lines[0].lower() != page_title.lower():
            filtered_lines.insert(0, page_title)

    return "\n".join(filtered_lines[:200])
