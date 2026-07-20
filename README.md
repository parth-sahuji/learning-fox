# 🦊 Learning Fox — Home Tuition Management Platform

A full-stack SaaS-ready tutoring management platform built with **React + Node.js + PostgreSQL**.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

## ✨ Features

- **Three-role system** — Admin, Teacher, Student with JWT authentication
- **Gatekeeper model** — Students see teacher details only after admin assigns them
- **Admin Vetting** — Review Aadhar card + Resume before approving teachers
- **Fee dual-verification** — Student pays → confirms → Teacher confirms receipt
- **Cloudinary** — All documents stored securely in the cloud
- **Monthly cron** — Auto-triggers fee records on the 30th of every month
- **SaaS ready** — Multi-tenancy via `agency_id` on all tables
- **SEO optimized** — Schema.org, Open Graph, 50+ keywords

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL (Supabase) |
| Auth | JWT |
| Files | Cloudinary |
| Hosting | Railway (backend) + Vercel (frontend) |

## 🚀 Quick Start (Local)

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/learning-fox.git
cd learning-fox

# 2. Server setup
cd server
cp .env.example .env   # Fill in your credentials
npm install
npm run dev

# 3. Client setup (new terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**

## 📋 Environment Variables

### Server (`server/.env`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `JWT_SECRET` | Random 64-char secret |
| `ADMIN_EMAIL_1` | First admin email |
| `ADMIN_EMAIL_2` | Second admin email |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `CLIENT_URL` | Your Vercel frontend URL (for CORS) |

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Your Railway backend URL |

## 📞 Support
- Phone: 8340173069
- Email: support@learningfoxx.com
- WhatsApp: [Chat](https://wa.me/918340173069)
