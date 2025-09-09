-- Fix missing created_at column in voltmarket_watchlist table
-- The logs show errors about this missing column
ALTER TABLE voltmarket_watchlist RENAME COLUMN added_at TO created_at;