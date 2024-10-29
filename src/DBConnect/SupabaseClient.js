import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://szksothoimyzawwdympv.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6a3NvdGhvaW15emF3d2R5bXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4ODU4NzEsImV4cCI6MjA0NDQ2MTg3MX0.7KNyc0NSLqUj5cz8g02fyliIOPgZN6i7eJJLQxFznYQ"
);
