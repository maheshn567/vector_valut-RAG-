## **RAG Search Engine Microservice Architecture & Roadmap** 

## **Overview** 

This service is a standalone, provider-agnostic RAG (Retrieval-Augmented Generation) microservice that exposes APIs only. 

Responsibilities: 

1. Extract text from documents 

2. Chunk documents 

3. Generate embeddings 

4. Retrieve relevant chunks 

5. Rerank retrieved chunks 

6. Generate answers using an LLM 

7. Return citations and metadata 

Non-Responsibilities: 

- User management 

- Authentication 

- Database management 

- Multi-tenancy 

- Frontend 

- Permissions 

Those responsibilities belong to the App Server. 

## **High-Level Architecture** 

```
                  ┌───────────────────┐
                  │    App Server     │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │    RAG Service    │
                  └───────────────────┘
```

```
/extract
```

```
/chunk
/embed
/retrieve
/rerank
```

1 

```
/generate
/chat
```

## **Project Structure** 

```
app/
├── api/
│   ├── extraction.py
│   ├── chunking.py
│   ├── embeddings.py
│   ├── retrieval.py
│   ├── reranking.py
│   ├── generation.py
│   └── chat.py
│
├── services/
│   ├── extractor/
│   ├── chunker/
│   ├── embeddings/
│   ├── retriever/
│   ├── reranker/
│   └── llm/
│
├── providers/
│   ├── embeddings/
│   ├── rerankers/
│   └── llms/
│
├── models/
│   ├── requests.py
│   └── responses.py
│
├── utils/
│
└──
 server.py
```

## **Standard API Response Schema** 

## **Success Response** 

```
{
```

```
"success":true,
"data":{},
```

2 

```
"error":null,
"metadata":{
"processing_time_ms":120
}
}
```

## **Error Response** 

```
{
"success":false,
"data":null,
"error":{
"code":"INVALID_FILE",
"message":"Unsupported file type"
},
"metadata":{}
}
```

## **1. Extraction Service** 

## **Responsibilities** 

- Extract text from documents. • Preserve page information. 

- Extract metadata. 

## **Supported Inputs** 

## **File Upload** 

```
{
"file":"<binary>"
}
{
"url":"https://example.com"
}
```

## **URL** 

3 

## **Raw Text** 

```
{
"text":"Some content..."
}
```

## **Response Schema** 

```
{
"document_name":"contract.pdf",
"content_type":"pdf",
"pages":[
{
"page_number":1,
"text":"..."
}
],
"metadata":{
"page_count":50,
"title":"Contract"
}
}
```

## **Internal Models** 

```
classExtractedPage:
page_number:int
text:str
classExtractedDocument:
document_name:str
content_type:str
pages:List[ExtractedPage]
metadata:dict
```

## **Recommended Libraries** 

PDF: 

- PyMuPDF • pdfplumber 

4 

DOCX: 

- python-docx 

PPTX: 

- python-pptx 

HTML: 

- BeautifulSoup 

OCR: 

• EasyOCR 

URLs: 

- requests 

- BeautifulSoup 

## **Endpoint** 

```
POST /extract
```

## **2. Chunking Service** 

## **Responsibilities** 

- Split text into meaningful chunks. • Preserve metadata and chunk boundaries. 

## **Request** 

```
{
"document":{},
"chunk_size":1000,
"chunk_overlap":200,
"strategy":"recursive"
}
```

5 

## **Response** 

```
{
"chunks":[
{
"chunk_id":"uuid",
"text":"...",
"metadata":{
"page":2,
"start":100,
"end":500
}
}
]
}
```

## **Internal Model** 

```
classChunk:
chunk_id:str
text:str
metadata:dict
```

## **Chunking Strategies** 

## **Recursive** 

General-purpose default. 

## **Markdown** 

For structured documentation. 

## **Semantic** 

For knowledge bases. 

## **Parent-Child** 

For large documents. 

6 

## **Endpoint** 

```
POST /chunk
```

## **3. Embedding Service** 

## **Responsibilities** 

- Convert chunks into vectors. 

## **Request** 

**==> picture [440 x 142] intentionally omitted <==**

**----- Start of picture text -----**<br>
{<br>"chunks": [<br>{<br>""<br>"chunk_id": ,<br>"text": ""<br>}<br>],<br>"provider": "voyage"<br>}<br>**----- End of picture text -----**<br>


