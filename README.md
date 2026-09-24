# 🚀 VectorVault RAG Platform

> **Multi-Tenant RAG, Vector Search Engine & Interactive Voice Assistant**  
> *A full-stack AI platform featuring modular Python FastAPI microservices, a Node.js/Express multi-tenant API gateway with PostgreSQL & pgvector, and a high-performance React 19 dashboard.*

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Executive Summary

**VectorVault RAG** is an end-to-end, multi-tenant Retrieval-Augmented Generation (RAG) platform engineered for enterprise scalability, real-time semantic search, and multimodal interaction. It enables organizations to create isolated AI applications, ingest diverse document corpora, execute hybrid two-stage vector retrieval, and interact through both text and low-latency voice streams.

Built with clean separation of concerns, VectorVault demonstrates production-ready AI engineering: modular Python microservices handle computationally heavy AI tasks (embedding, reranking, transcription, LLM inference), while a Node.js/Prisma backend enforces strict multi-tenancy, authorization, database indexing, and real-time WebSocket communication.

---

## 🌟 Key Features

- 🏢 **Multi-Tenant Architecture**: Complete data isolation across tenants, applications (`apps`), document corpora (`groups`), and vector chunks. Supports both user session tokens (JWT) and programmatically isolated `X-API-Key` access.
- ⚡ **Two-Stage Hybrid RAG Pipeline**: First-stage vector search via PostgreSQL `pgvector` (1024-dimensional embeddings via Voyage AI) paired with a second-stage cross-encoder **Voyage Reranker** for maximum retrieval precision.
- 🎙️ **Full-Duplex Interactive Voice Assistant**: Real-time voice interaction leveraging Voice Activity Detection (VAD), **Whisper Large v3 / Turbo** speech-to-text, LLM context generation, and Text-to-Speech (TTS) response synthesis.
- 🧩 **Decoupled Python AI Microservices**: Modular FastAPI services for document text extraction, semantic chunking, embeddings, reranking, LLM response generation (**Llama 3.1 8B Instruct** & **OpenAI**), and translation.
- 📊 **Real-Time Data Pipeline & Visualizer**: Interactive UI components that provide visual transparency into document extraction, text chunking, embedding generation, and vector indexing.
- 🎨 **Modern UI/UX**: Built with React 19, Vite, Tailwind CSS v4, and dynamic WebGL/Canvas shader animations for voice mode.

---

## 📸 Screenshots

> _Add screenshots/GIFs below before sharing this repo — visuals convert far better than text for a first impression._

| Dashboard / Corpora Manager | RAG Chat Interface |
| :---: | :---: |
| _add screenshot_ | _add screenshot_ |

| Voice Assistant Mode | Data Pipeline Visualizer |
| :---: | :---: |
| _add screenshot_ | _add screenshot_ |

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Frontend ["🎨 Frontend (React 19 + Vite + Tailwind v4)"]
        UI["Tenant Dashboard / RAG Chat / Voice Mode"]
        VAD["Web Voice Activity Detection (VAD)"]
    end

    subgraph Gateway ["⚡ Backend API Gateway (Node.js + Express 5 + Prisma)"]
        Auth["Auth & Tenant Middleware (JWT / X-API-Key)"]
        Sockets["Socket.IO Server (Real-time Stream)"]
        DbLogic["Prisma ORM & Business Logic"]
    end

    subgraph Database ["💾 Database (PostgreSQL + pgvector)"]
        TenantDB[("Tenants, Apps, Groups, Docs")]
        VectorStore[("Chunks Table\n1024-dim pgvector index")]
    end

    subgraph Microservices ["🐍 AI Microservices (Python FastAPI)"]
        ExtractService["Extractor (PDF, DOCX, TXT, HTML)"]
        ChunkService["Semantic Chunking Engine"]
        EmbedService["Voyage AI Vector Embedder (1024d)"]
        RerankService["Voyage Cross-Encoder Reranker"]
        LLMService["Llama 3.1 8B / OpenAI Generation"]
        VoiceService["Whisper Large v3 (STT) & TTS"]
    end

    UI <-->|HTTP / WebSockets| Auth
    Auth <--> Sockets
    Auth <--> DbLogic
    DbLogic <--> TenantDB & VectorStore
    DbLogic <-->|Internal REST API| Microservices
