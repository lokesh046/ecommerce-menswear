import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/orders", tags=["Orders"])

def generate_tracking_code():
    random_str = str(uuid.uuid4()).upper().replace("-", "")[:8]
    return f"SNP-{random_str}"

@router.post("", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: schemas.OrderCreate, db: Session = Depends(get_db)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    total_amount = sum(item.price * item.quantity for item in order_in.items)
    tracking_code = generate_tracking_code()

    order = models.Order(
        tracking_code=tracking_code,
        customer_name=order_in.customer_name,
        email=order_in.email,
        phone=order_in.phone,
        address=order_in.address,
        city=order_in.city,
        pincode=order_in.pincode,
        status="Order Placed",
        total_amount=total_amount
    )
    db.add(order)
    db.flush()

    for item in order_in.items:
        order_item = models.OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            product_title=item.product_title,
            quantity=item.quantity,
            price=item.price,
            size=item.size
        )
        db.add(order_item)

        # Reduce product stock if applicable
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product and product.stock >= item.quantity:
            product.stock -= item.quantity

    db.commit()
    db.refresh(order)
    return order

@router.get("/track/{tracking_code}", response_model=schemas.OrderResponse)
def track_order(tracking_code: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.tracking_code == tracking_code.upper().strip()).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order tracking ID not found")
    return order

@router.get("", response_model=List[schemas.OrderResponse])
def get_all_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).order_by(models.Order.id.desc()).all()

@router.put("/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(order_id: int, status_in: schemas.OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status_in.status
    db.commit()
    db.refresh(order)
    return order
