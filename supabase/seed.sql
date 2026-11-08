-- ============================================================================
-- TEGULAATOR / PLAATIJA PLATFORM - SEED DATA
-- supabase/seed.sql
-- ============================================================================

-- Insert mock users (Clients & Contractors)
INSERT INTO public.users (id, email, full_name, phone, role, avatar_url)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'priit.kask@gmail.com', 'Priit Kask', '+372 5123 4567', 'contractor', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'),
    ('22222222-2222-2222-2222-222222222222', 'martin.tamm@plaatimine.ee', 'Martin Tamm', '+372 5598 7654', 'contractor', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'),
    ('33333333-3333-3333-3333-333333333333', 'jaanika.mets@gmail.com', 'Jaanika Mets', '+372 5811 2233', 'client', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Insert Contractor Profiles
INSERT INTO public.contractor_profiles (
    id, company_name, registry_code, bio, experience_years, service_regions,
    accepted_material_standards, hourly_rate, base_sqm_labor_rate, waterproofing_sqm_rate,
    minimum_project_fee, phone_public, website_url, is_verified, rating, review_count, active_leads_count
) VALUES 
    (
        '11111111-1111-1111-1111-111111111111',
        'Nordic Plaat OÜ',
        '14892301',
        'Üle 12 aasta kogemust vannitubade, saunade ja suuremõõtmeliste keraamiliste plaatide paigaldamisel. Sertifitseeritud Mira ja Mapei hüdroisolatsiooni paigaldaja.',
        12,
        ARRAY['Tallinn', 'Harjumaa', 'Raplamaa'],
        ARRAY['Mira', 'Mapei', 'Kiilto'],
        38.00,
        42.00,
        15.00,
        400.00,
        '+372 5123 4567',
        'https://nordicplaat.ee',
        true,
        4.95,
        38,
        4
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Tamm Tiling Solutions OÜ',
        '16209418',
        'Täppistöö ja moodsaim laserloodimise tehnoloogia. Spetsialiseerunud 60x120 ja 120x240 plaatidele ning epoksiidvuukidele.',
        8,
        ARRAY['Tallinn', 'Harjumaa', 'Tartu'],
        ARRAY['Mapei', 'Kiilto'],
        40.00,
        45.00,
        16.00,
        450.00,
        '+372 5598 7654',
        'https://tammtiling.ee',
        true,
        4.88,
        24,
        2
    )
ON CONFLICT (id) DO NOTHING;

-- Insert Portfolio Images
INSERT INTO public.portfolio_images (
    contractor_id, title, description, room_type, tile_type, image_url, before_image_url, tags, display_order
) VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Pirita eramaja vannituba',
        'Mira hüdroisolatsioonisüsteem, 60x60cm kiviimitatsiooniga põrand ja 30x60 heledad seinaplaadid 45° nurkadega.',
        'bathroom',
        'standard',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
        ARRAY['Mira süsteem', 'Kalded trapile', '45° faasid'],
        1
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        'Kadrioru korteri duširuum & WC',
        'Mapei Keraflex Maxi S1 liimiga paigaldatud helehall marmormuster, integreeritud seinanišš.',
        'bathroom',
        'large_format',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&auto=format&fit=crop&q=80',
        NULL,
        ARRAY['Mapei süsteem', 'Seinanišš', 'Marmor'],
        2
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Viimsi spaa-ala ja sauna eesruum',
        '120x60cm tume antratsiit kiltkivi imitatsioon, epoksiidvuugid ja trapikalded 1:50.',
        'sauna',
        'large_format',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        NULL,
        ARRAY['Suurformaat', 'Epoksiidvuuk', 'Kiilto Kerafiber'],
        1
    );

-- Insert Sample Projects / Client Leads
INSERT INTO public.projects (
    id, client_id, client_name, client_email, client_phone, location_city, location_address,
    room_type, floor_sqm, wall_sqm, ceiling_height, preferred_tile_format, preferred_manufacturer,
    substrate_condition, needs_waterproofing, needs_floor_heating_prep, needs_epoxy_grout,
    room_photos, visual_mockup_url, ai_summary,
    ai_estimated_materials_min, ai_estimated_materials_max,
    ai_estimated_labor_min, ai_estimated_labor_max, ai_estimated_duration_days, status
) VALUES 
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '33333333-3333-3333-3333-333333333333',
        'Jaanika Mets',
        'jaanika.mets@gmail.com',
        '+372 5811 2233',
        'Tallinn (Kristiine)',
        'Tedre tn 42',
        'bathroom',
        6.50,
        22.00,
        2.55,
        'standard_30x60',
        'Mira',
        'new_drywall',
        true,
        true,
        false,
        ARRAY['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80'],
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
        'Vannituba 28.5 m² (põrand 6.5 m², seinad 22 m²). Vajalik Mira sertifitseeritud hüdroisolatsioon ja trapikallete viimistlus. Soovitav 30x60 seinale ja 60x60 põrandale.',
        680.00,
        840.00,
        1250.00,
        1550.00,
        5,
        'submitted'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        NULL,
        'Kaur Sepp',
        'kaur.sepp@outlook.com',
        '+372 5344 9988',
        'Rae vald (Peetri)',
        'Kuldala tee 15',
        'kitchen_floor',
        14.20,
        0.00,
        2.70,
        'large_60x60',
        'Mapei',
        'concrete_screed',
        false,
        false,
        false,
        ARRAY['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'],
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
        'Avatud köögi põrand 14.2 m². Betoonpõrand tasandatud, vajalik Mapei Keraflex liimiga 60x60 portselanplaatide paigaldus.',
        320.00,
        420.00,
        580.00,
        740.00,
        3,
        'submitted'
    )
ON CONFLICT (id) DO NOTHING;

-- Insert Ad Campaigns (Milwaukee, Rubi, Mira, Mapei)
INSERT INTO public.ad_campaigns (
    brand_name, category, headline, subheadline, cta_label, target_url,
    badge_text, banner_image_url, accent_color, placement_zone, is_active
) VALUES 
    (
        'Rubi Tools',
        'tile_cutters',
        'Uus RUBI TX-MAX professionaalne plaadilõikur',
        'Kuni 1250mm plaatidele 1200kg murdejõuga. Saadaval kohe kohalikus Decora ja Bauhof esindustes.',
        'Tutvu mudelitega',
        'https://www.rubi.com',
        'Plaatija lemmik 2026',
        'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&auto=format&fit=crop&q=80',
        '#ea580c',
        'contractor_dashboard',
        true
    ),
    (
        'Milwaukee',
        'power_tools',
        'M18 FUEL™ Tolmuvaba teemantlõikus & segumikser',
        'Täielik akutoide plaatimistöödeks. Tolmuvaba siseviimistlus vastavalt rangetele tervisenõuetele.',
        'Vaata kampaaniat',
        'https://www.milwaukeetool.eu',
        'Meistri garantiiga',
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
        '#dc2626',
        'contractor_dashboard',
        true
    ),
    (
        'Mira Byggeprodukter',
        'waterproofing',
        'Mira 4400 multicoat süsteemigarantii',
        'Kasuta terviklahendust (primer 4180 + kangas + 4400 hüdro + z-force liim) ja paku kliendile 10-aastast garantiid.',
        'Arvuta materjalikulu',
        'https://mira.ee',
        'ETAG 022 Sertifitseeritud',
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
        '#2563eb',
        'material_comparison',
        true
    )
ON CONFLICT (id) DO NOTHING;
