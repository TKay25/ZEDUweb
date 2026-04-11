FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure templates and static directories exist
RUN mkdir -p /app/templates /app/static

CMD exec gunicorn -w 4 -b 0.0.0.0:$PORT --timeout 120 wsgi:app
