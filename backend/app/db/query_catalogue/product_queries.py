"""Product SQL Query Catalogue.

Centralized parameterized SQL queries for the Product resource.
Contains CRUD operations, stock checks, and inventory adjustments.
"""

# Create a new product item
CREATE_PRODUCT = """
INSERT INTO products (name, tag_line, description, nutrients, ingredients, retailer, amount, price, created_at, updated_at)
VALUES (:name, :tag_line, :description, :nutrients, :ingredients, :retailer, :amount, :price, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING id, name, tag_line, description, nutrients, ingredients, retailer, amount, price, created_at, updated_at;
"""

# Fetch product by ID
GET_PRODUCT_BY_ID = """
SELECT id, name, tag_line, description, nutrients, ingredients, retailer, amount, price, created_at, updated_at
FROM products
WHERE id = :id;
"""

# Fetch all products with pagination
GET_ALL_PRODUCTS = """
SELECT id, name, tag_line, description, nutrients, ingredients, retailer, amount, price, created_at, updated_at
FROM products
ORDER BY id ASC
LIMIT :limit OFFSET :offset;
"""

# Fetch products that are in stock (amount > 0)
GET_IN_STOCK_PRODUCTS = """
SELECT id, name, tag_line, description, nutrients, ingredients, retailer, amount, price, created_at, updated_at
FROM products
WHERE amount > 0
ORDER BY id ASC;
"""

# Fetch products by retailer name
GET_PRODUCTS_BY_RETAILER = """
SELECT id, name, tag_line, description, nutrients, ingredients, retailer, amount, price, created_at, updated_at
FROM products
WHERE retailer = :retailer
ORDER BY id ASC;
"""

# Update product attributes
UPDATE_PRODUCT = """
UPDATE products
SET 
    name = COALESCE(:name, name),
    tag_line = COALESCE(:tag_line, tag_line),
    description = COALESCE(:description, description),
    nutrients = COALESCE(:nutrients, nutrients),
    ingredients = COALESCE(:ingredients, ingredients),
    retailer = COALESCE(:retailer, retailer),
    amount = COALESCE(:amount, amount),
    price = COALESCE(:price, price),
    updated_at = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING id, name, tag_line, description, nutrients, ingredients, retailer, amount, price, created_at, updated_at;
"""

# Adjust product inventory by a delta (e.g. -1 for order placement, +1 for cancellation)
ADJUST_PRODUCT_STOCK = """
UPDATE products
SET 
    amount = amount + :delta,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :id AND (amount + :delta) >= 0
RETURNING id, name, amount;
"""

# Delete product by ID
DELETE_PRODUCT = """
DELETE FROM products
WHERE id = :id
RETURNING id;
"""
