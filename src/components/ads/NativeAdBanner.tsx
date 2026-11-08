'use client';

import React from 'react';
import { AdCampaign } from '@/lib/supabase/types';
import { SPONSORED_ADS } from '@/lib/ads-data';
import { ExternalLink, Sparkles, ShieldCheck, Wrench } from 'lucide-react';
import { Button } from '../ui/button';

interface NativeAdBannerProps {
  placementZone?: 'contractor_dashboard' | 'quote_builder' | 'material_comparison';
  adId?: string;
  className?: string;
}

export function NativeAdBanner({ placementZone = 'contractor_dashboard', adId, className }: NativeAdBannerProps) {
  const ad: AdCampaign =
    (adId ? SPONSORED_ADS.find((a) => a.id === adId) : null) ||
    SPONSORED_ADS.find((a) => a.placement_zone === placementZone) ||
    SPONSORED_ADS[0];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white shadow-md p-5 sm:p-6 ${
        className || ''
      }`}
    >
      {/* Background ambient pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${ad.banner_image_url})` }}
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: ad.accent_color || '#ea580c' }}
            >
              {ad.badge_text || 'Eripakkumine meistrile'}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> Ametlik partner: {ad.brand_name}
            </span>
          </div>

          <h4 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {ad.category === 'power_tools' && <Wrench className="w-5 h-5 text-red-400" />}
            {ad.category === 'tile_cutters' && <Sparkles className="w-5 h-5 text-orange-400" />}
            {ad.headline}
          </h4>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {ad.subheadline}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={ad.target_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              variant="amber"
              size="default"
              className="gap-2 shadow-lg"
              style={{
                backgroundColor: ad.accent_color || '#ea580c',
              }}
            >
              <span>{ad.cta_label}</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
