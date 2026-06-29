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