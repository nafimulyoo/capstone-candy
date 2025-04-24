
# Database Architecture Documentation

## Overview
This document describes the Firestore database structure for the CANDY AI Assistant admin system, including collections, data models, and example records.

## Database Structure
The database is structured into several collections, each serving a specific purpose. The main collections are:
<!-- import image from image/data_architecture/png -->
![Database Structure](/documentation/diagram/data_architecture.svg)

## Collections

### 1. Admins Collection
**Purpose**: Stores system administrator accounts

**Structure**:
```typescript
interface Admin {
  id: string;          // Unique ID (e.g. "admin_001")
  email: string;       // Login email
  nama: string;        // Display name
  password: string;    // Hashed password
}
```

**Example Document**:
```json
{
  "admins": {
    "admin_001": {
      "email": "admin@company.com",
      "nama": "Main Administrator",
      "password": "$2a$10$N9qo8uLOickgx2ZMRZoMy..."
    }
  }
}
```

### 2. Chat Sessions Collection
**Purpose**: Records all user conversation sessions

**Structure**:
```typescript
interface ChatSession {
  id: string;                 // Session ID
  timestamp: string;          // ISO start time
  topic: string;              // Conversation topic
  userClickToAction: boolean; // CTA interaction
  name?: string;              // Optional user info
  email?: string;
  phone?: string;
  chat_history: ChatMessage[]; // Message array
}

interface ChatMessage {
  role: 'user'|'bot';         // Sender type
  message: string;            // Content text
  timestamp: string;          // ISO time
  link_to_contact?: boolean;  // CTA available
  feedback?: 'positive'|'neutral'|'negative';
  response_time?: number;     // Bot response delay (seconds)
}
```

**Example Document**:
```json
{
  "chat_sessions": {
    "session_001": {
      "timestamp": "2023-11-15T10:15:00Z",
      "topic": "Account Help",
      "userClickToAction": true,
      "email": "user@example.com",
      "chat_history": [
        {
          "role": "user",
          "message": "How do I reset my password?",
          "timestamp": "2023-11-15T10:15:12Z"
        },
        {
          "role": "bot",
          "message": "I can help with that...",
          "timestamp": "2023-11-15T10:15:15Z",
          "response_time": 3.2,
          "link_to_contact": true
        }
      ]
    }
  }
}
```

### 3. LLM Settings
**Purpose**: Stores AI model configuration

**Structure**:
```typescript
interface LLMSettings {
  prompt_template: string;  // System prompt
  model: string;           // Model identifier
  temperature: number;     // 0-1 creativity
  top_k: number;           // Sampling parameter
  google_drive_link: string; // Knowledge source
}
```

**Example Document**:
```json
{
  "llm_settings": {
    "prompt_template": "You are CANDY, a helpful AI...",
    "model": "gemini-2.0-flash",
    "temperature": 0.4,
    "top_k": 50,
    "google_drive_link": "https://drive.google.com/..."
  }
}
```

## Key Relationships
1. **One-to-Many**:
   - FirestoreDatabase to Admins (1:N)
   - FirestoreDatabase to ChatSessions (1:N)
   - ChatSession to ChatMessages (1:N)

2. **Singleton**:
   - FirestoreDatabase to LLMSettings (1:1)
