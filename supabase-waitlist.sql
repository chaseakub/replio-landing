-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/epjkxahwfhwnbilqhihy/sql

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  source text DEFAULT 'landing_page',
  created_at timestamptz DEFAULT now()
);

-- Allow anonymous inserts (from the landing page)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only you (authenticated) can read the waitlist
CREATE POLICY "Only authenticated can read" ON waitlist
  FOR SELECT TO authenticated
  USING (true);
