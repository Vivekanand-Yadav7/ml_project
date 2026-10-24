"""Database Seeder.

Populates lightweight starter test data:
- Retailer user (Green Harvest Kitchen) with avatar
- Client user (Alex Demo) with avatar
- Curated fresh menu products
- Starter test order with dual foreign keys and delivery image_url

Usage:
    python -m app.db.seed
"""
import hashlib
from decimal import Decimal
from sqlalchemy import text
from app.db.session import engine, SessionLocal
from app.core.config import settings


def hash_pw(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


SEED_USERS = [
    {
        "id": "usr_retailer_01",
        "name": "Green Harvest Kitchen",
        "email": "kitchen@greenharvest.com",
        "password": hash_pw("retailer123"),
        "gender": None,
        "age": None,
        "shipping_address": "78 Market St, Organic District",
        "role": "retailer",
        "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    },
    {
        "id": "usr_client_01",
        "name": "Alex Demo",
        "email": "alex@demo.com",
        "password": hash_pw("client123"),
        "gender": "non-binary",
        "age": 26,
        "shipping_address": "12 Elm Street, Suite 4B",
        "role": "client",
        "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    },
]

SEED_PRODUCTS = [
    {
        "id": 1,
        "name": "Avocado Citrus Crunch Bowl",
        "tag_line": "Refreshing & Zesty",
        "description": "Crispy seasonal greens, ripe Haas avocado, grapefruit wedges, and ginger-lime dressing.",
        "nutrients": "340 kcal, 6g protein, 18g healthy fats",
        "ingredients": "Kale, avocado, ruby grapefruit, sunflower seeds, ginger dressing",
        "retailer": "Green Harvest Kitchen",
        "amount": 25,
        "price": Decimal("13.50"),
    },
    {
        "id": 2,
        "name": "Truffle Wild Mushroom Risotto",
        "tag_line": "Rich & Earthy",
        "description": "Arborio rice slowly simmered with forest porcini, shaved black summer truffles, and aged parmesan.",
        "nutrients": "510 kcal, 14g protein, 22g fats",
        "ingredients": "Arborio rice, porcini mushrooms, truffle oil, parmesan, vegetable broth",
        "retailer": "Green Harvest Kitchen",
        "amount": 15,
        "price": Decimal("18.00"),
    },
    {
        "id": 3,
        "name": "Artisanal Sourdough Flatbread",
        "tag_line": "Wood-fired & Crisp",
        "description": "Naturally fermented 48-hour sourdough topped with heirloom tomatoes, fresh mozzarella, and sweet basil.",
        "nutrients": "420 kcal, 12g protein, 14g fats",
        "ingredients": "Organic flour, heirloom tomatoes, fresh mozzarella, fresh basil, extra virgin olive oil",
        "retailer": "Green Harvest Kitchen",
        "amount": 30,
        "price": Decimal("11.00"),
    },
    {
        "id": 4,
        "name": "Matcha Pistachio Cheesecake",
        "tag_line": "Velvety & Low-Sugar",
        "description": "Ceremonial Uji matcha infused creamy cheesecake on a roasted pistachio and almond crust.",
        "nutrients": "290 kcal, 8g protein, 16g fats",
        "ingredients": "Cashews, coconut cream, Uji matcha, pistachios, dates, agave",
        "retailer": "Green Harvest Kitchen",
        "amount": 18,
        "price": Decimal("8.50"),
    },
]

SEED_ORDERS = [
    {
        "id": "ord_seed_101",
        "client_id": "usr_client_01",
        "retailer_id": "usr_retailer_01",
        "product_id": 1,
        "status": "on the way",
        "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600",
    },
]


def seed_database(db_session=None):
    close_at_end = False
    if db_session is None:
        if not engine or not SessionLocal:
            print("Error: Database connection is not configured.")
            return False
        db = SessionLocal()
        close_at_end = True
    else:
        db = db_session

    print("==> Seeding database with lightweight test data...")

    try:
        # 1. Seed Users
        for u in SEED_USERS:
            db.execute(
                text("""
                    INSERT INTO users (id, name, email, password, gender, age, shipping_address, role, image_url, created_at, updated_at)
                    VALUES (:id, :name, :email, :password, :gender, :age, :shipping_address, :role, :image_url, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;
                """),
                u,
            )

        # 2. Seed Products
        for p in SEED_PRODUCTS:
            db.execute(
                text("""
                    INSERT INTO products (id, name, tag_line, description, nutrients, ingredients, retailer, amount, price, created_at, updated_at)
                    VALUES (:id, :name, :tag_line, :description, :nutrients, :ingredients, :retailer, :amount, :price, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    ON CONFLICT (id) DO NOTHING;
                """),
                {
                    "id": p["id"],
                    "name": p["name"],
                    "tag_line": p["tag_line"],
                    "description": p["description"],
                    "nutrients": p["nutrients"],
                    "ingredients": p["ingredients"],
                    "retailer": p["retailer"],
                    "amount": p["amount"],
                    "price": float(p["price"]),
                },
            )

        # 3. Seed Orders
        for o in SEED_ORDERS:
            db.execute(
                text("""
                    INSERT INTO orders (id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at)
                    VALUES (:id, :client_id, :retailer_id, :product_id, :status, :image_url, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;
                """),
                o,
            )

        db.commit()
        print("Database seeded successfully with users, products, and starter orders!")
        return True
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        return False
    finally:
        if close_at_end:
            db.close()


if __name__ == "__main__":
    seed_database()