```

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend Dashboard** | React 19, Vite 8, Tailwind CSS v4, TanStack React Query, React Router v7, React Syntax Highlighter, Lucide Icons |
| **Backend Gateway** | Node.js, Express v5, Prisma ORM, Socket.IO, Zod Validation, Better Auth / JWT, Multer |
| **Primary Database** | PostgreSQL, `pgvector` (1024-dimensional vector similarity indexing), Raw SQL Prisma queries |
| **AI Microservices** | Python 3.10+, FastAPI, PyTorch, Transformers, Uvicorn, Pydantic |
| **AI Providers & Models** | **Embeddings**: Voyage AI (`voyage-3-lite`), **Reranker**: Voyage Reranker, **LLM**: Llama 3.1 8B Instruct, OpenAI GPT, **Speech**: Whisper Large v3 / Turbo, Custom TTS |

---

## 📁 Repository Structure

```
vector_valut-RAG/
├── microservices/                  # 🐍 Python FastAPI AI Microservices
│   ├── server.py                   # Main FastAPI server entry point
│   └── app/
│       ├── api/                    # Microservice routers (chunking, embedding, reranking, generation, voice)
│       ├── models/                 # Pydantic request/response schemas
│       ├── providers/              # Integration with Voyage AI, Llama 3.1 8B, OpenAI, Whisper
│       └── services/               # Text-to-Speech & translation helpers
└── vector_valut/
    ├── backend/                    # ⚡ Node.js Express & Prisma API Gateway
    │   ├── app/
    │   │   ├── server.js           # Express server entry point
    │   │   ├── socket.js           # Socket.IO real-time event handlers
    │   │   └── src/
    │   │       ├── controllers/    # App, Tenant, RAG Ingestion, Retrieval, Voice Controllers
    │   │       ├── middleware/     # Auth (JWT verification & X-API-Key validation)
    │   │       └── utility/        # HTTP client helpers communicating with microservices
    │   ├── prisma/
    │   │   └── schema.prisma       # Prisma multi-tenant data model with pgvector
    │   └── multi-tenant-schema.md  # Multi-tenant isolation specifications
    └── frontend/
        └── app/                    # 🎨 React 19 Frontend Dashboard
            └── src/
                ├── components/     # Chat interface, Voice mode shaders, File uploaders
                ├── pages/          # Dashboard, Corpora Manager, RAG Chat, Voice Assistant
                └── apis/           # Axios client modules
