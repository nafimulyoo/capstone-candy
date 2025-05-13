from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from typing import List, Optional, Dict
import time
from firebase_config import db
from schemas import ChatRequest, ChatResponse, ChatSaveRequest
from model.model import CANDY

router = APIRouter()

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


def save_chat_to_firestore(session_id, metadata, messages):
    chats_ref = db.collection("chat-session")
    # create a new document with the session_id if it doesn't exist
    chat_ref = chats_ref.document(session_id)

    # Start with required fields
    chat_data = {
        "timestamp": metadata["timestamp"],
        "topic": metadata["topic"],
        "userClickToAction": metadata["userClickToAction"],
        "chat_history": messages
    }

    # Add optional fields only if they are not None or empty
    for key in ["name", "email", "phone"]:
        try:
            value = metadata.get(key)
            if value:  # This will exclude None, "", or other falsy values
                chat_data[key] = value
        except:
            pass

    chat_ref.set(chat_data)
    print(f"Chat saved with ID: {chat_ref.id}")
    return chat_ref.id

candy = CANDY()
@router.post("/ask", response_model=ChatResponse)
def ask_chatbot(request: ChatRequest):

    result = candy.generate_response(request.name, request.message, request.history)
    # print("Result:", result)
    return ChatResponse(
        response=result["message"],
        link_to_contact=result["link_to_contact"],
        response_time=result["response_time"],
        timestamp=datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    )

@router.post("/save")
def save_chat(request: ChatSaveRequest):
    try:
        metadata = request.metadata.dict()
        session_id = request.session_id
        # Ganti timestamp dengan waktu saat ini (format ISO 8601)
        # metadata["timestamp"] = datetime.utcnow().isoformat() + "Z"
        metadata["timestamp"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
        messages = []
        for message in request.messages:
            message_dict = message.dict()
            messages.append(message_dict)

        if len(messages) <= 1:
            return {"message": "Only one or zero message to save, not saving."}

        print("Messages:", messages)
        chat_id = save_chat_to_firestore(session_id, metadata, messages)

        return {"message": "Chat saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
