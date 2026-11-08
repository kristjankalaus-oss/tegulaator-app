'use client';

import React from 'react';
import { ProjectLead } from '@/lib/supabase/types';
import { formatCurrency } from '@/lib/utils';
import {
  MapPin,
  Clock,
  Sparkles,
  Phone,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/button';

interface LeadCardProps {
  lead: ProjectLead;
  onOpenQuoteEditor: (lead: ProjectLead) => void;
  onOpenChat: (lead: ProjectLead) => void;
}

export function LeadCard({ lead, onOpenQuoteEditor, onOpenChat }: LeadCardProps) {
  const totalSqm = lead.total_sqm || lead.floor_sqm + lead.wall_sqm;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs hover:border-stone-300 hover:shadow-sm transition-all space-y-4">
      {/* Top Header: Client & Location */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 font-bold text-sm">
            {lead.client_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-stone-900 text-base">{lead.client_name}</h4>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Uus tööpakkumine
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" /> {lead.location_city}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {new Date(lead.created_at).toLocaleDateString('et-EE', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Phone Call action */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${lead.client_phone}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lead.client_phone}</span>
          </a>
        </div>
      </div>

      {/* Main Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl bg-stone-50 p-2.5">
          <span className="text-stone-500 block text-[11px]">Ruum & pindala</span>
          <strong className="text-stone-900 text-sm block capitalize mt-0.5">
            {lead.room_type} ({totalSqm.toFixed(1)} m²)
          </strong>
          <span className="text-[10px] text-stone-500">
            Põrand {lead.floor_sqm} m² | Sein {lead.wall_sqm} m²
          </span>
        </div>

        <div className="rounded-xl bg-stone-50 p-2.5">
          <span className="text-stone-500 block text-[11px]">Plaadi formaat</span>
          <strong className="text-stone-900 text-sm block mt-0.5">
            {lead.preferred_tile_format === 'standard_30x60' && '30x60 cm'}
            {lead.preferred_tile_format === 'large_60x60' && '60x60 cm'}
            {lead.preferred_tile_format === 'slab_120x240' && 'XXL 120x240'}
            {lead.preferred_tile_format === 'herringbone' && 'Kalasaba'}
            {lead.preferred_tile_format === 'mosaic' && 'Mosaiik'}
          </strong>
          <span className="text-[10px] text-stone-500">
            {lead.needs_waterproofing ? 'Vajab hüdroisolatsiooni' : 'Kuiv ruum'}
          </span>
        </div>

        <div className="rounded-xl bg-stone-50 p-2.5">
          <span className="text-stone-500 block text-[11px]">Eelistatud keemia</span>
          <strong className="text-stone-900 text-sm block mt-0.5 text-blue-700">
            {lead.preferred_manufacturer} süsteem
          </strong>
          <span className="text-[10px] text-stone-500">
            Aluspind: {lead.substrate_condition === 'new_drywall' ? 'Sirge kips' : 'Betoon / vana plaat'}
          </span>
        </div>

        <div className="rounded-xl bg-orange-50/70 border border-orange-200/60 p-2.5">
          <span className="text-orange-800 block text-[11px] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-600" /> AI kalkulatsioon
          </span>
          <strong className="text-orange-950 text-sm block mt-0.5">
            {lead.ai_estimated_labor_min && lead.ai_estimated_materials_min
              ? `${formatCurrency(lead.ai_estimated_labor_min + lead.ai_estimated_materials_min)} – ${formatCurrency(
                  (lead.ai_estimated_labor_max || 0) + (lead.ai_estimated_materials_max || 0)
                )}`
              : 'Koostamisel'}
          </strong>
          <span className="text-[10px] text-orange-700">
            Töö ~{lead.ai_estimated_duration_days || 5} päeva
          </span>
        </div>
      </div>

      {/* Photo Preview & Client Note */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {lead.room_photos && lead.room_photos.length > 0 ? (
            <div className="flex items-center gap-2">
              {lead.room_photos.slice(0, 2).map((photo, i) => (
                <div key={i} className="h-12 w-16 rounded-lg overflow-hidden border border-stone-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="Foto objektist" className="h-full w-full object-cover" />
                </div>
              ))}
              <span className="text-xs text-stone-500 font-medium">
                {lead.room_photos.length} fotot lisatud
              </span>
            </div>
          ) : (
            <span className="text-xs text-stone-400 italic">Fotod puuduvad</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChat(lead)}
            className="flex-1 sm:flex-none text-xs"
          >
            <span>Vestle kliendiga</span>
          </Button>

          <Button
            variant="amber"
            size="sm"
            onClick={() => onOpenQuoteEditor(lead)}
            className="flex-1 sm:flex-none text-xs gap-1.5 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1-Kliki pakkumise koostaja</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