## **Response** 

```
{
"embeddings":[
{
"chunk_id":"123",
"vector":[]
}
]
}
```

## **Internal Model** 

```
classChunkEmbedding:
chunk_id:str
vector:List[float]
```

7 

## **Provider Interface** 

```
classEmbeddingProvider:
defembed(texts):
pass
```

## **Supported Providers** 

- Voyage 

- OpenAI 

- Cohere 

- Local models 

## **Endpoint** 

```
POST /embed
```

## **4. Retrieval Service** 

## **Responsibilities** 

- Retrieve relevant chunks for a query. 

## **Request** 

```
{
"query":"payment terms",
"chunks":[],
"top_k":20,
"search_type":"hybrid"
}
```

## **Response** 

```
{
```

```
"results":[
```

8 

```
{
"chunk_id":"123",
"score":0.89,
"text":"..."
}
]
}
```

## **Retrieval Interface** 

```
classRetriever:
defretrieve(query,chunks,top_k):
pass
```

## **Retrieval Types** 

- vector • keyword • hybrid 

## **Endpoint** 

```
POST /retrieve
```

## **5. Reranking Service** 

## **Responsibilities** 

- Improve retrieval quality. 

- Reorder retrieved chunks. 

## **Request** 

```
{
"query":"payment terms",
"results":[],
```

9 

```
"top_k":5
```

```
}
```

## **Response** 

```
{
"results":[
{
"chunk_id":"123",
"score":0.98,
"text":"..."
}
]
}
```

## **Interface** 

```
classReranker:
defrerank(query,chunks):
pass
```

## **Recommended Rerankers** 

- Cohere Rerank 

- BGE Reranker 

- Cross Encoder Models 

## **Endpoint** 

```
POST /rerank
```

## **6. LLM Service** 

## **Responsibilities** 

- Generate grounded answers. 

- Return citations and token usage. 

10 

## **Request** 

```
{
"query":"...",
"context":[],
"system_prompt":"...",
"provider":"openai"
}
```

## **Response** 

```
{
"answer":"...",
"citations":[
{
"chunk_id":"123"
}
],
"usage":{
"prompt_tokens":1000,
"completion_tokens":300
}
}
```

## **Provider Interface** 

```
classLLMProvider:
defgenerate(
query,
context,
system_prompt
):
pass
```

## **Supported Providers** 

- OpenAI 

- Anthropic 

- Google 

- Local models 

11 

## **Endpoint** 

```
POST /generate
```

## **7. Chat Endpoint** 

This endpoint orchestrates the entire pipeline. 

## **Request** 

```
{
```

```
"query":"...",
"chunks":[],
"top_k":20,
"rerank_k":5,
"provider":"openai"
}
```

## **Flow** 

```
Query
```

```
 ↓
Embed Query
 ↓
Retrieve Top K
 ↓
Rerank
```

```
 ↓
Construct Context
 ↓
LLM
```

```
 ↓
Response
```

12 

## **Response** 

```
{
"answer":"...",
"sources":[
{
"chunk_id":"123",
"score":0.97
}
],
"usage":{
"tokens":1500
}
}
```

## **Endpoint** 

```
POST /chat
```

## **Provider Pattern** 

```
ExtractorProvider
ChunkProvider
EmbeddingProvider
RetrieverProvider
RerankerProvider
LLMProvider
```

Every component should be behind an interface to allow provider swapping. 

## **Recommended Stack** 

```
Framework      : FastAPI
Validation     : Pydantic v2
Extraction     : PyMuPDF + BeautifulSoup
Chunking        : Custom + Semantic
Embedding       : Voyage
Retrieval       : Hybrid Search
Reranker        : BGE-Reranker
LLM             : GPT-5 / Claude
```

13 

```
Streaming       : Server Sent Events
Background Jobs : Celery (Optional)
```

## **End-to-End Flow** 

```
POST /extract
      ↓
POST /chunk
      ↓
POST /embed
      ↓
Store embeddings externally
      ↓
POST /retrieve
      ↓
POST /rerank
      ↓
POST /generate
```

or 

```
POST /chat
```

This architecture provides a clean, scalable, provider-agnostic RAG engine that can be integrated into any application server through simple HTTP APIs and API keys. 

14 

