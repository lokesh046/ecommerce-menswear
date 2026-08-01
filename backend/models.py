import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    badge = Column(String(50), nullable=True)  # e.g., "New Arrival", "Best Seller", "53 Styles"
    fabric = Column(String(100), nullable=True) # e.g., "100% Premium Cotton", "Pure Linen"
    fit = Column(String(100), nullable=True)    # e.g., "Slim Fit", "Oversized Fit", "Tailored Fit"
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=False)
    stock = Column(Integer, default=50)
    sizes = Column(String(100), default="S,M,L,XL,XXL")
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    category = relationship("Category", back_populates="products")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String(50), unique=True, index=True, nullable=False)
    customer_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)
    status = Column(String(50), default="Order Placed") # "Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, nullable=True)
    product_title = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Float, nullable=False)
    size = Column(String(20), nullable=False, default="M")

    order = relationship("Order", back_populates="items")

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Reel(Base):
    __tablename__ = "reels"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    reel_url = Column(String(500), nullable=False)
    cover_image_url = Column(String(500), nullable=False)
    tagline = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
