-- ==============================================================================
-- Migration: 001_initial_schema_down.sql
-- Description: Rollback of initial schema (orders, products, users and triggers)
-- ==============================================================================

-- 1. Drop Triggers
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- 2. Drop Function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 3. Drop Tables in reverse dependency order
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
