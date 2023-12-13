# syntax=docker/dockerfile:1

# Deploy Django
FROM python:3.11.5
RUN apt-get update -y
RUN apt-get install vim -y
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
# Copy backend filed
COPY ./backend/requirements.txt /app/
RUN pip install -r requirements.txt
COPY ./backend/ /app/
RUN rm -rf */__pycache__
RUN rm -rf db.sqlite3
COPY ./docker/backend/*.sh /app/
RUN chmod +x /app/*.sh