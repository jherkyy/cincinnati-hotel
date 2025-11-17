Code snippet

# 🏨 The Cincinnati Hotel AI Concierge & Analytics Platform

This project delivers a production-ready, **RAG-powered AI Assistant** for hotel guests, coupled with a **real-time analytics dashboard** for administrators. The system is designed to provide instantaneous, accurate answers based *strictly* on an internal knowledge base, and includes robust fallback and error handling workflows using **n8n**.

---
## 🌐 Production Deployment

The completed system is fully deployed and accessible at the following URL:

[**cincinnati-hotel.vercel.app**](https://cincinnati-hotel.vercel.app)

---
## 👥 User Experience & Roles

The system is designed with a clear separation of roles accessible from the landing page:

1.  **Guest (User):** Users select this option to enter the **AI Chatbot interface**. Here, they can chat with the hotel's AI concierge, which answers questions strictly based on the **Knowledge Base (KB)** (the uploaded PDF file).

2.  **Admin:** Users select this option to access the **Dashboard**. From this centralized view, administrators can:
    * **Upload/Update KB:** Upload a new PDF or Markdown file to immediately update the hotel information used by the chatbot.
    * **View Analytics:** Monitor key metrics like the **Total number of chat sessions** and **Number of questions asked per topic/category** (e.g., Rooms, Dining).

---
## 🏗️ Architecture and Technology Stack

The platform employs a modern microservices architecture orchestrated by n8n, ensuring separation of concerns, scalability, and flexibility.

| **Component** | **Technology** | **Role** |
| :--- | :--- | :--- |
| **Frontend (UI)** | **React** (TypeScript) & **Tailwind CSS** | Admin dashboard, real-time chat interface, and data visualization. |
| **Backend / Orchestration** | **Node.js** & **n8n** (Automation) | Manages all API calls, RAG logic, external webhooks, and complex workflow steps like fallback emails and error handling. |
| **Database** | **Supabase** (PostgreSQL) | Stores real-time chat analytics, user data (for fallback), and conversation history for the dashboard. |
| **AI Agents** | **Gemini 2.5 Flash** | Powers the core RAG Chatbot, **Conversation Analysis Agent**, and other LLM tasks. |
| **Development** | **v0.dev** (Vercel) & **Cursor AI** (Grok-1) | Used for initial framework generation and iterative code building/refinement. |

---
## ⚙️ Key Features

* **RAG-Powered Chatbot:** Answers guest questions about the hotel (rooms, amenities, policies) using **only** the single source of truth: the uploaded knowledge base (PDF/Markdown).
* **Admin Knowledge Base Management:** Admins can upload a single PDF file that serves as the chatbot's knowledge base, replacing the previous version.
* **Real-time Analytics:** Chat statistics (e.g., sessions, categories of inquiry) are updated correctly and immediately after each chat session.
* **Fallback Workflow:** If the chatbot cannot find an answer, it responds politely, offers a contact form, and triggers an email to the representative (`idan@tauga.ai`) with a conversation summary.
* **Robust Error Handling:** A dedicated **n8n error handling workflow** sends an immediate technical alert to the administrator upon any system failure (e.g., API timeout, database connection error).

---
## 🔄 Data Flow and Workflow Logic

### A. Guest Chat Flow (RAG & Realtime Analytics)

1.  **Guest Input:** A user sends a message via the **React/TS Frontend**.
2.  **Trigger n8n:** The Frontend makes a `POST` request to `GUEST_CHAT_N8N_WEBHOOK_URL` containing the guest's message and conversation history.
3.  **RAG/LLM:** The **n8n workflow** uses the **Gemini 2.5 Flash** model to perform Retrieval Augmented Generation (RAG) against the current hotel Knowledge Base.
4.  **Decision Point:**
    * **Success:** If an answer is found, the response is sent back to the Frontend. The conversation is logged to **Supabase**.
    * **Fallback:** If the response contains the `FALLBACK_TRIGGER`, n8n triggers the `FALLBACK_N8N_WEBHOOK_URL`.
5.  **Analytics Update:** After the chat session, the data is pushed to **Supabase**, triggering a **Realtime subscription** on the Admin Dashboard to update metrics immediately.

### B. Fallback Escalation Workflow

This critical workflow ensures no guest inquiry is lost:

1.  **Trigger:** The main chat flow triggers `FALLBACK_N8N_WEBHOOK_URL`.
2.  **Analysis Agent:** A secondary **Gemini 2.5 Flash** agent processes the full conversation history to extract `category`, `summary_for_representative`, and `unanswered_question`.
3.  **Notification:** An email is sent to the hotel representative (**Idan**) for immediate follow-up.

### C. Error Handling Workflow

This robust technical monitoring loop is configured globally within n8n:

1.  **Trigger:** Any unexpected error in the **n8n execution** (e.g., API key failure, connection error).
2.  **Data Capture:** The n8n error node captures the failed node name, workflow name, and full error message.
3.  **Technical Alert:** An email is sent to the technical administrator with clear details of the failure.

---
## 💻 Tech & Methodology Notes

* **Model Selection:** **Gemini 2.5 Flash** was chosen for its high performance, low latency, and advanced reasoning capabilities, making it ideal for the critical RAG and structured data extraction tasks.
* **Cursor AI/Grok:** The project leveraged **Cursor AI** for rapid development and context-aware coding, significantly accelerating the build process.
* **Realtime:** The use of **Supabase Realtime** on the Admin Dashboard provides instant feedback on chatbot activity, fulfilling the requirement for real-time analytics.

---
## 🚀 Getting Started

### Prerequisites

You will need the following accounts and credentials:

* **Supabase** project URL and Publishable Key.
* **n8n** instance (self-hosted or cloud) for the automation workflows.
* **Gemini API Key** (for your n8n workflows).

###  Environment Variables

Create a `.env.local` file in your project root and populate it with the following required variables:

```bash
# === SUPABASE DATABASE CONFIGURATION (Realtime Analytics) ===
NEXT_PUBLIC_SUPABASE_URL="[Your Supabase Project URL]"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="[Your Supabase Public/Anon Key]"

# === N8N WEBHOOKS (For Orchestration) ===
# This webhook receives guest chat messages, performs RAG, and returns the response.
GUEST_CHAT_N8N_WEBHOOK_URL="[n8n Webhook URL for Chat Endpoint]"

# This webhook receives the uploaded Markdown/PDF content for KB update.
ADMIN_UPLOAD_N8N_WEBHOOK_URL="[n8n Webhook URL for Admin Upload Endpoint]"

# This webhook is triggered when the AI uses the FALLBACK_TRIGGER.
FALLBACK_N8N_WEBHOOK_URL="[n8n Webhook URL for Fallback Email System]"
2. Run the Application
Install dependencies and start the development server:


