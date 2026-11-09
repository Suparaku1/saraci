CREATE TABLE public.before_after (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  before_path text NOT NULL,
  after_path text NOT NULL,
  consent_confirmed boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.before_after TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.before_after TO authenticated;
GRANT ALL ON public.before_after TO service_role;
ALTER TABLE public.before_after ENABLE ROW LEVEL SECURITY;
CREATE POLICY ba_public_read ON public.before_after FOR SELECT TO anon, authenticated USING (published AND consent_confirmed);
CREATE POLICY ba_admin_all ON public.before_after FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin') AND consent_confirmed);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  display_name text NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL CHECK (char_length(comment) BETWEEN 5 AND 1500),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY rv_public_read ON public.reviews FOR SELECT TO anon, authenticated USING (approved);
CREATE POLICY rv_own_read ON public.reviews FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY rv_own_insert ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND approved = false);
CREATE POLICY rv_admin_all ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY gallery_public_read ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY gallery_admin_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY gallery_admin_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND public.has_role(auth.uid(),'admin'));