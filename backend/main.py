import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import products, categories, orders, admin, reels
from seed_data import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Snipes Menswear API",
    description="Backend API for Snipes Menswear e-commerce clone, featuring Neon PostgreSQL / SQLite persistence.",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from sqlalchemy import text

@app.on_event("startup")
def startup_event():
    print("Application starting up... Seeding database if empty.")
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE products ALTER COLUMN image_url TYPE TEXT;"))
            conn.execute(text("ALTER TABLE categories ALTER COLUMN image_url TYPE TEXT;"))
            conn.execute(text("ALTER TABLE reels ALTER COLUMN cover_image_url TYPE TEXT;"))
    except Exception as e:
        print(f"Database column text migration notice: {e}")

    try:
        seed_database()
    except Exception as e:
        print(f"Error seeding database on startup: {e}")

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Welcome to 2020 MENS WEAR Backend API",
        "docs": "/docs"
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    """Health check endpoint to keep backend warm and avoid cold-start delays."""
    return {
        "status": "healthy",
        "service": "2020 MENS WEAR API",
        "database": "connected"
    }

app.include_router(products.router)
app.include_router(categories.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(reels.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
