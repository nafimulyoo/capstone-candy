
from fastapi import Depends, APIRouter, HTTPException
from firebase_config import db
import api.auth as auth
from schemas import LLMSettings

router = APIRouter()

# SETTINGS_PATH = "current_settings.json"

# In-memory storage
# ref = db.collection("llm_settings").document("wHvoahtMt4uldMXgesMJ")
ref = db.collection("llm_settings").document("1uZu27qUE5KxoMRhoQX6")

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


# def save_settings():
#     with open(SETTINGS_PATH, "w") as f:
#         json.dump(current_settings, f, indent=2)

# def load_settings():
#     global current_settings
#     if os.path.exists(SETTINGS_PATH):
#         with open(SETTINGS_PATH, "r") as f:
            # current_settings.update(json.load(f))


# Endpoints
@router.get("", response_model=dict)
def get_settings(user=Depends(auth.validate_token)):
    """Get current LLM settings"""
    current_settings = ref.get().to_dict()
    print("Current settings from Firestore:")
    print(current_settings)

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
        # # Update local settings
        # current_settings.update(updates)

        # Simpan ke Firestore
        ref.set(updates, merge=True)

        return {"message": "Settings updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

