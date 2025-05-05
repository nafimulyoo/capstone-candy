

### **1. Functional Testing**  
**Objective:** Verify core chatbot functionalities work as intended.  

| **TC-ID** | **Test Scenario** | **Steps** | **Expected Result** | **Pass/Fail** |
|-----------|------------------|-----------|---------------------|--------------|
| **F-001** | Chatbot launches/closes correctly | 1. Open website <br> 2. Click chatbot icon <br> 3. Click "Close" | Chat window opens/closes smoothly. | |
| **F-002** | Text message submission | 1. Type "Hello" <br> 2. Press "Send" or Enter | Message appears in chat history. | |
| **F-003** | Chatbot responds to user input | 1. Send "What’s your name?" | Bot replies with a valid response (e.g., "I’m [Bot Name]"). | |
| **F-004** | Handles empty input | 1. Click "Send" without typing | Displays error: "Please enter a message." | |
| **F-005** | Supports quick replies (buttons) | 1. Click pre-defined options (e.g., "Help") | Bot responds with relevant answer. | |
| **F-006** | Multi-language support | 1. Send a message in non-English (e.g., Spanish) | Bot replies accurately in the same language. | |

---

### **2. Performance Testing**  
**Objective:** Measure response accuracy, speed, and stability.  

| **TC-ID** | **Test Scenario** | **Steps** | **Expected Result** | **Metrics** |
|-----------|------------------|-----------|---------------------|------------|
| **P-001** | Average response time | 1. Send 10 queries (e.g., "Hi," "Help") <br> 2. Record response times | All responses delivered in **≤2 seconds**. | Speed: ≤2s |
| **P-002** | Accuracy of responses | 1. Ask 10 factual questions (e.g., "What’s your return policy?") | ≥90% answers are correct. | Accuracy: ≥90% |
| **P-003** | Load under high traffic | 1. Simulate 100+ concurrent users (JMeter/LoadRunner) | No crashes; response time stays ≤3s. | Stability: No errors |
| **P-004** | Long conversation handling | 1. Send 50+ messages in one session | Bot maintains context and speed. | No memory leaks |

---

### **3. Usability Testing**  
**Objective:** Evaluate user-friendliness and intuitiveness.  

| **TC-ID** | **Test Scenario** | **Steps** | **Expected Result** | **UX Criteria** |
|-----------|------------------|-----------|---------------------|----------------|
| **U-001** | Clear UI design | 1. Open chat window <br> 2. Check layout, colors, fonts | Visually appealing, readable text. | Consistency |
| **U-002** | Easy access to help | 1. Type "Help" or click FAQ button | Displays help menu instantly. | Accessibility |
| **U-003** | Error guidance | 1. Send invalid input (e.g., "###") | Suggests valid commands (e.g., "Try ‘Help’"). | Clarity |
| **U-004** | Mobile responsiveness | 1. Test on mobile devices | Chat window adapts to screen size. | Responsiveness |
| **U-005** | Conversation flow | 1. Ask multi-step questions (e.g., "Book a flight") | Bot guides user logically. | Intuitiveness |

---
