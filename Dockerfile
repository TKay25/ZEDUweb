FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY backend/requirements.txt .

# Install dependencies (fresh, no cache)
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Run gunicorn
CMD exec gunicorn -w 4 -b 0.0.0.0:$PORT --timeout 120 wsgi:app
