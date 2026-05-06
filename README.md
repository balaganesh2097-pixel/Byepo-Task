# Byepo Task

This repository contains the full stack code for the Multi-Tenant Feature Flag Management System. The frontend and backend code are maintained separately to ensure a clear separation of concerns.

## Directory Structure

- **`/backend`:** Node.js backend API built with Express, Prisma, and PostgreSQL.
- **`/frontend/super-admin`:** React frontend for Super Admins (manage organizations).
- **`/frontend/org-admin`:** React frontend for Organization Admins (manage feature flags).
- **`/frontend/end-user`:** React frontend for End Users (check feature access).

## Backend Setup

1. **Navigate to backend folder and install dependencies:**
   ```bash
   cd backend
   yarn install
   ```

2. **Setup environment variables:**
   Copy the `.env.example` file to `.env` and fill in your local Postgres database URL and secret keys.
   ```bash
   cp .env.example .env
   ```

3. **Run database migrations:**
   ```bash
   yarn prisma migrate dev
   ```

4. **Start the backend server:**
   ```bash
   yarn dev
   ```
   The backend will run on `http://localhost:1000`.

## Frontend Setup

Since the frontends are maintained separately, you will need to start them individually. For each frontend (`super-admin`, `org-admin`, `end-user`), follow these steps:

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend/super-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   Copy the `.env.example` file to `.env`. By default, it points to the local backend.
   ```bash
   cp .env.example .env
   ```

4. **Start the frontend application:**
   ```bash
   npm run dev
   ```

## Initial Access (Super Admin)

The backend uses static credentials to authenticate the Super Admin. These credentials are defined in backend `.env` file:
- **Email:** `super@admin.com` (from `SUPER_ADMIN_EMAIL`)
- **Password:** `supersecret` (from `SUPER_ADMIN_PASSWORD`)

To get started, open the **Super Admin frontend** in your browser and log in using the exact credentials specified in  backend `.env` file. From there, you can create new Organizations.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Joi (validation)
- **Frontend:** React, TypeScript, Vite, Axios
