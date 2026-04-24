
-- Fix function search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Restrict the public listing of bucket contents.
-- We still want public READ on individual image URLs (public bucket), but not allow listing all files.
-- Drop the broad SELECT and replace with one scoped to the owner's own folder for listing purposes.
DROP POLICY IF EXISTS "Public can view listing images" ON storage.objects;
CREATE POLICY "Owners can list their images" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- Public access to individual image URLs continues to work because the bucket is marked public
-- (Supabase serves /object/public/<bucket>/<path> directly without going through RLS).
