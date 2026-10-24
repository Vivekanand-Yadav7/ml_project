"""Trigger & DDL SQL Query Catalogue.

Contains PostgreSQL procedural triggers, functions, and constraint definitions.
Acts as a reference for database dynamics, on-delete cascading, and audit automation.
"""

# 1. Automatic updated_at trigger function
CREATE_UPDATED_AT_FUNCTION = """
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
"""

# 2. Attach updated_at trigger to users table
ATTACH_USERS_TIMESTAMP_TRIGGER = """
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

# 3. Attach updated_at trigger to products table
ATTACH_PRODUCTS_TIMESTAMP_TRIGGER = """
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

# 4. Attach updated_at trigger to orders table
ATTACH_ORDERS_TIMESTAMP_TRIGGER = """
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

# 5. Inventory Protection Trigger: Prevent order creation if stock is 0
INVENTORY_GUARD_TRIGGER_FUNCTION = """
CREATE OR REPLACE FUNCTION check_product_stock_before_order()
RETURNS TRIGGER AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    SELECT amount INTO current_stock FROM products WHERE id = NEW.product_id;
    IF current_stock IS NULL THEN
        RAISE EXCEPTION 'Product with id % does not exist.', NEW.product_id;
    END IF;
    IF current_stock <= 0 THEN
        RAISE EXCEPTION 'Product with id % is out of stock.', NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
"""

ATTACH_INVENTORY_GUARD_TRIGGER = """
DROP TRIGGER IF EXISTS check_stock_before_order ON orders;
CREATE TRIGGER check_stock_before_order
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION check_product_stock_before_order();
"""
