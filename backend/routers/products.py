from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[schemas.ProductResponse])
def get_products(
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    featured_only: Optional[bool] = False,
    sort_by: Optional[str] = "newest",
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)

    if category_slug:
        cat = db.query(models.Category).filter(models.Category.slug == category_slug).first()
        if cat:
            query = query.filter(models.Product.category_id == cat.id)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (models.Product.title.ilike(search_pattern)) |
            (models.Product.description.ilike(search_pattern)) |
            (models.Product.fabric.ilike(search_pattern))
        )

    if featured_only:
        query = query.filter(models.Product.is_featured == True)

    if sort_by == "price_low":
        query = query.order_by(models.Product.price.asc())
    elif sort_by == "price_high":
        query = query.order_by(models.Product.price.desc())
    else:
        query = query.order_by(models.Product.id.desc())

    return query.all()

@router.get("/{slug_or_id}", response_model=schemas.ProductResponse)
def get_product(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        product = db.query(models.Product).filter(models.Product.id == int(slug_or_id)).first()
    else:
        product = db.query(models.Product).filter(models.Product.slug == slug_or_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Product).filter(models.Product.slug == product_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product with this slug already exists")

    product = models.Product(**product_in.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: int, product_in: schemas.ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return None
