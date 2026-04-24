
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.listing_status AS ENUM ('draft','pending_review','active','sold','archived','rejected');
CREATE TYPE public.asset_category AS ENUM ('real_estate','vehicle','equipment','inventory','business','other');
CREATE TYPE public.offer_status AS ENUM ('pending','countered','accepted','declined','withdrawn');
CREATE TYPE public.rfq_status AS ENUM ('open','closed');
CREATE TYPE public.ticket_status AS ENUM ('open','in_progress','resolved','closed');
CREATE TYPE public.fee_type AS ENUM ('listing_fee','unlock_fee','offer_fee','rfq_response_fee','subscription','referral_commission');
CREATE TYPE public.fee_status AS ENUM ('pending','paid','failed','refunded');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  display_name TEXT,
  phone TEXT,
  city TEXT,
  bio TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'ar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles (separate table - critical security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Listings
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.asset_category NOT NULL,
  city TEXT,
  asking_price NUMERIC(14,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Public preview vs private fields
  public_summary TEXT,
  private_details TEXT, -- only visible after unlock
  contact_info TEXT,    -- only visible after unlock
  status public.listing_status NOT NULL DEFAULT 'pending_review',
  ai_integrity_score INT,
  ai_integrity_notes TEXT,
  view_count INT NOT NULL DEFAULT 0,
  listing_fee_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_seller ON public.listings(seller_id);

-- Listing unlocks (paid by buyer)
CREATE TABLE public.listing_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unlock_level INT NOT NULL DEFAULT 1, -- 1=details, 2=contact
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(listing_id, buyer_id, unlock_level)
);
ALTER TABLE public.listing_unlocks ENABLE ROW LEVEL SECURITY;

-- Offers
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  message TEXT,
  parent_offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  status public.offer_status NOT NULL DEFAULT 'pending',
  fee_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- RFQ / Demand posts
CREATE TABLE public.rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.asset_category NOT NULL,
  city TEXT,
  budget_min NUMERIC(14,2),
  budget_max NUMERIC(14,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  status public.rfq_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.rfq_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  proposed_price NUMERIC(14,2),
  fee_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rfq_responses ENABLE ROW LEVEL SECURITY;

-- Verifier / Guarantor referrals (informational only)
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  referral_type TEXT NOT NULL, -- 'verifier' | 'guarantor'
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'requested',
  commission_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Support tickets (platform issues only)
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status public.ticket_status NOT NULL DEFAULT 'open',
  admin_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Platform ratings (user rates MIZAN, not other users)
CREATE TABLE public.platform_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.platform_ratings ENABLE ROW LEVEL SECURITY;

-- Fee transactions (Stripe records, no internal wallet)
CREATE TABLE public.fee_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fee_type public.fee_type NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status public.fee_status NOT NULL DEFAULT 'pending',
  related_id UUID, -- listing/offer/rfq id
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fee_transactions ENABLE ROW LEVEL SECURITY;

-- Trigger: auto-create profile + default user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, display_name, preferred_language)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'preferred_language','ar'));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ========== RLS POLICIES ==========

-- profiles: anyone authenticated can view basic profile, only owner edits
CREATE POLICY "Profiles are viewable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- user_roles: users see their own; admins see all (avoid recursion via has_role)
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- listings: active listings visible to all authenticated; sellers see own; admins see all
CREATE POLICY "View active listings" ON public.listings FOR SELECT TO authenticated USING (status = 'active' OR seller_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Sellers create listings" ON public.listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers update own listings" ON public.listings FOR UPDATE TO authenticated USING (auth.uid() = seller_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Sellers delete own listings" ON public.listings FOR DELETE TO authenticated USING (auth.uid() = seller_id OR public.has_role(auth.uid(),'admin'));

-- listing_unlocks: buyer sees own; seller sees who unlocked their listing; admins all
CREATE POLICY "Buyer view own unlocks" ON public.listing_unlocks FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR public.has_role(auth.uid(),'admin') OR auth.uid() IN (SELECT seller_id FROM public.listings WHERE id = listing_id));
CREATE POLICY "Buyer create unlock" ON public.listing_unlocks FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- offers: buyer & seller of listing can see; admins all
CREATE POLICY "View related offers" ON public.offers FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR auth.uid() IN (SELECT seller_id FROM public.listings WHERE id = listing_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Buyer create offer" ON public.offers FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Update related offer" ON public.offers FOR UPDATE TO authenticated USING (auth.uid() = buyer_id OR auth.uid() IN (SELECT seller_id FROM public.listings WHERE id = listing_id));

-- rfqs: open rfqs visible to authenticated
CREATE POLICY "View open rfqs" ON public.rfqs FOR SELECT TO authenticated USING (status = 'open' OR buyer_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Buyer create rfq" ON public.rfqs FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyer update own rfq" ON public.rfqs FOR UPDATE TO authenticated USING (auth.uid() = buyer_id OR public.has_role(auth.uid(),'admin'));

-- rfq_responses: buyer of rfq + responder + admin
CREATE POLICY "View rfq responses" ON public.rfq_responses FOR SELECT TO authenticated USING (auth.uid() = responder_id OR auth.uid() IN (SELECT buyer_id FROM public.rfqs WHERE id = rfq_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Create rfq response" ON public.rfq_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = responder_id);

-- referrals
CREATE POLICY "View own referrals" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = requester_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Create referral" ON public.referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id);

-- support tickets
CREATE POLICY "View own tickets" ON public.support_tickets FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Create own ticket" ON public.support_tickets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin update tickets" ON public.support_tickets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR auth.uid() = user_id);

-- platform ratings
CREATE POLICY "View own rating" ON public.platform_ratings FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Create own rating" ON public.platform_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- fee transactions
CREATE POLICY "View own fees" ON public.fee_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Create own fee" ON public.fee_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Storage bucket for listing images
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images','listing-images', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public can view listing images" ON storage.objects FOR SELECT USING (bucket_id = 'listing-images');
CREATE POLICY "Authenticated can upload listing images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'listing-images');
CREATE POLICY "Owner can update listing images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner can delete listing images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
