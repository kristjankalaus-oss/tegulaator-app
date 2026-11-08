export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'client' | 'contractor' | 'admin';

export type RoomType =
  | 'bathroom'
  | 'wc'
  | 'kitchen_floor'
  | 'kitchen_backsplash'
  | 'hallway'
  | 'sauna'
  | 'terrace'
  | 'commercial';

export type TileFormat =
  | 'mosaic'
  | 'small_15x15'
  | 'standard_30x60'
  | 'large_60x60'
  | 'slab_120x240'
  | 'herringbone';

export type MaterialManufacturer = 'Mira' | 'Mapei' | 'Kiilto' | 'flexible';

export type SubstrateCondition =
  | 'new_drywall'
  | 'concrete_screed'
  | 'old_tiles_strip_needed'
  | 'uneven_old_surface';

export type ProjectStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'quoted'
  | 'contracted'
  | 'completed'
  | 'cancelled';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: UserRole;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractorProfile {
  id: string;
  company_name: string;
  registry_code?: string | null;
  bio?: string | null;
  experience_years: number;
  service_regions: string[];
  accepted_material_standards: string[];
  hourly_rate: number;
  base_sqm_labor_rate: number;
  waterproofing_sqm_rate: number;
  minimum_project_fee: number;
  phone_public?: string | null;
  website_url?: string | null;
  is_verified: boolean;
  rating: number;
  review_count: number;
  active_leads_count: number;
  subscription_status: 'free' | 'pro';
  subscription_expires_at?: string | null;
  payment_provider_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioImage {
  id: string;
  contractor_id: string;
  title: string;
  description?: string | null;
  room_type: string;
  tile_type: string;
  image_url: string;
  before_image_url?: string | null;
  tags: string[];
  display_order: number;
  created_at: string;
}

export interface ProjectLead {
  id: string;
  client_id?: string | null;
  client_name: string;
  client_email: string;
  client_phone: string;
  location_city: string;
  location_address?: string | null;
  room_type: RoomType;
  floor_sqm: number;
  wall_sqm: number;
  total_sqm?: number;
  ceiling_height: number;
  preferred_tile_format: TileFormat;
  preferred_manufacturer: MaterialManufacturer;
  substrate_condition: SubstrateCondition;
  needs_waterproofing: boolean;
  needs_floor_heating_prep: boolean;
  needs_epoxy_grout: boolean;
  room_photos: string[];
  visual_mockup_url?: string | null;
  ai_summary?: string | null;
  ai_estimated_materials_min?: number | null;
  ai_estimated_materials_max?: number | null;
  ai_estimated_labor_min?: number | null;
  ai_estimated_labor_max?: number | null;
  ai_estimated_duration_days?: number | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface QuoteLineItem {
  id: string;
  category: 'waterproofing' | 'tile_adhesive' | 'grout' | 'prep_materials' | 'labor' | 'special';
  name: string;
  quantity: number;
  unit: 'm²' | 'kg' | 'tk' | 'h' | 'komplekt';
  unit_price: number;
  total_price: number;
  brand?: string;
  is_labor?: boolean;
}

export interface EstimateQuote {
  id: string;
  project_id: string;
  contractor_id: string;
  selected_system: 'Mira' | 'Mapei' | 'Kiilto' | 'Custom';
  labor_cost: number;
  materials_cost: number;
  prep_cost: number;
  total_price: number;
  estimated_start_date?: string | null;
  estimated_days: number;
  status: QuoteStatus;
  line_items: QuoteLineItem[];
  contractor_notes?: string | null;
  terms_and_warranty?: string | null;
  contractor?: ContractorProfile;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  attachment_urls?: string[];
  read_at?: string | null;
  created_at: string;
}

export interface AdCampaign {
  id: string;
  brand_name: string;
  category: 'power_tools' | 'tile_cutters' | 'waterproofing' | 'workwear' | 'lunch_spot';
  headline: string;
  subheadline: string;
  cta_label: string;
  target_url: string;
  badge_text?: string;
  banner_image_url: string;
  accent_color?: string;
  placement_zone: 'contractor_dashboard' | 'quote_builder' | 'material_comparison';
  is_active: boolean;
  impressions?: number;
  clicks?: number;
}

export interface ContractorReview {
  id: string;
  contractor_id: string;
  client_name: string;
  client_city?: string;
  rating: number; // 1 to 5
  created_at: string;
  project_title: string;
  material_system?: string;
  comment: string;
  verified: boolean;
  categories?: {
    quality: number;
    punctuality: number;
    cleanliness: number;
    communication: number;
  };
}

export type PricingTier = 'free' | 'pro';

export interface ContractorSubscriptionPlan {
  id: PricingTier;
  name: string;
  price_monthly: number;
  billing_period: 'monthly' | 'yearly';
  features: string[];
  max_quotes_per_month: number | 'unlimited';
  is_popular?: boolean;
}

