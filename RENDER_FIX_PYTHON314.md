# Render Deployment Fix Guide

## Problem
Render is using **Python 3.14** despite Dockerfile specifying Python 3.11, causing psycopg2-binary C extension incompatibility.

## Root Cause
- Render's old build cache is serving Python 3.14 runtime instead of using the Docker image
- psycopg2-binary compiled for Python 3.14 fails to load in this environment
- Database initialization was happening at module import time, before app context was ready

## Solutions Applied

### 1. Deferred Database Initialization
- Moved `db.create_all()` from module import time to first HTTP request
- Created `cli.py` with Flask CLI commands for manual database initialization

### 2. Fixed WSGI Entry Point
- Updated `wsgi.py` to properly load environment variables before creating app
- Removed blocking database calls at import time

### 3. Fixed .env File
- Removed Vite frontend syntax that broke python-dotenv parsing
- Added proper Flask backend environment variables

### 4. Created All Missing Route Files
- `routes/users.py`, `students.py`, `tutors.py`, `courses.py`
- `routes/sessions.py`, `assessments.py`, `messages.py`, `ai.py`

## Deployment Steps

### On Render Dashboard (CRITICAL):

1. **Delete Old Service**
   - Go to https://dashboard.render.com
   - Find `zedu-backend` service
   - Click "Settings" → "Delete Service"
   - Confirm deletion
   - Wait 2-3 minutes

2. **Clean Start**
   - Render will run garbage collection
   - Any cached Python 3.14 environment will be cleared

3. **Redeploy from GitHub**
   - Push latest code to GitHub: `git push origin main`
   - Go to your Render project
   - Click "New +" → "Web Service"
   - Connect to your GitHub repo (ZEDU)
   - Render will auto-detect and use `Dockerfile` with Python 3.11

### Local Testing (Optional but Recommended)

```bash
# Navigate to project
cd c:\Users\Lenovo\Documents\GitHub\ZEDU

# Create virtual environment
python -m venv venv
./venv/Scripts/activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -m flask --app cli init-db

# Run development server
python -m flask --app zedu run --debug
```

## Expected Behavior After Fix

✅ Gunicorn imports `wsgi:app` successfully  
✅ Flask app creates with environment variables from .env  
✅ All 9 blueprints (routes) load without import errors  
✅ First HTTP request triggers database table creation  
✅ `/api/health` returns `{"status": "ok"}`  

## If Issues Persist

**Option A: Force Python 3.11 via runtime.txt**
```
# Create file: runtime.txt
python-3.11.9
```

**Option B: Use environment variable in render.yaml**
```yaml
services:
  - type: web
    name: zedu-backend
    runtime: docker
    dockerfilePath: ./Dockerfile
    # ... rest of config
```

**Option C: Manual Environment Override**
Contact Render support or delete service and recreate from scratch.

## Files Modified This Session

- ✅ `.env` - Fixed syntax, removed Vite references
- ✅ `zedu.py` - Deferred database initialization
- ✅ `wsgi.py` - Fixed environment variable loading
- ✅ `requirements.txt` - Ensured SQLAlchemy 1.4.52 and psycopg2-binary 2.9.6
- ✅ `routes/users.py`, `students.py`, `tutors.py`, `courses.py`, `sessions.py`, `assessments.py`, `messages.py`, `ai.py`
- ✅ `cli.py` - Created Flask CLI commands for database management
- ✅ `Dockerfile` - Already correct with Python 3.11-slim

## Next Immediate Actions

1. `git push origin main` (if not already done)
2. Delete `zedu-backend` service on Render
3. Wait 3 minutes
4. Render auto-redeploys from GitHub (should use Docker now)
5. Monitor deployment logs in Render dashboard
6. Test: `curl https://zedu-backend.onrender.com/api/health`
