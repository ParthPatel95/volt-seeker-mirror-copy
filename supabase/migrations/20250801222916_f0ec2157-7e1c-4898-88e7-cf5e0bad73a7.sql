-- Let's manually check and add the foreign key constraint
DO $$
BEGIN
    -- Check if the foreign key exists and add it if it doesn't
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'social_posts_user_id_fkey' 
        AND conrelid = 'social_posts'::regclass
    ) THEN
        ALTER TABLE public.social_posts 
        ADD CONSTRAINT social_posts_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;