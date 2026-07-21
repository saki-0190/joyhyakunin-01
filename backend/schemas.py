from pydantic import BaseModel
from datetime import datetime

class PostCreate(BaseModel):
    poem_text: str
    theme: str
    image_url: str

class Post(BaseModel):
    post_id: int
    user_id: int
    poem_text: str
    theme: str
    image_url: str
    likes_count: int
    created_at: datetime

    class Config:
        orm_mode = True

class Like(BaseModel):
    like_id: int
    post_id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
