# **🍬 CANDY - Software Architecture Documentation**

Last updated: 25-04-2025, 10.45 AM

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
| **Contact Us** | Contact form for user inquiries |
| **Admin Login** | Authentication page for admin access |
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
### Mockups are deployed on Vercel and can be accessed at [CANDY AI Assistant Mockups](https://capstone-candy.vercel.app/)

### **Home Page**
![Home Page](/documentation/screenshots/home_page.jpeg)

### **Contact Us Page**
![Contact Us](/documentation/screenshots/contact_us.jpeg)

### **Chatbot Page**
![Chatbot Page 1](/documentation/screenshots/chatbot_1.jpeg)
![Chatbot Page 2](/documentation/screenshots/chatbot_2.jpeg)
![Chatbot Page 3](/documentation/screenshots/chatbot_3.jpeg)

### **Admin Login Page**
![Admin Login Page](/documentation/screenshots/admin_login_page.jpeg)

### **Admin Dashboard**
#### **Analytics Page**
![image](/documentation/screenshots/analytics.jpeg)

#### **Chat History Page**
![image](/documentation/screenshots/chat_history.jpeg)
![image](/documentation/screenshots/chat_session.jpeg)

#### **LLM Settings Page**
![image](/documentation/screenshots/llm_settings.jpeg)


