import logging
import api.auth as auth
import api.analytics as analytics
from firebase_config import db
from typing import Optional, List
from datetime import datetime, date, timedelta
from fastapi import APIRouter, Depends, Query, HTTPException
from schemas import ChatItem, ChatsListResponse, ChatMessage, ChatMetadata, ChatDetailResponse, ErrorResponse

router = APIRouter()
logger = logging.getLogger(__name__)

def list_chats(
    # page: int,
    # limit: int,
    sort: str,
    order: str,
    start: Optional[date],
    end: Optional[date],
    contactOnly: bool,
    ctaOnly: bool,
) -> ChatsListResponse:
    try:
        sessions = analytics._load_sessions()
        items: List[ChatItem] = []

        for s in sessions:
            try:
                ts = datetime.fromisoformat(s['timestamp'].replace('Z', '+00:00'))
                if start and ts.date() < start:
                    continue
                if end and ts.date() > end:
                    continue
                if contactOnly and not s.get('name'):
                    continue
                if ctaOnly and not s.get('userClickToAction', False):
                    continue

                pos = neg = 0
                for msg in s.get('chat_history', []):
                    if msg.get('role') == 'bot' and 'feedback' in msg:
                        if msg['feedback'] == 'positive':
                            pos += 1
                        elif msg['feedback'] == 'negative':
                            neg += 1
                total = pos + neg
                rate = (pos / total) if total > 0 else 0.0

                items.append(ChatItem(
                    session_id=s['session_id'],
                    timestamp=ts,
                    name=s.get('name'),
                    email=s.get('email'),
                    phone=s.get('phone'),
                    satisfaction_rate=round(rate, 2),
                    userClickToAction=s.get('userClickToAction', False),
                    topic=s.get('topic', 'Unknown')
                ))
            except Exception as e:
                logger.error("Error processing session %s: %s", s['session_id'], str(e))
                continue

        reverse = (order == 'desc')
        if sort == 'time':
            items.sort(key=lambda x: x.timestamp, reverse=reverse)

        elif sort == 'name':
            items = [item for item in items if item.name]
            items.sort(key=lambda x: x.name.lower(), reverse=reverse)

        elif sort == 'topic':
            items = [item for item in items if item.topic]
            items.sort(key=lambda x: x.topic.lower(), reverse=reverse)

        # paginate
        total = len(items)
        # start_idx = (page - 1) * limit
        # end_idx = start_idx + limit
        # page_items = items[start_idx:end_idx]

        return ChatsListResponse(
            total=total,
            # page=page,
            # limit=limit,
            data=items
        )
    except Exception as e:
        logger.error("Could not list chats: %s", str(e))
        raise HTTPException(
            status_code=422,
            detail={'error': {'code': 'ERR_VALIDATION', 'message': 'Failed to list chats'}}
        )
    
def get_chat_detail(
    session_id: str,
) -> ChatDetailResponse:
    try:
        session = next((s for s in analytics._load_sessions() if s['session_id'] == session_id), None)
        if not session:
            raise HTTPException(
                status_code=404,
                detail={'error': {'code': 'ERR_NOT_FOUND', 'message': 'Session not found'}}
            )

        ts = datetime.fromisoformat(session['timestamp'].replace('Z', '+00:00'))
        metadata = ChatMetadata(
            timestamp=ts,
            topic=session.get('topic', 'Unknown'),
            userClickToAction=session.get('userClickToAction', False),
            name=session.get('name'),
            email=session.get('email'),
            phone=session.get('phone')
        )

        messages: List[ChatMessage] = []
        for msg in session.get('chat_history', []):
            messages.append(ChatMessage(
                role=msg.get('role'),
                message=msg.get('content') or msg.get('message'),
                timestamp=datetime.fromisoformat(msg['timestamp'].replace('Z', '+00:00')),
                link_to_contact=msg.get('link_to_contact'),
                feedback=msg.get('feedback'),
                response_time=msg.get('response_time')
            ))

        return ChatDetailResponse(metadata=metadata, messages=messages)
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Could not get chat detail: %s", str(e))
        raise HTTPException(
            status_code=422,
            detail={'error': {'code': 'ERR_VALIDATION', 'message': 'Failed to get chat detail'}}
        )

@router.get(
    "",
    response_model=ChatsListResponse,
    responses={401: {'model': ErrorResponse}, 422: {'model': ErrorResponse}},
    dependencies=[Depends(auth.validate_token)]
)
def list_chats_api(
    # page: int = Query(1, ge=1),
    # limit: int = Query(20, ge=1),
    sort: str = Query('time'),
    order: str = Query('desc', regex='^(asc|desc)$'),
    start: Optional[date] = Query(None),
    end: Optional[date] = Query(None),
    contactOnly: bool = Query(False),
    ctaOnly: bool = Query(False),
):
    # return list_chats(page, limit, sort, order, start, end, contactOnly, ctaOnly)
    return list_chats(sort, order, start, end, contactOnly, ctaOnly)

@router.get(
    "/{session_id}",
    response_model=ChatDetailResponse,
    responses={401: {'model': ErrorResponse}, 404: {'model': ErrorResponse}, 422: {'model': ErrorResponse}},
    dependencies=[Depends(auth.validate_token)]
)
def get_chat_detail_api(
    session_id: str,
) -> ChatDetailResponse:
    return get_chat_detail(session_id)