# 👔 2020 MENS WEAR — Full-Stack E-Commerce Platform

A high-fashion, high-performance E-Commerce platform built for **2020 MENS WEAR** (featuring Quiet Luxury Menswear, French Linen Shirts, Tailored Gurkha Trousers, Old Money Polos, Back-Printed Tees, and Luxury Fragrances).

Featuring a **FastAPI** backend with **SQLAlchemy ORM** + **PostgreSQL** database, a **React (Vite)** single-page frontend, an interactive **Admin Control Panel**, Cloudinary CDN photo uploading, Google Maps store locator, and 24/7 background health warmup.

---

## 🌟 Key Features

### 🛍️ Customer Frontend Experience
- **Infinite Hero Banner Carousel**: Smooth forward-looping horizontal slider featuring luxury drops.
- **Dynamic Category Explorer**: Instant 0ms in-memory cached filtering for Linen Shirts, Gurkha Trousers, Old Money Polos, Tees, and Perfumes.
- **Interactive Product Quick View & Cart Drawer**: Slide-out cart with quantity management, size selection pills (`S`, `M`, `L`, `XL`, `XXL`), and MRP strike-through discounts.
- **Checkout & Order Tracking**: Instant checkout modal with unique tracking code generation (`MW-XXXXX`).
- **Google Reviews Carousel**: Interactive 5-star Google Business review cards with live rating score (`4.8 ★`) and a direct **"Review us"** Google Maps button.
- **Instagram Reels Showcase**: Embedded video player for `@2020_mens_wear` Instagram drops.
- **Floating WhatsApp Chat Widget**: One-click WhatsApp support pre-filled with customer inquiries.

### 🛡️ Admin Control Panel (`/admin`)
- **Hero Layout Editor**: Customize hero titles, subtitles, badge tags, and collection links in real time.
- **Product Management (CRUD)**: Add new products with **Sale Price (₹)** and **Original MRP Price (₹)**, toggle sizes, edit product details, upload photos, or delete inventory.
- **Collection Category Manager**: Create new category collections dynamically.
- **Reel Showcase Manager**: Manage Instagram reels and cover thumbnails.
- **Cloudinary CDN Integration**: Automatic photo downscaling via HTML5 Canvas before uploading to Cloudinary CDN.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend Framework** | React 18 + Vite |
| **Styling** | Vanilla CSS3 (Custom Design System, Glassmorphism, Fluid `clamp()` Typography) |
| **Icons & UI** | Lucide React |
| **Backend API** | Python 3.11+ / FastAPI |
| **Database ORM** | SQLAlchemy ORM + PostgreSQL (Neon Cloud DB / SQLite) |
| **Image Hosting** | Cloudinary Unsigned CDN + Canvas Base64 Fallback |
| **Deployment** | Vercel (Frontend SPA) + Render (Backend Web Service) |

---

## 📁 Repository Directory Structure

```
ecommerce-menswear/
├── backend/
│   ├── main.py              # FastAPI Application Entry & Startup Migrations
│   ├── database.py          # SQLAlchemy Database Engine & Session Connection
│   ├── models.py            # PostgreSQL Database Schemas (Product, Category, Order, Reel, etc.)
│   ├── schemas.py           # Pydantic Schemas for Request/Response Validation
│   ├── seed_data.py         # Seed Data Script for Initial Store Catalog
│   ├── Procfile             # Render Production Start Command
│   ├── requirements.txt     # Python Dependencies (FastAPI, uvicorn, SQLAlchemy, psycopg2, etc.)
│   └── routers/             # API Endpoint Controllers
│       ├── admin.py         # Admin Authentication & Token Endpoints
│       ├── categories.py    # Collection Categories CRUD Endpoints
│       ├── orders.py        # Checkout & Order Tracking Endpoints
│       ├── products.py      # Product CRUD & Filtering Endpoints
│       └── reels.py         # Instagram Reels Endpoints
│
└── frontend/
    ├── index.html           # HTML5 Shell & Typography Links
    ├── package.json         # React & Vite Dependencies
    ├── vite.config.js       # Vite Build Configuration
    ├── vercel.json          # Vercel SPA Rewrite Rules
    ├── src/
    │   ├── App.jsx          # Main Router & Application Root
    │   ├── api.js           # API Base URL & Helper Functions
    │   ├── index.css        # Universal Design System & Responsive Styles
    │   ├── components/      # Reusable UI Components
    │   │   ├── CategoryBar.jsx
    │   │   ├── CategoryGrid.jsx
    │   │   ├── CartDrawer.jsx
    │   │   ├── CheckoutModal.jsx
    │   │   ├── GoogleReviews.jsx
    │   │   ├── HeroBanner.jsx
    │   │   ├── InstagramReels.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── OrderTrackingModal.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductDetailModal.jsx
    │   │   └── WhatsAppWidget.jsx
    │   └── pages/           # Application Views
    │       ├── AdminPage.jsx      # Admin Control Portal (`/admin`)
    │       └── CollectionPage.jsx # Dedicated Collection Catalog Page (`/collection`)
```

---

## 🔑 Environment Variables & Fake Setup Configuration

Create a `.env` file in both `backend/` and `frontend/` using the fake dummy templates below:

### 1️⃣ Backend Environment (`backend/.env`)

```env
# Server Configuration
PORT=8000
ENVIRONMENT=development

# Database Connection (Neon Cloud PostgreSQL or Local SQLite)
# Example PostgreSQL Connection String (Fake Dummy Credentials):
DATABASE_URL=postgresql://menswear_user:FakePassword123!@ep-fake-db-123456.us-east-2.aws.neon.tech/menswear_db?sslmode=require

# Admin Secret Credentials (FOR TESTING & DEMO ONLY)
SECRET_KEY=demo_super_secret_jwt_key_2026_menswear_token_xyz987
ALGORITHM=HS256
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminpassword123

# Cloudinary CDN Credentials (Optional - Fake Sample Values)
CLOUDINARY_CLOUD_NAME=menswear_fake_cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=fake_secret_key_abc123xyz
CLOUDINARY_UPLOAD_PRESET=menswear_unsigned_preset
```

### 2️⃣ Frontend Environment (`frontend/.env`)

```env
# API Backend Base URL
VITE_API_URL=http://localhost:8000

# Cloudinary Unsigned Upload Configuration (Fake Sample Values)
VITE_CLOUDINARY_CLOUD_NAME=menswear_fake_cloud
VITE_CLOUDINARY_PRESET=menswear_unsigned_preset
```

---

## ⚡ Quick Start Guide (Local Development)

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **Python** (v3.10 or higher)
- **Git**

---

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Start the FastAPI development server
uvicorn main:app --reload --port 8000
```

- **Backend API**: `http://localhost:8000`  
- **Swagger API Docs**: `http://localhost:8000/docs`  
- **Health Check Endpoint**: `http://localhost:8000/health`

---

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Admin Control Portal**: `http://localhost:5173/admin`

---

## 🚀 Deployment Guide

### Backend Deployment (Render / Railway)
1. Push your repository to GitHub.
2. Create a new **Web Service** on **Render**.
3. Set Root Directory to `backend`.
4. Set Build Command to: `pip install -r requirements.txt`
5. Set Start Command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (`DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SECRET_KEY`).

### Frontend Deployment (Vercel)
1. Import the repository into **Vercel**.
2. Set Root Directory to `frontend`.
3. Set Framework Preset to **Vite**.
4. Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`
5. Deploy! `vercel.json` handles SPA rewrites automatically.

---

## 📜 License & Copyright

© 2026 **2020 MENS WEAR** (Instagram `@2020_mens_wear`). All rights reserved.
