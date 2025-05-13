FROM python:3.10-slim

# Set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1


# Install system dependencies
RUN apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

RUN pip install --upgrade google-cloud-aiplatform

# Copy application code
COPY . .

# Expose port (informational only, actual port is managed by gluetun)
EXPOSE 8080

# Run the application
CMD ["uvicorn", "index:app", "--host", "0.0.0.0", "--port", "8080", "--reload", "--workers", "10"]