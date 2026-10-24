"""Order SQL Query Catalogue.

Centralized parameterized SQL queries for the Order resource.
Contains order lifecycle operations with dual foreign keys (client_id, retailer_id),
relations joins, image_url support, and status updates.
"""

# Create an order with both client and retailer foreign keys and optional image_url
CREATE_ORDER = """
INSERT INTO orders (id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at)
VALUES (:id, :client_id, :retailer_id, :product_id, :status, :image_url, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at;
"""

# Fetch order by ID
GET_ORDER_BY_ID = """
SELECT id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at
FROM orders
WHERE id = :id;
"""

# Fetch order with rich joined details (client user, retailer user, product, and image_url)
GET_ORDER_WITH_DETAILS = """
SELECT 
    o.id,
    o.status,
    o.image_url,
    o.created_at,
    o.updated_at,
    c.id AS client_id,
    c.name AS client_name,
    c.email AS client_email,
    c.image_url AS client_image_url,
    c.shipping_address AS client_address,
    r.id AS retailer_id,
    r.name AS retailer_name,
    p.id AS product_id,
    p.name AS product_name,
    p.price AS product_price
FROM orders o
JOIN users c ON o.client_id = c.id
JOIN users r ON o.retailer_id = r.id
JOIN products p ON o.product_id = p.id
WHERE o.id = :id;
"""

# Fetch orders for a specific client
GET_ORDERS_BY_CLIENT = """
SELECT id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at
FROM orders
WHERE client_id = :client_id
ORDER BY created_at DESC;
"""

# Fetch orders for a specific retailer
GET_ORDERS_BY_RETAILER = """
SELECT id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at
FROM orders
WHERE retailer_id = :retailer_id
ORDER BY created_at DESC;
"""

# Fetch orders where user is either client OR retailer
GET_ORDERS_BY_USER = """
SELECT id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at
FROM orders
WHERE client_id = :user_id OR retailer_id = :user_id
ORDER BY created_at DESC
LIMIT :limit OFFSET :offset;
"""

# Fetch all orders with pagination
GET_ALL_ORDERS = """
SELECT id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at
FROM orders
ORDER BY created_at DESC
LIMIT :limit OFFSET :offset;
"""

# Update order status / image_url
UPDATE_ORDER_STATUS = """
UPDATE orders
SET 
    status = COALESCE(:status, status),
    retailer_id = COALESCE(:retailer_id, retailer_id),
    product_id = COALESCE(:product_id, product_id),
    image_url = COALESCE(:image_url, image_url),
    updated_at = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING id, client_id, retailer_id, product_id, status, image_url, created_at, updated_at;
"""

# Delete / Cancel order
DELETE_ORDER = """
DELETE FROM orders
WHERE id = :id
RETURNING id, product_id;
"""
