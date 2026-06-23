# 2Bucket

2Bucket is a lightweight, self-hosted file storage service designed to replace complex cloud object storage providers like AWS S3. With it, you can spin up your own secure bucket infrastructure on any VPS or private server in minutes — keeping full control over your data.

## Features

- 📁 **Independent Buckets:** Each bucket acts as an isolated, sandboxed storage space driven by a unique UUID.
- 🗂️ **Flexible Folder Structure:** Organize files in custom nested directories (e.g., `companies/123/documents/`).
- 🔑 **Token-Based Authentication:** Protect your endpoints with a secure multi-token bearer authentication system.
- ⬆️ **Advanced Uploads:** Built-in support for uploading files, targeted sub-folders, and deterministic renaming flags.
- 🐳 **Docker Native:** Fully containerized architecture with multi-stage builds and watch-mode development configurations.

---

## 🛠️ Infrastructure Setup

### Environment Variables (`.env`)
Create a `.env` file in the root directory:

```env
PORT=4000
SERVICE_ENV=prod # Use 'dev' or 'prod'
VALID_TOKENS=your_secure_token_1,your_secure_token_2
BUCKET_PATH=/app/files
```

## Deployment with Docker Compose
Run the service persistently on your server using the optimized docker-compose.yml:

```yaml
services:
  bucket:
    build: .
    restart: unless-stopped
    ports:
      - "4000:4000"
    env_file:
      - ./.env
    volumes:
      - /srv/2bucket/files:/app/files
```

To start the server in detached mode: 

```bash
docker compose up -d
```


## API Reference
All requests must include the header: Authorization: Bearer <token>

# 1. Create a Bucket
Endpoint: POST /v1/api/2bucket/bucket

Response (201):

```json
{
  "message": "Bucket created successfully",
  "bucket_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

# 2. Upload a File
Endpoint: POST /v1/api/2bucket/file/upload

Content-Type: multipart/form-data

Body Params:

file: (Binary File) Required

bucket_id: (String) Required

folder: (String) Optional (e.g., documents/contracts)

rename: (String) Optional (e.g., final_report.pdf)

# 3. Download a File
Endpoint: GET /v1/api/2bucket/file/:bucket_id?path=folder/filename.ext

# 4. Check File Metadata
Endpoint: HEAD /v1/api/2bucket/file/:bucket_id?path=folder/filename.ext

Returns: Headers containing Content-Length and Last-Modified.

# 5. Health Check
Endpoint: GET /health (Does not require authentication token).

## Why 2Bucket?
2Bucket was built for developers and teams who want a minimal, open-source, and fully controlled storage solution. Forget S3, Google Cloud, or Azure — here, you own the infrastructure.
