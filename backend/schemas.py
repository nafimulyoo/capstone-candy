from datetime import date, datetime
from pydantic import BaseModel, Field, EmailStr
from typing import List, Dict, Optional, Literal

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class AdminInfo(BaseModel):
    id: str
    email: EmailStr
    nama: str

class LoginResponse(BaseModel):
    token: str
    admin: AdminInfo

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

class ChatItem(BaseModel):
    session_id: str
    timestamp: datetime
    name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    satisfaction_rate: float
    userClickToAction: bool
    topic: str

class ChatsListResponse(BaseModel):
    total: int
    page: int
    limit: int
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
    email: Optional[EmailStr]
    phone: Optional[str]

class ChatDetailResponse(BaseModel):
    metadata: ChatMetadata
    messages: List[ChatMessage]