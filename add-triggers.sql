-- Add trigger and notify function to existing counter_app database
-- Run this with: psql -d counter_app -f add-triggers.sql

-- Create trigger function to notify on counter changes
CREATE OR REPLACE FUNCTION notify_counter_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Send notification with the new counter value
    PERFORM pg_notify('counter_updated', NEW.value::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after any UPDATE on counter table
DROP TRIGGER IF EXISTS counter_change_trigger ON counter;
CREATE TRIGGER counter_change_trigger
    AFTER UPDATE ON counter
    FOR EACH ROW
    EXECUTE FUNCTION notify_counter_change();