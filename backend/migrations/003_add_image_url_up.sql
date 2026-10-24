-- ==============================================================================
-- Migration: 003_add_image_url_up.sql
-- Description: Add image_url to users and orders tables
-- ==============================================================================

-- 1. Add image_url to users table (profile avatar)
ALTER TABLE users ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Add image_url to orders table (delivery proof / item photo)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS image_url TEXT;
