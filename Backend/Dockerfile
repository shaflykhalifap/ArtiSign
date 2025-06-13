
FROM python:3.10-slim-buster

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends libgl1-mesa-glx libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/* # Clean up apt cache to keep image small


COPY requirements.txt .

# Install Python dependencies
# Use --no-cache-dir to prevent caching pip downloads, reducing image size
# Use --upgrade pip to ensure pip is up-to-date
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code (main.py, config.py, models/, etc.)
COPY . .

# Expose the port that FastAPI will run on (UBAH KE 3000)
EXPOSE 8000

# Command to run the application using Gunicorn with Uvicorn workers (UBAH KE 3000)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--worker-class", "uvicorn.workers.UvicornWorker", "--workers", "2", "main:app"]