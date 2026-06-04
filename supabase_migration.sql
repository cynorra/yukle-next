-- SUPABASE DATABASE MIGRATION SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR

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
