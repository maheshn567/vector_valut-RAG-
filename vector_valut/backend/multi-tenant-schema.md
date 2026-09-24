# Retrieval Database Schema Design

This database schema supports multi-tenant isolation, allowing multiple organizations (tenants) to manage their own custom RAG applications, document corpora, and vector embeddings securely.

## 1. Core Tables

### Tenant Table
Stores information about each organization/tenant.
* `id` (integer, auto_increment, PK)
* `tenant_id` (uuid, unique)
* `org_name` (string)
* `s3_bucket_name` (string) - For isolated document file storage
* `created_at` (timestamp)
* `updated_at` (timestamp)

### App Table
Each tenant can run multiple RAG search applications (e.g., Support Bot, Internal Wiki, HR Search).
* `id` (integer, auto_increment, PK)
* `app_id` (uuid, unique)
* `tenant_id` (uuid, FK references Tenant.tenant_id)
* `app_name` (string)
* `app_description` (string)
* `app_type` (string)
* `is_active` (boolean)
* `api_key` (string) - Secure credentials to query this app
* `app_db_config` (json) - App-specific database/vector database configuration
* `created_at` (timestamp)
* `updated_at` (timestamp)

### Groups Table (Corpora)
Represents collections of documents (a corpus or group) within an app.
* `id` (integer, auto_increment, PK)
* `group_id` (uuid, unique)
* `app_id` (uuid, FK references App.app_id)
* `tenant_id` (uuid, FK references Tenant.tenant_id) - *Denormalized for fast tenant isolation filtering*
* `group_name` (string)
* `group_description` (string)
* `created_at` (timestamp)
* `updated_at` (timestamp)

### Documents Table
Tracks files uploaded into a corpus group.
* `id` (integer, auto_increment, PK)
* `doc_id` (uuid, unique)
* `group_id` (uuid, FK references Groups.group_id)
* `tenant_id` (uuid, FK references Tenant.tenant_id) - *Denormalized for fast tenant isolation filtering*
* `doc_name` (string)
* `doc_path` (string) - S3 path or local storage URI
* `doc_type` (string) - e.g., PDF, DOCX, HTML, TXT
* `created_at` (timestamp)
* `updated_at` (timestamp)

### Chunks Table
Stores the text segments extracted from documents and their corresponding vector embeddings.
* `id` (integer, auto_increment, PK)
* `chunk_id` (uuid, unique)
* `doc_id` (uuid, FK references Documents.doc_id)
* `group_id` (uuid, FK references Groups.group_id) - *Fast filtering for vector search*
* `tenant_id` (uuid, FK references Tenant.tenant_id) - *Mandatory for strict tenant query isolation*
* `text` (text) - The raw chunked text content
* `vector` (vector(1024)) - The 1,024-dimensional embedding vector (e.g., pgvector)
* `metadata` (json) - Stores page number, offsets, token count
* `created_at` (timestamp)
* `updated_at` (timestamp)

You should use the X-API-Key (verifyApiKey middleware) authentication for programmatic and integration-facing features. These are routes called by external client websites, backend scripts, or chatbots rather than dashboard users.

Here is the exact breakdown of which features and routes should use X-API-Key authentication:

1. RAG Query & Vector Search
Feature: Querying the knowledge base (retrieving relevant context chunks and generating LLM answers).
Routes: e.g., POST /api/v1/query or POST /api/v1/search
Why: When a tenant embeds a search widget or chatbot on their website, the widget will include their specific App's X-API-Key. The middleware validates the key, extracts the appId and tenantId, and queries only the chunks belonging to that specific app.
2. Document Upload & Text Ingestion
Feature: Uploading documents, chunking text, generating embeddings, and storing them in the database.
Routes: e.g., POST /api/v1/documents/upload or POST /api/v1/chunks/ingest
Why: Automated ingestion pipelines, crawler bots, or sync scripts running on a tenant's server need a long-lived API key to upload new content into a specific document corpus (Group).
3. Client App Configuration
Feature: Fetching settings, chatbot custom themes, greeting messages, or prompts.
Routes: e.g., GET /api/v1/app/client-config
Why: The widget on the frontend needs to load the metadata stored in appDbConfig (like layout theme, chatbot name) without a user logging in. It uses the App's public X-API-Key to fetch only its configuration.
Comparison of Route Protection in Your Code
To make it clear, here is how you would organize your route files:

1. Under app.route.js and tenant.route.js (Protected by verifyJWT):
Used by the dashboard UI when a tenant admin logs in:

POST /api/v1/tenant/create-app (Create app)
GET /api/v1/app/tenant-apps (List apps)
PATCH /api/v1/app/update-app/:id (Change app configuration)
2. Under document.route.js and query.route.js (Protected by verifyApiKey):
Used by external applications or code integrations:

POST /api/v1/document/upload (Upload file to corpus)
POST /api/v1/query/ask (Perform semantic search & LLM generation)