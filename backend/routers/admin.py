import os
import jwt
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/admin", tags=["Admin"])

SECRET_KEY = os.getenv("SECRET_KEY", "snipes_menswear_super_secret_key_2026")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

@router.post("/login", response_model=schemas.TokenResponse)
def admin_login(req: schemas.LoginRequest):
    if req.username != ADMIN_USERNAME or req.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin username or password"
        )
    
    expiration = datetime.datetime.utcnow() + datetime.timedelta(days=1)
    token = jwt.encode(
        {"sub": req.username, "exp": expiration},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": req.username
    }

@router.get("/stats", response_model=schemas.AdminStatsResponse)
def get_admin_stats(db: Session = Depends(get_db)):
    orders = db.query(models.Order).all()
    products = db.query(models.Product).all()

    total_revenue = sum(o.total_amount for o in orders)
    total_orders = len(orders)
    total_products = len(products)
    low_stock_products = len([p for p in products if p.stock <= 25])

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_products": total_products,
        "low_stock_products": low_stock_products
    }
