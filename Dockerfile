# Multi-Service Dockerfile - AdvancedKTU Project
# Bu Dockerfile tüm mikroservisleri destekler
# Kullanım: docker build -f Dockerfile --target <service-name> -t <image-name> .
# 
# Mevcut Servisler:
# - authentication-service (Go, Port: 8080)
# - waste-service (Go, Port: 8081)
# - ai_service (Node.js, Port: 3000)
# - chatbot (Node.js, Port: 8083)
# - frontend (React/Node.js, Port: 5174)
# - admin (React/Node.js, Port: 5173)

# ============================================================================
# STAGE 1: Authentication Service (Go)
# ============================================================================
FROM golang:1.24-alpine AS authentication-service-builder

WORKDIR /app/authentication-service

COPY authentication-service/go.mod authentication-service/go.sum ./
RUN go mod download

COPY authentication-service/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o api ./cmd/api/main.go

# Auth Service Runtime
FROM alpine:latest AS authentication-service

RUN apk --no-cache add ca-certificates curl

WORKDIR /root/

COPY --from=authentication-service-builder /app/authentication-service/api .

EXPOSE 8080

CMD ["./api"]

# ============================================================================
# STAGE 2: Waste Service (Go)
# ============================================================================
FROM golang:1.24-alpine AS waste-service-builder

WORKDIR /app/waste-service

COPY waste-service/go.mod waste-service/go.sum ./
RUN go mod download

COPY waste-service/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o api ./cmd/api/main.go

# Waste Service Runtime
FROM alpine:latest AS waste-service

RUN apk --no-cache add ca-certificates curl

WORKDIR /root/

COPY --from=waste-service-builder /app/waste-service/api .

EXPOSE 8081

CMD ["./api"]

# ============================================================================
# STAGE 3: AI Service (Node.js)
# ============================================================================
FROM node:22-alpine AS ai_service-builder

WORKDIR /app/ai_service

COPY ai_service/package*.json ./

RUN npm install

COPY ai_service/ .

# AI Service Runtime
FROM node:22-alpine AS ai_service

WORKDIR /app

COPY --from=ai_service-builder /app/ai_service .

EXPOSE 3000

CMD ["npm", "start"]

# ============================================================================
# STAGE 4: ChatBot Service (Node.js)
# ============================================================================
FROM node:22-alpine AS chatbot-builder

WORKDIR /app/chatBot

COPY chatBot/package*.json ./

RUN npm i

COPY chatBot/ .

# ChatBot Service Runtime
FROM node:22-alpine AS chatbot

WORKDIR /app

COPY --from=chatbot-builder /app/chatBot .

EXPOSE 8083

CMD ["node", "server.js"]

# ======6=====================================================================
# STAGE 5: Frontend (React + Vite)
# ============================================================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build

# Frontend Runtime
FROM node:22-alpine AS frontend

WORKDIR /app

COPY --from=frontend-builder /app/frontend .

EXPOSE 5174

CMD ["npm", "run", "dev"]

# ============================================================================
# STAGE 5: Admin Dashboard (React + Vite)
# ============================================================================
FROM node:22-alpine AS admin-builder

WORKDIR /app/admin

COPY admin/package*.json ./

RUN npm install

COPY admin/ .

RUN npm run build

# Admin Runtime
FROM node:22-alpine AS admin

WORKDIR /app

COPY --from=admin-builder /app/admin .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# ============================================================================
# DEFAULT TARGET: Complete Stack
# ============================================================================
# Varsayılan olarak authentication-service'i başlat
FROM authentication-service AS default

LABEL maintainer="AdvancedKTU Team"
LABEL description="Multi-Service Docker Image - AdvancedKTU Project"
LABEL version="1.0.0"
