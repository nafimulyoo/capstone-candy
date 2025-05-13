from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal

class LoginRequest(BaseModel):
    email: str
    password: str
    
class AdminInfo(BaseModel):
    id: str
    email: str
    nama: str

class LoginResponse(BaseModel):
    token: str
    # admin: AdminInfo

class SessionItem(BaseModel):
    date: date
    count: int

class SessionsResponse(BaseModel):
    data: List[SessionItem]

class SatisfactionItem(BaseModel):
    date: date
    rate: float
    positive: int
    negative: int

class SatisfactionResponse(BaseModel):
    data: List[SatisfactionItem]

class ResponseTimeItem(BaseModel):
    date: date
    average_time: float

class ResponseTimesResponse(BaseModel):
    data: List[ResponseTimeItem]

class TopicsResponse(BaseModel):
    topics: Dict[str, int]

class SummaryResponse(BaseModel):
    total_sessions: int
    sessions_change: float
    total_cta: int
    cta_change: float
    total_leads: int
    leads_change: float
    avg_satisfaction: float
    satisfaction_change: float

class ErrorResponse(BaseModel):
    error: Dict[str, str]

class LLMSettings(BaseModel):
    prompt_template: Optional[str] = None
    model: Optional[str] = None
    temperature: Optional[float] = None
    top_k: Optional[int] = None
    max_token: Optional[int] = None

class FileUploadRequest(BaseModel):
    file: str  # base64 encoded content
    filename: str

class FileUploadResponse(BaseModel):
    message: str
    filename: str

class ChatItem(BaseModel):
    session_id: str
    timestamp: datetime
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    satisfaction_rate: float
    userClickToAction: bool
    topic: str

class ChatsListResponse(BaseModel):
    total: int
    # page: int
    # limit: int
    data: List[ChatItem]

class ChatMessage(BaseModel):
    role: str
    message: str
    timestamp: datetime
    link_to_contact: Optional[bool] = None
    feedback: Optional[str] = None
    response_time: Optional[float] = None

class ChatMetadata(BaseModel):
    timestamp: datetime
    topic: str
    userClickToAction: bool
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]

class ChatDetailResponse(BaseModel):
    metadata: ChatMetadata
    messages: List[ChatMessage]

class HistoryItem(BaseModel):
    role: str
    message: str
    timestamp: str

class ChatRequest(BaseModel):
    name: str
    message: str
    history: List[HistoryItem]

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    link_to_contact: bool
    response_time: float

# Definisikan request dan response schema
class Metadata(BaseModel):
    # timestamp: str
    topic: str
    userClickToAction: bool
    name : Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class Message(BaseModel):
    role: str
    message: str
    timestamp: str
    link_to_contact: Optional[bool] = None
    feedback: Optional[str] = None
    response_time: float = None

class ChatSaveRequest(BaseModel):
    session_id: str
    metadata: Metadata
    messages: List[Message]