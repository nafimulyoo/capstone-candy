import os
import logging
import requests
from pydantic import EmailStr
from dotenv import load_dotenv
from firebase_config import db
from fastapi import APIRouter, HTTPException, Depends
from schemas import LoginRequest, LoginResponse 
from firebase_admin import auth as firebase_auth
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter()
logger = logging.getLogger(__name__)

load_dotenv()
API_KEY = os.getenv("FIREBASE_API_KEY")

security = HTTPBearer()

def validate_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    id_token = credentials.credentials
    try:
        decoded = firebase_auth.verify_id_token(id_token)
    except Exception as e:
        logger.error("Token validation failed: %s", str(e))
        raise HTTPException(status_code=401, detail={
            "error": {"code": "ERR_UNAUTHORIZED", "message": "Invalid or expired token"}
        })
    return decoded


def login(email: EmailStr, password: str):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    resp = requests.post(url, json=payload)
    if resp.status_code != 200:
        logger.error("Login failed for email %s: Invalid email or password", email)
        raise HTTPException(
            status_code=401,
            detail={"error": {"code": 'ERR_UNAUTHORIZED', "message": "Invalid email or password"}}
        )
    
    body = resp.json()
    id_token = body["idToken"]

    doc = db.collection("admins").document(body["localId"]).get()
    if not doc.exists:
        logger.error("Admin profile not found for localId %s", body["localId"])
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": 'ERR_NOT_FOUND', "message": "Admin profile not found"}}
        )
    
    prof = doc.to_dict()

    return {
        "token": id_token,
        "admin": {
            "id": prof["id"],
            "email": prof["email"],
            "nama": prof["nama"]
        }
    }

@router.post("/login", response_model=LoginResponse, tags=["Auth"])
def handle_login(payload: LoginRequest):
    return login(payload.email, payload.password)