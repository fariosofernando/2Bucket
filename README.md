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
