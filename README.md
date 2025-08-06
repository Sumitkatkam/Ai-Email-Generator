# 📧 AI Email Generator & Sender

An AI-powered email generation and sending tool using GROQ (LLM) + Gmail. Enter a prompt, generate an email, customize it, and send it instantly — all from a beautiful React interface.

---

## 🗂️ Project Structure

Ai-Email-Generator/
├── client/ # Frontend (React + Vite + Tailwind CSS)
└── server/ # Backend (Node.js + Express + GROQ + Nodemailer)

## 🚀 Features

- ✨ Generate email content from a prompt using LLM (GROQ)
- 📝 Edit subject and email body before sending
- 📤 Send email to one or more recipients via Gmail
- 🔒 .env-protected credentials
- 🌐 Deployable via Vercel (both frontend and backend)

---

## 🔧 Backend Setup (`server/`)

### 1. Install dependencies

cd server
npm install


### 2. Create a .env file

GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password  (Make sure to enable 2FA in Gmail and create an App Password for EMAIL_PASS.)

### 3. Start the backend locally

node index.js

Runs on: http://localhost:5000

Test endpoint: http://localhost:5000/


## 💻 Frontend Setup (client/)

### 1. Install dependencies

cd client
npm install

### 2. Start development server

npm run dev
Runs on: http://localhost:5173

Update axios URLs in the frontend (App.jsx) if deploying or using custom backend URLs.

☁️ Deployment Guide

✅ Backend on Vercel

Inside server/, create vercel.json:
{

  "version": 2,

  "builds": [{ "src": "index.js", "use": "@vercel/node" }],

  "routes": [{ "src": "/(.*)", "dest": "index.js" }]

}

Push to GitHub and import into Vercel

### Set the following environment variables:

GROQ_API_KEY

EMAIL_USER

EMAIL_PASS


### 🛠️ Built With

React + Vite

Tailwind CSS

Node.js + Express

GROQ (LLM) API

Nodemailer + Gmail SMTP

Vercel