```

---

## 🔄 Complete RAG Data Flow Pipeline

### 1. Document Ingestion & Vector Indexing
1. **Upload**: User uploads files (PDF, DOCX, TXT) via the Corpora Manager UI.
2. **Extraction**: File is sent to the Python `extraction` microservice to extract raw text and metadata.
3. **Chunking**: Raw text is passed to the `chunking` microservice to create structured segments.
4. **Embedding**: Text chunks are sent to the `embedding` microservice to generate **1,024-dimensional Voyage AI vectors**.
5. **Storage**: Chunks, metadata, and vectors are saved into PostgreSQL via Prisma raw SQL using `pgvector`.

### 2. Two-Stage Retrieval & Answer Generation
1. **Query Embedding**: User submits a question. The query text is converted into a 1024-dim vector.
2. **Candidate Retrieval (Stage 1)**: PostgreSQL runs cosine vector similarity search (`<=>` operator) restricted by `tenantId`, `appId`, and `groupId` to fetch the top candidate chunks (e.g., top 20).
3. **Cross-Encoder Reranking (Stage 2)**: Candidates are passed to the **Voyage Reranker** microservice, which scores semantic relevance against the query and filters down to the top K chunks (e.g., top 5).
4. **LLM Generation**: The reranked context and prompt are passed to **Llama 3.1 8B Instruct** (or OpenAI) to synthesize a grounded answer with source citations.

---

## 🎙️ Low-Latency Voice Assistant Engine

VectorVault includes an interactive Voice Assistant interface designed for seamless spoken dialogue:
- **Client Voice Detection**: Built-in Voice Activity Detection (VAD) monitors user speech in real-time.
- **Audio Streaming**: Spoken audio is sent via WebSockets or REST to the Python `transcribe` microservice.
- **Speech-to-Text**: Transcribed using OpenAI **Whisper Large v3** / **v3 Turbo**.
- **Contextual Dialogue & Synthesis**: The transcribed prompt feeds into the RAG engine, and response text is converted back to speech via TTS.
- **Visual Feedback**: Real-time GLSL canvas shader animation dynamically reacts to voice interaction states (listening, processing, speaking).

---

## 🔒 Multi-Tenant Security & Isolation Model

VectorVault implements multi-tenancy at every tier of the database and application:

| Level | Isolation Mechanism |
| :--- | :--- |
| **Tenant Level** | `Tenant` record with dedicated tenant UUID. All database tables store a `tenantId`. |
| **App Level** | `App` record scoped to a tenant. Allows building multiple AI bots (e.g., HR Bot, Support Bot) under one tenant. |
| **Corpus (Group) Level** | `Group` record scoping document sets to specific applications. |
| **API Authentication** | **JWT Auth**: Protects administrative dashboard routes.<br>**X-API-Key Auth**: Protects external query/upload endpoints used by embedded widgets or external APIs. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ or Bun
- **Python**: v3.10+
- **PostgreSQL**: v15+ with `pgvector` extension enabled
- **API Keys**: Voyage AI API Key and OpenAI API Key (or local Llama 3.1 endpoint)

---

### 1. Python AI Microservices Setup

```bash
cd microservices

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic python-dotenv requests voyageai openai torch transformers

# Configure Environment
cp .env.example .env   # Add VOYAGE_API_KEY, OPENAI_API_KEY, etc.

# Start FastAPI server
python3 server.py
# Server runs at http://localhost:8000
```

---

### 2. Backend Gateway Setup

```bash
cd vector_valut/backend

# Install dependencies
npm install

# Setup Environment Variables (.env)
# DATABASE_URL="postgresql://user:password@localhost:5432/vectorvault?schema=public"
# JWT_SECRET="your_jwt_secret"
# MICROSERVICE_URL="http://localhost:8000"

# Apply Prisma Migrations
npx prisma migrate dev

# Start development server
npm run dev
# Backend runs at http://localhost:5000
```

---

### 3. Frontend Dashboard Setup

```bash
cd vector_valut/frontend/app

# Install dependencies
npm install

# Start Vite dev server
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🧠 Design Decisions & Trade-offs

- **Two-stage retrieval instead of vector search alone**: Raw cosine similarity over-fetches semantically similar but contextually weak matches. Adding a cross-encoder reranker as a second pass trades a small latency cost for materially better precision on the chunks that actually reach the LLM.
- **Prisma raw SQL for vector queries**: Prisma's query builder doesn't support `pgvector`'s `<=>` distance operator natively, so retrieval queries drop to raw SQL while the rest of the app (tenant/app/group CRUD) stays on the Prisma ORM — keeping type safety everywhere it's available without blocking on ORM limitations.
- **Python microservices split from the Node gateway**: embedding, reranking, transcription, and LLM inference are CPU/GPU-bound and benefit from Python's ML ecosystem (PyTorch, Transformers), while the gateway's job — auth, tenancy, request orchestration, WebSockets — is I/O-bound and better served by Node's event loop. Splitting them lets each service scale independently.
- **Tenant → App → Group hierarchy**: modeled after real multi-tenant SaaS needs — one tenant can run several distinct bots (e.g., HR Bot, Support Bot) each with its own isolated document corpus, rather than flattening everything under a single tenant-level namespace.

---

## 📄 License & Contact

This project is licensed under the [MIT License](LICENSE) and built for demonstration and showcase purposes.

- **Developer**: Mahesh N.
- **Email**: [maheshnmahesh567@gmail.com](mailto:maheshnmahesh567@gmail.com)
- **Repository**: [VectorVault RAG Platform](https://github.com/maheshn567/vector_valut-RAG-)

---
*VectorVault RAG — Enterprise Multi-Tenant AI Search & Retrieval Architecture*
