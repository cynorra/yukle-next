-- SUPABASE DATABASE MIGRATION SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 0. Drop Dependent Views first
DROP VIEW IF EXISTS favorite_loads CASCADE;
DROP VIEW IF EXISTS driver_offer_details CASCADE;

-- 1. Migrate "loads" Table
-- Add new text columns for global locations
ALTER TABLE loads ADD COLUMN IF NOT EXISTS origin_city TEXT;
ALTER TABLE loads ADD COLUMN IF NOT EXISTS origin_state TEXT;
ALTER TABLE loads ADD COLUMN IF NOT EXISTS origin_country TEXT DEFAULT 'Turkey';
ALTER TABLE loads ADD COLUMN IF NOT EXISTS destination_city TEXT;
ALTER TABLE loads ADD COLUMN IF NOT EXISTS destination_state TEXT;
ALTER TABLE loads ADD COLUMN IF NOT EXISTS destination_country TEXT DEFAULT 'Turkey';

-- Populate existing loads using "cities" and "districts" tables (if records exist)
UPDATE loads l
SET 
  origin_city = c_orig.name,
  origin_state = d_orig.name,
  origin_country = 'Turkey'
FROM cities c_orig
LEFT JOIN districts d_orig ON d_orig.city_id = c_orig.id
WHERE l.origin_city_id = c_orig.id AND (l.origin_district_id IS NULL OR l.origin_district_id = d_orig.id);

UPDATE loads l
SET 
  destination_city = c_dest.name,
  destination_state = d_dest.name,
  destination_country = 'Turkey'
FROM cities c_dest
LEFT JOIN districts d_dest ON d_dest.city_id = c_dest.id
WHERE l.destination_city_id = c_dest.id AND (l.destination_district_id IS NULL OR l.destination_district_id = d_dest.id);

-- Set default placeholder for any records that couldn't be mapped
UPDATE loads SET origin_city = 'Unknown City', origin_country = 'Turkey' WHERE origin_city IS NULL;
UPDATE loads SET destination_city = 'Unknown City', destination_country = 'Turkey' WHERE destination_city IS NULL;

-- Make non-nullable if desired
ALTER TABLE loads ALTER COLUMN origin_city SET NOT NULL;
ALTER TABLE loads ALTER COLUMN origin_country SET NOT NULL;
ALTER TABLE loads ALTER COLUMN destination_city SET NOT NULL;
ALTER TABLE loads ALTER COLUMN destination_country SET NOT NULL;

-- Drop old columns & constraints from loads
ALTER TABLE loads DROP COLUMN IF EXISTS origin_city_id;
ALTER TABLE loads DROP COLUMN IF EXISTS origin_district_id;
ALTER TABLE loads DROP COLUMN IF EXISTS destination_city_id;
ALTER TABLE loads DROP COLUMN IF EXISTS destination_district_id;


-- 2. Migrate "driver_routes" Table
-- Add new text columns for global locations
ALTER TABLE driver_routes ADD COLUMN IF NOT EXISTS origin_city TEXT;
ALTER TABLE driver_routes ADD COLUMN IF NOT EXISTS origin_state TEXT;
ALTER TABLE driver_routes ADD COLUMN IF NOT EXISTS origin_country TEXT DEFAULT 'Turkey';
ALTER TABLE driver_routes ADD COLUMN IF NOT EXISTS destination_city TEXT;
ALTER TABLE driver_routes ADD COLUMN IF NOT EXISTS destination_state TEXT;
ALTER TABLE driver_routes ADD COLUMN IF NOT EXISTS destination_country TEXT DEFAULT 'Turkey';

-- Populate existing driver_routes using "cities" table
UPDATE driver_routes r
SET 
  origin_city = c_orig.name,
  origin_country = 'Turkey'
FROM cities c_orig
WHERE r.origin_city_id = c_orig.id;

UPDATE driver_routes r
SET 
  destination_city = c_dest.name,
  destination_country = 'Turkey'
FROM cities c_dest
WHERE r.destination_city_id = c_dest.id;

-- Set default placeholder for any records that couldn't be mapped
UPDATE driver_routes SET origin_city = 'Unknown City', origin_country = 'Turkey' WHERE origin_city IS NULL;
UPDATE driver_routes SET destination_city = 'Unknown City', destination_country = 'Turkey' WHERE destination_city IS NULL;

-- Make non-nullable
ALTER TABLE driver_routes ALTER COLUMN origin_city SET NOT NULL;
ALTER TABLE driver_routes ALTER COLUMN origin_country SET NOT NULL;
ALTER TABLE driver_routes ALTER COLUMN destination_city SET NOT NULL;
ALTER TABLE driver_routes ALTER COLUMN destination_country SET NOT NULL;

-- Drop old columns & constraints from driver_routes
ALTER TABLE driver_routes DROP COLUMN IF EXISTS origin_city_id;
ALTER TABLE driver_routes DROP COLUMN IF EXISTS destination_city_id;

-- 3. Recreate Views with New Text-based Schema
CREATE OR REPLACE VIEW driver_offer_details AS
SELECT 
  o.id,
  o.load_id,
  o.driver_id,
  o.price,
  o.note,
  o.status,
  o.created_at,
  l.title AS load_title,
  l.status AS load_status,
  l.shipper_id,
  l.price AS load_price,
  l.weight_ton,
  l.pickup_date,
  l.delivery_date,
  l.origin_city AS origin_city_name,
  l.destination_city AS dest_city_name
FROM offers o
JOIN loads l ON o.load_id = l.id;

CREATE OR REPLACE VIEW favorite_loads AS
SELECT 
  f.id AS favorite_id,
  f.user_id,
  f.created_at AS favorited_at,
  l.id AS load_id,
  l.title,
  l.shipper_id,
  l.origin_city,
  l.origin_state,
  l.origin_country,
  l.destination_city,
  l.destination_state,
  l.destination_country,
  l.price,
  l.load_type,
  l.required_truck_type,
  l.weight_ton,
  l.description,
  l.pickup_date,
  l.delivery_date,
  l.tags,
  l.status,
  l.assigned_driver_id,
  l.shipper_confirmed,
  l.driver_confirmed,
  l.shipper_confirmed_at,
  l.driver_confirmed_at,
  l.created_at AS load_created_at
FROM favorites f
JOIN loads l ON f.load_id = l.id;


-- 4. Add Translation columns to "loads" table
ALTER TABLE loads ADD COLUMN IF NOT EXISTS title_translations JSONB DEFAULT '{}'::jsonb;
ALTER TABLE loads ADD COLUMN IF NOT EXISTS description_translations JSONB DEFAULT '{}'::jsonb;


-- 5. Add language column to "blog_posts" table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'tr';

-- 6. Push Notifications Subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
