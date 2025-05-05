# **🍬 CANDY - API Specification**

Last updated: 05-02-2025, 13.00 


## Authentication
All endpoints (except login) require `Authorization: Bearer <token>`

---

## 1. Admin Authentication API

### POST /auth/login
**Request:**
```json
{
  "email": "admin@company.com",
  "password": "yourpassword"
}
```

**Response (Success):**
```json
{
  "token": "jwt.token.here",
  "admin": {
    "id": "admin_001_unique_id",
    "email": "admin@company.com",
    "nama": "Admin Utama"
  }
}
```

---

## 2. Admin Analytics API

### GET /analytics/sessions?range=daily|monthly|yearly&start=YYYY-MM-DD&end=YYYY-MM-DD
**Response:**
```json
{
  "data": [
    { "date": "2023-11-01", "count": 45 },
    { "date": "2023-11-02", "count": 52 }
  ]
}
```

### GET /analytics/satisfaction?range=daily|monthly|yearly&start=YYYY-MM-DD&end=YYYY-MM-DD
**Response:**
```json
{
  "data": [
    { 
      "date": "2023-11-01", 
      "rate": 0.85,
      "positive": 17,
      "negative": 3 
    }
  ]
}
```

### GET /analytics/response-times?range=daily|monthly|yearly&start=YYYY-MM-DD&end=YYYY-MM-DD
**Response:**
```json
{
  "data": [
    { "date": "2023-11-01", "average_time": 4 },
    { "date": "2023-11-02", "average_time": 5 }
  ]
}
```

### GET /analytics/topics?range=daily|monthly|yearly&start=YYYY-MM-DD&end=YYYY-MM-DD
**Response:**
```json
{
  "topics": {
    "Data Intelligence": 42,
    "Product Inquiry": 35,
    "Technical Support": 28
  }
}
```

### GET /analytics/cta-clicks?range=daily|monthly|yearly&start=YYYY-MM-DD&end=YYYY-MM-DD
**Response:**
Same format as `/analytics/sessions`

### GET /analytics/summary?range=daily|monthly|yearly&start=YYYY-MM-DD&end=YYYY-MM-DD
**Response:**
```json
{
  "total_sessions": 1245,
  "sessions_change": 0.12,
  "total_cta": 342,
  "cta_change": -0.05, 
  "avg_satisfaction": 0.82,
  "satisfaction_change": 0.03,
  "total_messages": 5689,
  "messages_change": 0.18
}
```
---
## 3. Admin Chat History API

### GET /chats?page=1&limit=20&sort=time|satisfaction&order=asc|desc&start=YYYY-MM-DD&end=YYYY-MM-DD&contactOnly=true&ctaOnly=true
**Response:**
```json
{
  "total": 1245,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "session_id": "session_001_unique_id",
      "timestamp": "2023-11-15T10:15:00Z",
      "name": "Budi",
      "email": "budi@mail.com",
      "phone": "+628123456789",
      "satisfaction_rate": 1.0, 
      "userClickToAction": false,
      "topic": "Data Intelligence"
    }
  ]
}
```

### GET /chats/{session_id}
**Response:**
```json
{
  "metadata": {
    "timestamp": "2023-11-15T10:15:00Z",
    "topic": "Data Intelligence",
    "userClickToAction": false,
    "name": "Budi",
    "email": "budi@mail.com",
    "phone": "+628123456789"
  },
  "messages": [
    {
      "role": "user",
      "message": "Halo bot",
      "timestamp": "2023-11-15T10:15:30Z",
    },
    {
      "role": "bot",
      "message": "Halo! Ada yang bisa saya bantu?",
      "timestamp": "2023-11-15T10:15:35Z",
      "link_to_contact": true,
      "feedback": "positive",
      "response_time": 1.2 
    }
  ]
}
```

### POST /chats
**Request:**
```json
{
  "metadata": {
    "timestamp": "2023-11-15T10:15:00Z",
    "topic": "Data Intelligence",
    "userClickToAction": false,
    "name": "Budi",
    "email": "budi@mail.com",
    "phone": "+628123456789"
  },
  "messages": [
    {
      "role": "user",
      "message": "Halo bot",
      "timestamp": "2023-11-15T10:15:30Z",
    },
    {
      "role": "bot",
      "message": "Halo! Ada yang bisa saya bantu?",
      "timestamp": "2023-11-15T10:15:35Z",
      "link_to_contact": true,
      "feedback": "positive",
      "response_time": 1.2 
    }
  ]
}
```

**Response:**
```json
{
  "message": "Chat session created successfully",
  "session_id": "session_001_unique_id"
}
```
---

## 4. Admin LLM Settings API

### GET /llm-settings
**Response:**
```json
{
  "prompt_template": "Anda adalah asisten AI...",
  "model": "gemini-2.0-flash",
  "temperature": 0.4,
  "top_k": 50,
  "max_token": 2000,
  "files": ["file_001.pdf", "file_002.docx", "file_003.txt"],
}
```

### PUT /llm-settings
**Request:**
```json
{
  "prompt_template": "Updated template...",
  "model": "gemini-2.0-pro",
  "temperature": 0.5,
  "top_k": 40,
  "max_token": 1500,
}
```

**Response:**
```json
{
  "message": "Settings updated successfully"
}
```

### POST /llm-settings/file
**Request:**
```json
{
  "file": "base64_encoded_file_content",
  "filename": "knowledge_base.pdf"
}
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file_name": "knowledge_base.pdf"
}
```

### DELETE /llm-settings/file/{file_name}
**Response:**
```json
{
  "message": "File deleted successfully",
  "file_name": "knowledge_base.pdf"
}
```

---
## 5. Chatbot API
### POST /chat/ask
**Request:**
```json
{
  "message": "Halo bot, apa itu Data Intelligence?",
  "history": [
    {
      "role": "user",
      "message": "Halo bot",
      "timestamp": "2023-11-15T10:15:30Z"
    }
    {
      "role": "bot",
      "message": "Halo! Ada yang bisa saya bantu?",
      "timestamp": "2023-11-15T10:15:35Z"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Data Intelligence adalah...",
  "timestamp": "2023-11-15T10:15:35Z",
  "link_to_contact": false,
  "response_time": 1.2
}
```

### POST /chat/save
**Request:**
```json
{
  "metadata": {
    "timestamp": "2023-11-15T10:15:00Z",
    "topic": "Data Intelligence",
    "userClickToAction": false,
    "name": "Budi",
    "email": "budi@mail.com",
    "phone": "+628123456789"
  },
  "messages": [
    {
      "role": "user",
      "message": "Halo bot",
      "timestamp": "2023-11-15T10:15:30Z",
    },
    {
      "role": "bot",
      "message": "Halo! Ada yang bisa saya bantu?",
      "timestamp": "2023-11-15T10:15:35Z",
      "link_to_contact": true,
      "feedback": "positive",
      "response_time": 1.2 
    },
  ]
}
```
---
## Error Responses
All endpoints return consistent error formats:

```json
{
  "error": {
    "code": "ERR_CODE",
    "message": "Human readable message"
  }
}

```

### Common Error Codes:
- `401 Unauthorized` - Invalid/missing token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Validation Error` - Invalid request data
