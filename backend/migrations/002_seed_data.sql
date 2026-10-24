-- ==============================================================================
-- Migration / Seed: 002_seed_data.sql
-- Description: Lightweight test data for Users, Products, and Orders with image_url
-- ==============================================================================

-- 1. Seed Users (Retailer and Client)
INSERT INTO users (id, name, email, password, gender, age, shipping_address, role, image_url, created_at, updated_at)
VALUES 
    ('usr_retailer_01', 'Green Harvest Kitchen', 'kitchen@greenharvest.com', '59781845f7bb9c961e3895e72e15bc9664dae5ac9a2cfb9c2409f8749e797825', NULL, NULL, '78 Market St, Organic District', 'retailer', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('usr_client_01', 'Alex Demo', 'alex@demo.com', 'b616a2ef776e0ff05e6b010f3c09930fca5665fb18b320d3674d825c96b79789', 'non-binary', 26, '12 Elm Street, Suite 4B', 'client', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 2. Seed Products
INSERT INTO products (id, name, tag_line, description, nutrients, ingredients, retailer, amount, price, created_at, updated_at)
VALUES
    (1, 'Avocado Citrus Crunch Bowl', 'Refreshing & Zesty', 'Crispy seasonal greens, ripe Haas avocado, grapefruit wedges, and ginger-lime dressing.', '340 kcal, 6g protein, 18g healthy fats', 'Kale, avocado, ruby grapefruit, sunflower seeds, ginger dressing', 'Green Harvest Kitchen', 25, 13.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Truffle Wild Mushroom Risotto', 'Rich & Earthy', 'Arborio rice slowly simmered with forest porcini, shaved black summer truffles, and aged parmesan.', '510 kcal, 14g protein, 22g fats', 'Arborio rice, porcini mushrooms, truffle oil, parmesan, vegetable broth', 'Green Harvest Kitchen', 15, 18.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Artisanal Sourdough Flatbread', 'Wood-fired & Crisp', 'Naturally fermented 48-hour sourdough topped with heirloom tomatoes, fresh mozzarella, and sweet basil.', '420 kcal, 12g protein, 14g fats', 'Organic flour, heirloom tomatoes, fresh mozzarella, fresh basil, extra virgin olive oil', 'Green Harvest Kitchen', 30, 11.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'Matcha Pistachio Cheesecake', 'Velvety & Low-Sugar', 'Ceremonial Uji matcha infused creamy cheesecake on a roasted pistachio and almond crust.', '290 kcal, 8g protein, 16g fats', 'Cashews, coconut cream, Uji matcha, pistachios, dates, agave', 'Green Harvest Kitchen', 18, 8.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 3. Reset product id sequence (PostgreSQL auto-increment)
SELECT setval(pg_get_serial_sequence('products', 'id'), coalesce(max(id), 1)) FROM products;

-- 4. Seed Orders
INSERT INTO orders (id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at)
VALUES
    ('ord_seed_101', 'usr_client_01', 'usr_retailer_01', 1, 'on the way', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;
