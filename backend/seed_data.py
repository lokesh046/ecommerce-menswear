from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if categories already exist
    if db.query(models.Category).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding initial Snipes Menswear categories and products...")

    categories_data = [
        {
            "name": "Solid Shirts",
            "slug": "solid-shirts",
            "description": "Timeless solid color shirts tailored for everyday elegance.",
            "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "Printed Shirts",
            "slug": "printed-shirts",
            "description": "Bold abstract and aesthetic print shirts for modern statement style.",
            "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "Linen Shirts",
            "slug": "linen-shirts",
            "description": "Breathable 100% pure linen shirts crafted for summer sophistication.",
            "image_url": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "Gurkha Pants",
            "slug": "gurkha-pants",
            "description": "Iconic double-buckle high-waisted pleated Gurkha trousers.",
            "image_url": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "Old Money Polos",
            "slug": "old-money-polos",
            "description": "Textured knit polo t-shirts embodying classic quiet luxury.",
            "image_url": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "Back Printed Tees",
            "slug": "back-printed-tees",
            "description": "Heavyweight oversized cotton tees featuring premium graphic back prints.",
            "image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "Formal Pants",
            "slug": "formal-pants",
            "description": "Precision tailored formal trousers designed for sharp professionals.",
            "image_url": "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "Denim & Casuals",
            "slug": "denim-casuals",
            "description": "Premium stretch denim jeans and casual trousers.",
            "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "Cord Sets",
            "slug": "cord-sets",
            "description": "Matching shirt and trouser resort co-ord sets.",
            "image_url": "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "Luxury Perfumes",
            "slug": "luxury-perfumes",
            "description": "Captivating long-lasting EDP fragrances for men.",
            "image_url": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800"
        }
    ]

    cat_models = {}
    for c_data in categories_data:
        cat = models.Category(**c_data)
        db.add(cat)
        db.flush()
        cat_models[cat.slug] = cat

    products_data = [
        {
            "title": "Linen Checked Shirt - Olive Navy",
            "slug": "linen-checked-shirt-olive-navy",
            "category_id": cat_models["linen-shirts"].id,
            "price": 1499.0,
            "original_price": 2499.0,
            "badge": "Best Seller",
            "fabric": "100% French Linen",
            "fit": "Regular Resort Fit",
            "description": "Crafted from pure European flax, this lightweight checked linen shirt offers breathable luxury and timeless summer elegance.",
            "image_url": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800",
            "stock": 45,
            "is_featured": True
        },
        {
            "title": "Gurkha High-Waist Formal Trouser - Charcoal Black",
            "slug": "gurkha-high-waist-formal-trouser-black",
            "category_id": cat_models["gurkha-pants"].id,
            "price": 1899.0,
            "original_price": 2999.0,
            "badge": "Signature",
            "fabric": "Poly-Viscose Stretch",
            "fit": "Tailored High-Waist",
            "description": "Featuring signature side buckles and double front pleats, these Gurkha trousers deliver unparalleled elegance and comfortable structure.",
            "image_url": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
            "stock": 30,
            "is_featured": True
        },
        {
            "title": "Old Money Textured Knit Polo - Cream Beige",
            "slug": "old-money-textured-knit-polo-cream",
            "category_id": cat_models["old-money-polos"].id,
            "price": 1299.0,
            "original_price": 1999.0,
            "badge": "Trending",
            "fabric": "100% Combed Cotton Knit",
            "fit": "Slim Vintage Fit",
            "description": "Textured waffle-weave retro polo knit with open collar details. Inspired by Italian riviera street fashion.",
            "image_url": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800",
            "stock": 60,
            "is_featured": True
        },
        {
            "title": "Gothic Cross Graphic Heavyweight Oversized Tee",
            "slug": "gothic-cross-graphic-heavyweight-tee",
            "category_id": cat_models["back-printed-tees"].id,
            "price": 999.0,
            "original_price": 1599.0,
            "badge": "New Drop",
            "fabric": "240 GSM Premium Cotton",
            "fit": "Oversized Streetwear Fit",
            "description": "Heavyweight drop-shoulder t-shirt with detailed screen-printed gothic artwork across the back.",
            "image_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
            "stock": 50,
            "is_featured": True
        },
        {
            "title": "Linen Solid Casual Shirt - Off-White Sand",
            "slug": "linen-solid-casual-shirt-off-white",
            "category_id": cat_models["linen-shirts"].id,
            "price": 1599.0,
            "original_price": 2599.0,
            "badge": "Essential",
            "fabric": "100% Pure Organic Linen",
            "fit": "Modern Relaxed Fit",
            "description": "Minimalist soft linen shirt with a mandarin collar option, designed for effortless vacationing and casual evenings.",
            "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800",
            "stock": 25,
            "is_featured": False
        },
        {
            "title": "F1 Grand Prix Back-Printed Oversized Tee",
            "slug": "f1-grand-prix-back-printed-tee",
            "category_id": cat_models["back-printed-tees"].id,
            "price": 1099.0,
            "original_price": 1799.0,
            "badge": "Hot Item",
            "fabric": "220 GSM Bio-Washed Cotton",
            "fit": "Relaxed Oversized Fit",
            "description": "Motorsport aesthetic graphic print tee celebrating high-velocity race culture.",
            "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
            "stock": 40,
            "is_featured": True
        },
        {
            "title": "Gurkha Pleated Pants - Olive Khaki",
            "slug": "gurkha-pleated-pants-olive-khaki",
            "category_id": cat_models["gurkha-pants"].id,
            "price": 1899.0,
            "original_price": 2899.0,
            "badge": "Popular",
            "fabric": "Cotton Chino Twill",
            "fit": "Tailored Tapered Fit",
            "description": "Classic military-inspired Gurkha waist trousers with adjustable side tabs.",
            "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
            "stock": 35,
            "is_featured": False
        },
        {
            "title": "Resort Linen Blend Co-ord Set - Sage Green",
            "slug": "resort-linen-blend-coord-set-sage",
            "category_id": cat_models["cord-sets"].id,
            "price": 2499.0,
            "original_price": 3999.0,
            "badge": "Limited Edition",
            "fabric": "Linen Cotton Blend",
            "fit": "Relaxed Fit",
            "description": "Matching cuban collar short-sleeve shirt and relaxed drawstring shorts for ultimate leisure luxury.",
            "image_url": "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=800",
            "stock": 18,
            "is_featured": True
        },
        {
            "title": "Snipes Eau de Parfum - Velvet Noir 100ml",
            "slug": "snipes-eau-de-parfum-velvet-noir",
            "category_id": cat_models["luxury-perfumes"].id,
            "price": 1299.0,
            "original_price": 2199.0,
            "badge": "Luxury Fragrance",
            "fabric": "French Fragrance Oils",
            "fit": "Long Lasting (12 hrs+)",
            "description": "An intoxicating blend of smoky amber, dark vanilla, cardamom, and leather notes for evening sophistication.",
            "image_url": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800",
            "stock": 80,
            "is_featured": True
        },
        {
            "title": "Vintage Japanese Stripe Linen Shirt",
            "slug": "vintage-japanese-stripe-linen-shirt",
            "category_id": cat_models["printed-shirts"].id,
            "price": 1599.0,
            "original_price": 2399.0,
            "badge": "New Arrival",
            "fabric": "100% Cotton-Linen Weave",
            "fit": "Casual Relaxed Fit",
            "description": "Vertical pinstriped resort shirt styled with coconut husk buttons.",
            "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
            "stock": 22,
            "is_featured": False
        }
    ]

    for p_data in products_data:
        p = models.Product(**p_data)
        db.add(p)

    db.commit()
    print("Database successfully seeded with Snipes Menswear catalog items.")
    db.close()

if __name__ == "__main__":
    seed_database()
