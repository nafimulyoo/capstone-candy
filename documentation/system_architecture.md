# **CANDY - Software Architecture Documentation**

## **1. System Overview**
The CANDY AI Assistant is a chatbot application with an admin dashboard. It consists of:
- **Frontend**: Next.js (React) for UI
- **Backend**: FastAPI for RESTful API
- **Chatbot**: Google Vertex AI for conversational AI
- **Database**: Firebase Firestore for data storage
- **Storage**: Google Cloud Storage for chatbot knowledge base
- **Authentication**: Firebase Auth for admin login

---

## **2. Architecture Diagram**
![image](/documentation/diagram/system_architecture.svg)

---

## **3. Component Breakdown**

### **3.1 Frontend (Next.js)**
#### **Pages**
| Page | Description |
|------|-------------|
| **Home** | Landing page with chatbot access and admin login |
| **Chatbot** | User-facing Q&A interface (session resets on exit) |
| **Admin Dashboard** | Protected routes for admin management |
| - **Analytics** | Charts for sessions, satisfaction, CTA clicks |
| - **Chat History** | Filterable/sortable chat logs |
| - **LLM Settings** | Configure AI model parameters and upload files for knowledge base |

---

### **3.2 Backend (FastAPI)**
#### **API Endpoints**
Please refer to the [API Specification](./api_specification.md) for detailed endpoint descriptions.

---

### **3.3 Chatbot (Vertex AI)**
#### **Integration Flow**
1. User message → FastAPI endpoint
2. Backend enriches prompt with LLM settings
3. Vertex AI generates response
4. Response + metadata saved to Firestore

---

### **3.4 Database (Firestore)**
Please refer to the [database architecture documentation](./database_architecture.md) for detailed structure and relationships.

---

## **4. Data Flow**
### **4.1 User Chat Flow**
![image](/documentation/diagram/user_chat_flow.svg)


### **4.2 Admin Analytics Flow**
![image](/documentation/diagram/admin_analytics_flow.svg)


### **4.3 Admin Chat History & Session Flow**
![image](/documentation/diagram/admin_chat_history_flow.svg)

### **4.4 Admin LLM Settings Edit Flow**
![image](/documentation/diagram/admin_llm_settings_flow.svg)
---

## **5. Deployment Architecture**
- **Next.js**: Hosted on Vercel
- **FastAPI**: Containerized on Google Cloud Run (Google Cloud Project)
- **Vertex AI**: Vertex AI (Google Cloud Project)
- **Firestore**: Firebase Firestore DB (Google Cloud Project)

---

## **6. Frontend UI Mockups**
### Mockups are deployed on Vercel and can be accessed at [CANDY AI Assistant Mockups](https://capstone-product-chatbot.vercel.app/)

### **Home Page**
![image](/documentation/image/home_page.png)

### **Contact Us Page**
![image](/documentation/image/contact_us_page.png)

### **Chatbot Page**
![image](/documentation/image/chatbot_page.png)

### **Admin Login Page**

### **Admin Dashboard**
#### **Analytics Page**
![image](/documentation/image/analytics_page.png)

#### **Chat History Page**
![image](/documentation/image/chat_history_page.png)

#### **LLM Settings Page**
~![image](/documentation/image/llm_settings_page.png)

