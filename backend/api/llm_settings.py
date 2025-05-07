from tempfile import NamedTemporaryFile
from fastapi import Depends, APIRouter, HTTPException, UploadFile, File, Form
from firebase_config import db
from pydantic import BaseModel
from typing import Optional, List
import uuid
import api.auth as auth
import base64
import os
from datetime import datetime
import json
from schemas import LLMSettings, FileUploadRequest, FileUploadResponse

router = APIRouter()

SETTINGS_PATH = "current_settings.json"
SUPPORTED_EXTENSIONS = {
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

# In-memory storage
ref = db.collection("llm_settings").document("wHvoahtMt4uldMXgesMJ")
current_settings = ref.get().to_dict()


# # Data Models
# class LLMSettings(BaseModel):
#     prompt_template: Optional[str] = None
#     model: Optional[str] = None
#     temperature: Optional[float] = None
#     top_k: Optional[int] = None
#     max_token: Optional[int] = None

# class FileUploadRequest(BaseModel):
#     file: str  # base64 encoded content
#     filename: str

# class FileUploadResponse(BaseModel):
#     message: str
#     filename: str

# Helper Functions
def validate_settings(settings: dict):
    """Validate all LLM settings"""
    if settings.get("model") and settings["model"] not in ["gemini-2.0-flash", "gemini-2.0-pro"]:
        raise ValueError("Invalid model. Choose gemini-2.0-flash or gemini-2.0-pro")
    
    if settings.get("temperature") and not 0 <= settings["temperature"] <= 1:
        raise ValueError("Temperature must be between 0 and 1")
    
    if settings.get("top_k") and settings["top_k"] <= 0:
        raise ValueError("top_k must be positive")
    if settings.get("max_token") and settings["max_token"] <= 0:
        raise ValueError("max_token must be positive")

def validate_file(filename: str, content: bytes):
    """Validasi ekstensi dan signature file"""
    # Validasi ekstensi
    ext = os.path.splitext(filename)[1].lower()
    if ext not in SUPPORTED_EXTENSIONS:
        allowed = ', '.join(SUPPORTED_EXTENSIONS.keys())
        raise HTTPException(
            status_code=400,
            detail=f"Hanya format {allowed} yang didukung"
        )
    
    # Validasi signature file (4 byte pertama)
    signatures = {
        b'%PDF': '.pdf',
        b'\xD0\xCF\x11\xE0': '.doc',  # DOC/DOCX legacy
        b'PK\x03\x04': '.docx'        # DOCX (zip format)
    }
    
    file_sig = content[:4]
    for sig, ext_sig in signatures.items():
        if file_sig.startswith(sig):
            if ext != ext_sig and not (ext_sig == '.docx' and ext == '.doc'):
                raise HTTPException(
                    status_code=400,
                    detail=f"Ekstensi {ext} tidak match dengan tipe file aktual"
                )
            return SUPPORTED_EXTENSIONS[ext]
    
    # Untuk file TXT (tidak ada signature khusus)
    if ext == '.txt':
        try:
            content.decode('utf-8')
            return 'text/plain'
        except UnicodeDecodeError:
            raise HTTPException(400, "File teks tidak valid (bukan UTF-8)")
    
    raise HTTPException(400, "Tipe file tidak dikenali")

def save_settings():
    with open(SETTINGS_PATH, "w") as f:
        json.dump(current_settings, f, indent=2)

def load_settings():
    global current_settings
    if os.path.exists(SETTINGS_PATH):
        with open(SETTINGS_PATH, "r") as f:
            current_settings.update(json.load(f))


# Endpoints
@router.get("", response_model=dict)
def get_settings(user=Depends(auth.validate_token)):
    """Get current LLM settings"""
    return {
        "prompt_template": current_settings["prompt_template"],
        "model": current_settings["model"],
        "temperature": current_settings["temperature"],
        "top_k": current_settings["top_k"],
        "max_token": current_settings["max_token"],
    }

@router.put("")
def update_settings(settings: LLMSettings, user=Depends(auth.validate_token)):
    try:
        updates = settings.dict(exclude_none=True)
        validate_settings(updates)

        # Update local settings
        current_settings.update(updates)

        # Simpan ke Firestore
        ref.set(current_settings)

        return {"message": "Settings updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), user=Depends(auth.validate_token)):
    try:
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Read file content
        content = await file.read()
        
        # Validate file
        mime_type = validate_file(file.filename, content)
        
        # Save to temporary file
        with NamedTemporaryFile(delete=False, suffix=file.filename) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Store metadata in memory
        current_settings["uploaded_files"][file_id] = {
            "filename": file.filename,
            "mime_type": mime_type,
            "temp_path": temp_file_path,
            "upload_time": datetime.now().isoformat()
        }
        
        # ✅ Return filename instead of file_id
        return {
            "message": "File uploaded successfully",
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
