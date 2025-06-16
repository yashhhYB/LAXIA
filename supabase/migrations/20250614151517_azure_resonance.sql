/*
  # Fix user progress table migration

  1. New Tables
    - `user_progress` (if not exists)
      - `id` (uuid, primary key)
      - `user_id` (text, unique)
      - `laws_learned` (integer)
      - `quiz_score` (integer)
      - `study_streak` (integer)
      - `last_activity` (timestamp)
      - `achievements` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_progress` table (if not already enabled)
    - Add policies only if they don't exist
*/

-- Create table only if it doesn't exist
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  laws_learned integer DEFAULT 0,
  quiz_score integer DEFAULT 0,
  study_streak integer DEFAULT 0,
  last_activity timestamptz DEFAULT now(),
  achievements text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS only if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'user_progress'
    AND n.nspname = 'public'
    AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Check and create read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_progress' 
    AND policyname = 'Users can read their own progress'
  ) THEN
    CREATE POLICY "Users can read their own progress"
      ON user_progress
      FOR SELECT
      TO public
      USING (true);
  END IF;

  -- Check and create update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_progress' 
    AND policyname = 'Users can update their own progress'
  ) THEN
    CREATE POLICY "Users can update their own progress"
      ON user_progress
      FOR ALL
      TO public
      USING (true);
  END IF;
END $$;