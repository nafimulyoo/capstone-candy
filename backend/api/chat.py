from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import List, Optional, Dict
import time
import uuid
from firebase_config import db
from schemas import ChatRequest, ChatResponse, ChatSaveRequest

router = APIRouter()

ref = db.collection("llm_settings").document("wHvoahtMt4uldMXgesMJ")
current_settings = ref.get().to_dict()

# Initialize chatbot with some dummy config
chatbot = DummyChatbot(
    prompt_template= current_settings["prompt_template"],
    model= current_settings["model"],
    temperature=current_settings["temperature"],
    max_tokens=current_settings["max_token"],
    top_k=current_settings["top_k"],
    knowledge_source = "https://drive.google.com/drive/folders/1tAasvudukCy0P1frrz-v7UZIKAe7TSIJ"
)

# def save_chat_to_firestore(metadata, messages):
#     chats_ref = db.collection("chat-session")
#     chat_ref = chats_ref.document()
#     chat_ref.set({
#         "metadata": metadata,
#         "messages": messages,
#         "created_at": datetime.utcnow()  
#     })
#     print(f"Chat saved with ID: {chat_ref.id}")
#     return chat_ref.id

def save_chat_to_firestore(metadata, messages):
    chats_ref = db.collection("chat-session")
    chat_ref = chats_ref.document()

    # Start with required fields
    chat_data = {
        "timestamp": metadata["timestamp"],
        "topic": metadata["topic"],
        "userClickToAction": metadata["userClickToAction"],
        "chat_history": messages
    }

    # Add optional fields only if they are not None or empty
    for key in ["name", "email", "phone"]:
        value = metadata.get(key)
        if value:  # This will exclude None, "", or other falsy values
            chat_data[key] = value

    chat_ref.set(chat_data)
    print(f"Chat saved with ID: {chat_ref.id}")
    return chat_ref.id


@router.post("/ask", response_model=ChatResponse)
def ask_chatbot(request: ChatRequest):
    result = chatbot.generate_response(request.message, request.history)
    return result



@router.post("/save")
def save_chat(request: ChatSaveRequest):
    try:
        metadata = request.metadata.dict()
        # Ganti timestamp dengan waktu saat ini (format ISO 8601)
        # metadata["timestamp"] = datetime.utcnow().isoformat() + "Z"
        metadata["timestamp"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
        messages = [msg.dict() for msg in request.messages]
        chat_id = save_chat_to_firestore(metadata, messages)

        return {"message": "Chat saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
