-- Enable realtime for voltmarket_listings table
ALTER TABLE voltmarket_listings REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
-- This allows real-time updates for insert, update, and delete operations
ALTER PUBLICATION supabase_realtime ADD TABLE voltmarket_listings;