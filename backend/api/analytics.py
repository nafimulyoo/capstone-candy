import logging
import api.auth as auth
from datetime import date
from typing import Literal
from fastapi import APIRouter
from firebase_config import db
from datetime import datetime, timedelta
from collections import Counter, defaultdict
from schemas import SessionsResponse, ErrorResponse, SatisfactionResponse, ResponseTimesResponse, TopicsResponse, SummaryResponse
from fastapi import Depends, HTTPException, Query, APIRouter

router = APIRouter()
logger = logging.getLogger(__name__)

_session_cache = None                  
_session_cache_timestamp = None 
CACHE_DURATION = timedelta(minutes=10)

def _load_sessions():
    """Load chat sessions from Firestore."""
    global _session_cache, _session_cache_timestamp
    now = datetime.now()
    
    if _session_cache is None or _session_cache_timestamp is None or now - _session_cache_timestamp > CACHE_DURATION:
        docs = db.collection('chat-session').stream()
        _session_cache = [doc.to_dict() for doc in docs]
        _session_cache_timestamp = now
    
    return _session_cache

def _parse_date(ts: str) -> datetime.date:
    """Parse ISO timestamp string to date object."""
    return datetime.fromisoformat(ts.replace('Z', '+00:00')).date()


def _generate_date_bins(range_type: str, start, end):
    """Generate list of date keys between start and end based on range_type."""
    bins = []
    current = start
    if range_type == 'daily':
        while current <= end:
            bins.append(current)
            current += timedelta(days=1)
    elif range_type == 'monthly':
        while current <= end:
            bins.append(current.replace(day=1))
            year = current.year + (current.month // 12)
            month = current.month % 12 + 1
            current = current.replace(year=year, month=month, day=1)
    elif range_type == 'yearly':
        while current <= end:
            bins.append(current.replace(month=1, day=1))
            current = current.replace(year=current.year + 1, month=1, day=1)
    return bins


def get_sessions(range_type: str, start_date, end_date):
    try:
        sessions = _load_sessions()
        start, end = start_date, end_date
        counts = Counter()
        for s in sessions:
            dt = _parse_date(s['timestamp'])
            if start <= dt <= end:
                key = dt if range_type == 'daily' else (
                    dt.replace(day=1) if range_type == 'monthly' else dt.replace(month=1, day=1)
                )
                counts[key] += 1
        bins = _generate_date_bins(range_type, start, end)
        data = [{
            'date': b.isoformat(),
            'count': counts.get(b, 0)
        } for b in bins]
        return data
    except Exception as e:
        logger.error("Could not process data: %s", str(e))
        raise HTTPException(
            status_code=422,
            detail={'error': {'code': 'ERR_VALIDATION', 'message': 'Failed to get sessions'}}
        )
    
def get_leads(range_type: str, start_date, end_date):
    try:
        """Return list of {date, count} for chat sessions within range."""
        sessions = _load_sessions()
        start, end = start_date, end_date
        counts = Counter()
        for s in sessions:
            dt = _parse_date(s['timestamp'])
            if start <= dt <= end:
                key = dt if range_type == 'daily' else (
                    dt.replace(day=1) if range_type == 'monthly' else dt.replace(month=1, day=1)
                )
                name = s.get('name', '').strip()
                if name:
                    counts[key] += 1
        bins = _generate_date_bins(range_type, start, end)
        data = [{
            'date': b.isoformat(),
            'count': counts.get(b, 0)
        } for b in bins]
        return data
    except Exception as e:
        logger.error("Could not process data: %s", str(e))
        raise HTTPException(
            status_code=422,
            detail={'error': {'code': 'ERR_VALIDATION', 'message': 'Failed to get leads'}}
        )

def get_satisfaction(range_type: str, start_date, end_date):
    try:
        """Return satisfaction metrics: rate, positive, negative by period."""
        sessions = _load_sessions()
        stats = defaultdict(lambda: {'pos': 0, 'neg': 0, 'total': 0})
        for s in sessions:
            session_date = _parse_date(s['timestamp'])
            if start_date <= session_date <= end_date:
                key_date = session_date if range_type == 'daily' else (
                    session_date.replace(day=1) if range_type == 'monthly' else session_date.replace(month=1, day=1)
                )
                for msg in s.get('chat_history', []):
                    if msg.get('role') == 'bot' and 'feedback' in msg:
                        if msg['feedback'] == 'positive':
                            stats[key_date]['pos'] += 1
                            stats[key_date]['total'] += 1
                        elif msg['feedback'] == 'negative':
                            stats[key_date]['neg'] += 1
                            stats[key_date]['total'] += 1
        bins = _generate_date_bins(range_type, start_date, end_date)
        result = []
        for b in bins:
            values = stats.get(b, {'pos': 0, 'neg': 0, 'total': 0})
            total = values['total']
            rate = (values['pos'] / total) if total > 0 else 0.0
            result.append({
                'date': b.isoformat(),
                'rate': round(rate, 2),
                'positive': values['pos'],
                'negative': values['neg'],
            })
        return result
    except Exception as e:
        logger.error("Could not process data: %s", str(e))
        raise HTTPException(
            status_code=422,
            detail={'error': {'code': 'ERR_VALIDATION', 'message': 'Failed to get satisfaction'}}
        )
    
def get_response_times(range_type: str, start_date=None, end_date=None):
    try:
        """Return average bot response times by period."""
        sessions = _load_sessions()
        stats = defaultdict(lambda: {'sum': 0.0, 'count': 0})
        for s in sessions:
            for msg in s.get('chat_history', []):
                if msg.get('role') == 'bot' and 'response_time' in msg:
                    ts = _parse_date(msg['timestamp'])
                    if start_date and end_date:
                        if not (start_date <= ts <= end_date):
                            continue
                    key_date = ts if range_type == 'daily' else (
                        ts.replace(day=1) if range_type == 'monthly' else ts.replace(month=1, day=1)
                    )
                    stats[key_date]['sum'] += msg['response_time']
                    stats[key_date]['count'] += 1
        bins = _generate_date_bins(range_type, start_date or min(stats), end_date or max(stats))
        result = []
        for b in bins:
            rec = stats.get(b, {'sum': 0.0, 'count': 0})
            avg = (rec['sum'] / rec['count']) if rec['count'] > 0 else 0.0
            result.append({'date': b.isoformat(), 'average_time': round(avg, 2)})
        return result
    except Exception as e:
        logger.error("Could not process data: %s", str(e))
        raise HTTPException(
            status_code=422,
            detail={'error': {'code': 'ERR_VALIDATION', 'message': 'Failed to get response times'}}
        )
    
def get_topics(start_date=None, end_date=None):
    try:
        """Aggregate topic counts within a date range."""
        sessions = _load_sessions()
        topics = Counter()
        
        # Filter sessions based on the date range
        for s in sessions:
            session_date = _parse_date(s['timestamp'])
            if start_date <= session_date <= end_date:
                topics[s.get('topic', 'Unknown')] += 1
        
        return dict(topics)
    except Exception as e:
        logger.error("Could not process data: %s", str(e))
        raise HTTPException(
            status_code=422,
            detail={'error': {'code': 'ERR_VALIDATION', 'message': 'Failed to get topics'}}
        )
    
def get_cta_clicks(range_type: str, start_date=None, end_date=None):
    try:
        """Return count of sessions where userClickToAction=True by period."""
        sessions = _load_sessions()
        counts = Counter()
        for s in sessions:
            ts = _parse_date(s['timestamp'])
            if start_date and end_date:
                if not (start_date <= ts <= end_date):
                    continue
            if s.get('userClickToAction'):
                key_date = ts if range_type == 'daily' else (
                    ts.replace(day=1) if range_type == 'monthly' else ts.replace(month=1, day=1)
                )
                counts[key_date] += 1
        bins = _generate_date_bins(range_type, start_date or min(counts), end_date or max(counts))
        data = [{'date': b.isoformat(), 'count': counts.get(b, 0)} for b in bins]
        return data
    except Exception as e:
        logger.error("Could not process data: %s", str(e))
        raise HTTPException(
            status_code=422,
            detail={'error': {'code': 'ERR_VALIDATION', 'message': 'Failed to get CTA clicks'}}
        )
    
def get_summary(range_type: str, start_date, end_date):
    try:
        """Compute summary metrics and growth rates over given period."""
        # current period
        sess_data = get_sessions(range_type, start_date, end_date)
        lead_data = get_leads(range_type, start_date, end_date)
        cta_data = get_cta_clicks(range_type, start_date, end_date)
        sat_data = get_satisfaction(range_type, start_date, end_date)
        # flatten totals
        total_sessions = sum(item['count'] for item in sess_data)
        total_leads = sum(item['count'] for item in lead_data)
        total_cta = sum(item['count'] for item in cta_data)
        avg_satisfaction = round(sum(item['positive'] for item in sat_data) / (sum(item['positive'] for item in sat_data)+sum(item['negative'] for item in sat_data)) if sat_data else 0.0, 2)

        # previous period calc: shift dates back
        curr_start = datetime.now().date()
        curr_end = curr_start-timedelta(days=30)

        prev_start = curr_end-timedelta(days=1) 
        prev_end = prev_start-timedelta(days=30)

        curr_total_sessions = sum(item['count'] for item in get_sessions('monthly', curr_start, curr_end))
        curr_total_leads = sum(item['count'] for item in get_leads('monthly', curr_start, curr_end))
        curr_total_cta = sum(item['count'] for item in get_cta_clicks('monthly', curr_start, curr_end))
        curr_sat_data = get_satisfaction('monthly', curr_start, curr_end)
        curr_avg_satisfaction  = round(sum(item['positive'] for item in curr_sat_data) / (sum(item['positive'] for item in curr_sat_data)+sum(item['negative'] for item in curr_sat_data)) if curr_sat_data else 0.0, 2)

        prev_total_sessions = sum(item['count'] for item in get_sessions('monthly', prev_start, prev_end))
        prev_total_leads = sum(item['count'] for item in get_leads('monthly', prev_start, prev_end))
        prev_total_cta = sum(item['count'] for item in get_cta_clicks('monthly', prev_start, prev_end))
        prev_sat_data = get_satisfaction('monthly', prev_start, prev_end)
        prev_avg_satisfaction  = round(sum(item['positive'] for item in prev_sat_data) / (sum(item['positive'] for item in prev_sat_data)+sum(item['negative'] for item in prev_sat_data)) if prev_sat_data else 0.0, 2)

        def pct_change(current, previous):
            if previous > 0:
                return round((current - previous) / previous, 2)
            return 1.0
        
        return {
            'total_sessions': total_sessions,
            'sessions_change': pct_change(curr_total_sessions, prev_total_sessions),
            'total_cta': total_cta,
            'cta_change': pct_change(curr_total_cta, prev_total_cta),
            'total_leads': total_leads,
            'leads_change': pct_change(curr_total_leads, prev_total_leads),
            'avg_satisfaction': avg_satisfaction,
            'satisfaction_change': pct_change(curr_avg_satisfaction, prev_avg_satisfaction)
        }
    except Exception as e:
        logger.error("Could not process data: %s", str(e))
        raise HTTPException(
            status_code=422,
            detail={'error': {'code': 'ERR_VALIDATION', 'message': 'Failed to get summary'}}
        )

@router.get("/sessions", response_model=SessionsResponse, responses={401: {'model': ErrorResponse}, 422: {'model': ErrorResponse}}, tags=["Analytics"])
def get_sessions_api(
    range: Literal['daily', 'monthly', 'yearly'] = Query(...),
    start: date = Query(...),
    end: date = Query(...),
    user=Depends(auth.validate_token)
):
    return {"data": get_sessions(range, start, end)}

@router.get("/satisfaction", response_model=SatisfactionResponse, responses={401: {'model': ErrorResponse}, 422: {'model': ErrorResponse}})
def get_satisfaction_api(
    range: Literal['daily', 'monthly', 'yearly'] = Query(...),
    start: date = Query(...),
    end: date = Query(...),
    user=Depends(auth.validate_token)
):
    return {"data": get_satisfaction(range, start, end)}

@router.get("/response-times", response_model=ResponseTimesResponse, responses={401: {'model': ErrorResponse}, 422: {'model': ErrorResponse}})
def get_response_times_api(
    range: Literal['daily', 'monthly', 'yearly'] = Query(...),
    start: date = Query(...),
    end: date = Query(...),
    user=Depends(auth.validate_token)
):
    return {"data": get_response_times(range, start, end)}

@router.get("/topics", response_model=TopicsResponse, responses={401: {'model': ErrorResponse}, 422: {'model': ErrorResponse}})
def get_topics_api(
    start: date = Query(...),
    end: date = Query(...),
    user=Depends(auth.validate_token)
):
    return {"topics": get_topics(start, end)}

@router.get("/cta-clicks", response_model=SessionsResponse, responses={401: {'model': ErrorResponse}, 422: {'model': ErrorResponse}})
def get_cta_clicks_api(
    range: Literal['daily', 'monthly', 'yearly'] = Query(...),
    start: date = Query(...),
    end: date = Query(...),
    user=Depends(auth.validate_token)
):
    return {"data": get_cta_clicks(range, start, end)}

@router.get("/summary", response_model=SummaryResponse, responses={401: {'model': ErrorResponse}, 422: {'model': ErrorResponse}})
def get_summary_api(
    range: Literal['daily', 'monthly', 'yearly'] = Query(...),
    start: date = Query(...),
    end: date = Query(...),
    user=Depends(auth.validate_token)
):
    summary = get_summary(range, start, end)
    return summary