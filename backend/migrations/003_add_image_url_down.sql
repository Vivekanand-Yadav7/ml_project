-- ==============================================================================
-- Migration: 003_add_image_url_down.sql
-- Description: Rollback image_url from users and orders tables
-- ==============================================================================

ALTER TABLE orders DROP COLUMN IF EXISTS image_url;
ALTER TABLE users DROP COLUMN IF EXISTS image_url;
