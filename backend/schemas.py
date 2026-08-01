import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    title: str
    slug: str
    category_id: Optional[int] = None
    price: float
    original_price: Optional[float] = None
    badge: Optional[str] = None
    fabric: Optional[str] = None
    fit: Optional[str] = None
    description: Optional[str] = None
    image_url: str
    stock: int = 50
    sizes: Optional[str] = "S,M,L,XL,XXL"
    is_featured: bool = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    badge: Optional[str] = None
    fabric: Optional[str] = None
    fit: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None
    sizes: Optional[str] = None
    is_featured: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    category: Optional[CategoryResponse] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Cart Item / Order Item Schemas
class CartItemInput(BaseModel):
    product_id: int
    product_title: str
    quantity: int
    price: float
    size: str

class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int]
    product_title: str
    quantity: int
    price: float
    size: str

    class Config:
        from_attributes = True

# Order Schemas
class OrderCreate(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    pincode: str
    items: List[CartItemInput]

class OrderResponse(BaseModel):
    id: int
    tracking_code: str
    customer_name: str
    email: str
    phone: str
    address: str
    city: str
    pincode: str
    status: str
    total_amount: float
    created_at: datetime.datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str

# Admin Auth Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class ReelBase(BaseModel):
    title: str
    reel_url: str
    cover_image_url: str
    tagline: Optional[str] = "Exclusive Drop @2020_mens_wear"

class ReelCreate(ReelBase):
    pass

class ReelResponse(ReelBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

# Admin Stats Schema
class AdminStatsResponse(BaseModel):
    total_revenue: float
    total_orders: int
    total_products: int
    low_stock_products: int
