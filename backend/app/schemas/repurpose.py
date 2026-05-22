from pydantic import BaseModel, Field


class RepurposeRequest(BaseModel):
    content: str = Field(..., min_length=10, max_length=50000)
    source_type: str = Field(default="text_paste", pattern="^(text_paste|youtube_url|blog_link)$")
    tone: str = Field(default="casual", pattern="^(professional|casual|humorous|educational)$")
    formats: list[str] = Field(..., min_length=1)


class RepurposeResponse(BaseModel):
    success: bool
    generation_id: str
    results: dict[str, str]
    time_ms: int


class GenerationOut(BaseModel):
    id: str
    original_content: str
    content_source: str
    tone: str
    tiktok_script: str | None = None
    linkedin_post: str | None = None
    twitter_thread: str | None = None
    instagram_caption: str | None = None
    newsletter_draft: str | None = None
    youtube_description: str | None = None
    email_subject: str | None = None
    reddit_post: str | None = None
    generation_time_ms: int | None = None
    created_at: str

    class Config:
        from_attributes = True
