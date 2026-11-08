-- ============================================================================
-- TEGULAATOR / PLAATIJA PLATFORM - DATABASE SCHEMA
-- Supabase Migration: 20261107000000_init_schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up any existing objects if re-running
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.estimates CASCADE;
DROP TABLE IF EXISTS public.portfolio_images CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.contractor_profiles CASCADE;
DROP TABLE IF EXISTS public.ad_campaigns CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE (Extends Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'contractor', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 2. CONTRACTOR PROFILES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE public.contractor_profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    registry_code TEXT, -- Estonian Äriregistri kood or equivalent
    bio TEXT,
    experience_years INT NOT NULL DEFAULT 1,
    service_regions TEXT[] NOT NULL DEFAULT ARRAY['Tallinn', 'Harjumaa'],
    accepted_material_standards TEXT[] NOT NULL DEFAULT ARRAY['Mira', 'Mapei', 'Kiilto'],
    hourly_rate NUMERIC(10, 2) DEFAULT 35.00,
    base_sqm_labor_rate NUMERIC(10, 2) NOT NULL DEFAULT 38.00, -- Base tiling labor / m²
    waterproofing_sqm_rate NUMERIC(10, 2) NOT NULL DEFAULT 14.00, -- Hydroisolation labor / m²
    minimum_project_fee NUMERIC(10, 2) DEFAULT 350.00,
    phone_public TEXT,
    website_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    active_leads_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 3. PORTFOLIO IMAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE public.portfolio_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID NOT NULL REFERENCES public.contractor_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    room_type TEXT NOT NULL CHECK (room_type IN ('bathroom', 'kitchen', 'hallway', 'sauna', 'terrace', 'commercial')),
    tile_type TEXT NOT NULL CHECK (tile_type IN ('large_format', 'standard', 'mosaic', 'subway', 'stone', 'herringbone')),
    image_url TEXT NOT NULL,
    before_image_url TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 4. PROJECTS / LEADS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    location_city TEXT NOT NULL DEFAULT 'Tallinn',
    location_address TEXT,
    room_type TEXT NOT NULL CHECK (room_type IN ('bathroom', 'wc', 'kitchen_floor', 'kitchen_backsplash', 'hallway', 'sauna', 'terrace', 'commercial')),
    floor_sqm NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    wall_sqm NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    total_sqm NUMERIC(8, 2) GENERATED ALWAYS AS (floor_sqm + wall_sqm) STORED,
    ceiling_height NUMERIC(4, 2) DEFAULT 2.50,
    preferred_tile_format TEXT NOT NULL DEFAULT 'standard_30x60' CHECK (
        preferred_tile_format IN ('mosaic', 'small_15x15', 'standard_30x60', 'large_60x60', 'slab_120x240', 'herringbone')
    ),
    preferred_manufacturer TEXT NOT NULL DEFAULT 'flexible' CHECK (
        preferred_manufacturer IN ('Mira', 'Mapei', 'Kiilto', 'flexible')
    ),
    substrate_condition TEXT NOT NULL DEFAULT 'new_drywall' CHECK (
        substrate_condition IN ('new_drywall', 'concrete_screed', 'old_tiles_strip_needed', 'uneven_old_surface')
    ),
    needs_waterproofing BOOLEAN NOT NULL DEFAULT true,
    needs_floor_heating_prep BOOLEAN NOT NULL DEFAULT false,
    needs_epoxy_grout BOOLEAN NOT NULL DEFAULT false,
    room_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    visual_mockup_url TEXT,
    ai_summary TEXT,
    ai_estimated_materials_min NUMERIC(10, 2),
    ai_estimated_materials_max NUMERIC(10, 2),
    ai_estimated_labor_min NUMERIC(10, 2),
    ai_estimated_labor_max NUMERIC(10, 2),
    ai_estimated_duration_days INT DEFAULT 4,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (
        status IN ('draft', 'submitted', 'in_review', 'quoted', 'contracted', 'completed', 'cancelled')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 5. ESTIMATES / OFFERS TABLE (Contractor Quotes)
-- ----------------------------------------------------------------------------
CREATE TABLE public.estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES public.contractor_profiles(id) ON DELETE CASCADE,
    selected_system TEXT NOT NULL DEFAULT 'Mira' CHECK (selected_system IN ('Mira', 'Mapei', 'Kiilto', 'Custom')),
    labor_cost NUMERIC(10, 2) NOT NULL,
    materials_cost NUMERIC(10, 2) NOT NULL,
    prep_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(10, 2) NOT NULL,
    estimated_start_date DATE,
    estimated_days INT NOT NULL DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (
        status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')
    ),
    line_items JSONB NOT NULL DEFAULT '[]'::JSONB,
    contractor_notes TEXT,
    terms_and_warranty TEXT DEFAULT 'Standard 2-year craftsmanship warranty adhering to RYL / EVS tiling regulations.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 6. MESSAGES TABLE (Project Chat)
-- ----------------------------------------------------------------------------
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachment_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 7. AD CAMPAIGNS TABLE (Monetization: Tool & Material Brands)
-- ----------------------------------------------------------------------------
CREATE TABLE public.ad_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL, -- e.g. 'Milwaukee', 'Rubi Tools', 'Mira Byggeprodukter', 'Mapei'
    category TEXT NOT NULL CHECK (category IN ('power_tools', 'tile_cutters', 'waterproofing', 'workwear', 'lunch_spot')),
    headline TEXT NOT NULL,
    subheadline TEXT NOT NULL,
    cta_label TEXT NOT NULL DEFAULT 'Vaata pakkumist',
    target_url TEXT NOT NULL,
    badge_text TEXT DEFAULT 'Eripakkumine meistrile',
    banner_image_url TEXT NOT NULL,
    accent_color TEXT DEFAULT '#e11d48',
    placement_zone TEXT NOT NULL DEFAULT 'contractor_dashboard' CHECK (
        placement_zone IN ('contractor_dashboard', 'quote_builder', 'material_comparison')
    ),
    is_active BOOLEAN NOT NULL DEFAULT true,
    impressions INT NOT NULL DEFAULT 0,
    clicks INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_city ON public.projects(location_city);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_estimates_project_id ON public.estimates(project_id);
CREATE INDEX idx_estimates_contractor_id ON public.estimates(contractor_id);
CREATE INDEX idx_messages_project_id ON public.messages(project_id);
CREATE INDEX idx_messages_unread ON public.messages(receiver_id) WHERE read_at IS NULL;
CREATE INDEX idx_portfolio_contractor ON public.portfolio_images(contractor_id);

-- ----------------------------------------------------------------------------
-- AUTOMATIC UPDATED_AT TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_contractor_updated_at
BEFORE UPDATE ON public.contractor_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_estimates_updated_at
BEFORE UPDATE ON public.estimates
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Contractor profiles policies
CREATE POLICY "Public can view contractor profiles" ON public.contractor_profiles
    FOR SELECT USING (true);

CREATE POLICY "Contractors can update own profile" ON public.contractor_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Contractors can insert own profile" ON public.contractor_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Portfolio images policies
CREATE POLICY "Public can view portfolio images" ON public.portfolio_images
    FOR SELECT USING (true);

CREATE POLICY "Contractors can manage own portfolio" ON public.portfolio_images
    FOR ALL USING (auth.uid() = contractor_id);

-- Projects policies
CREATE POLICY "Anyone can view submitted projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create a new project/lead" ON public.projects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Clients can update their own project" ON public.projects
    FOR UPDATE USING (auth.uid() = client_id OR client_id IS NULL);

-- Estimates policies
CREATE POLICY "Clients and contractors can view relevant estimates" ON public.estimates
    FOR SELECT USING (
        auth.uid() = contractor_id OR 
        auth.uid() IN (SELECT client_id FROM public.projects WHERE projects.id = estimates.project_id) OR
        auth.uid() IS NULL -- allows guest clients to see quote preview
    );

CREATE POLICY "Contractors can insert and manage estimates" ON public.estimates
    FOR ALL USING (auth.uid() = contractor_id);

-- Messages policies
CREATE POLICY "Participants can view project messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Participants can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Ads policies
CREATE POLICY "Public can view active ads" ON public.ad_campaigns
    FOR SELECT USING (is_active = true);
