'use client';

import React, { useState } from 'react';
import { ProjectLead, EstimateQuote } from '@/lib/supabase/types';
import { calculateDetailedEstimate } from '@/lib/estimation-engine';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Send,
  Sliders,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../ui/button';

interface QuoteEditorModalProps {
  lead: ProjectLead | null;
  onClose: () => void;
  onQuoteSent: (quote: EstimateQuote) => void;
}

export function QuoteEditorModal({ lead, onClose, onQuoteSent }: QuoteEditorModalProps) {
  // Fine-tuning interactive controls (hooks at top before any condition)
  const [laborSqmRate, setLaborSqmRate] = useState<number>(42);
  const [hydroSqmRate, setHydroSqmRate] = useState<number>(15);
  const [prepFee, setPrepFee] = useState<number>(
    lead?.substrate_condition === 'new_drywall' ? 0 : 150
  );
  const [selectedSystem, setSelectedSystem] = useState<'Mira' | 'Mapei' | 'Kiilto'>(
    lead?.preferred_manufacturer === 'flexible' || !lead?.preferred_manufacturer
      ? 'Mira'
      : (lead.preferred_manufacturer as 'Mira' | 'Mapei' | 'Kiilto')
  );
  const [startDate, setStartDate] = useState<string>('2026-11-20');
  const [estimatedDays, setEstimatedDays] = useState<number>(5);
  const [contractorNotes, setContractorNotes] = useState<string>(
    lead
      ? `Tere, ${lead.client_name}! Koostasin pakkumise Teie ruumi (${(
          lead.total_sqm || lead.floor_sqm + lead.wall_sqm
        ).toFixed(1)} m²) plaatimistöödele. Kasutame sertifitseeritud ${selectedSystem} süsteemi koos tootja 10a garantiiga.`
      : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!lead) return null;

  const totalSqm = lead.total_sqm || lead.floor_sqm + lead.wall_sqm;

  // Recalculate live estimate with contractor's custom rates
  const liveEstimate = calculateDetailedEstimate({
    floorSqm: lead.floor_sqm,
    wallSqm: lead.wall_sqm,
    roomType: lead.room_type,
    tileFormat: lead.preferred_tile_format,
    preferredManufacturer: selectedSystem,
    substrateCondition: lead.substrate_condition,
    needsWaterproofing: lead.needs_waterproofing,
    needsFloorHeatingPrep: lead.needs_floor_heating_prep,
    needsEpoxyGrout: lead.needs_epoxy_grout,
    customLaborSqmRate: laborSqmRate,
  });

  const totalLabor = Math.round(
    totalSqm * laborSqmRate + (lead.needs_waterproofing ? totalSqm * hydroSqmRate : 0)
  );
  const totalMaterials = liveEstimate.materialsCost;
  const grandTotal = totalLabor + totalMaterials + prepFee;

  const handleSendOfficialOffer = async () => {
    setIsSubmitting(true);

    const quotePayload: EstimateQuote = {
      id: 'quote-' + Date.now(),
      project_id: lead.id,
      contractor_id: '11111111-1111-1111-1111-111111111111',
      selected_system: selectedSystem,
      labor_cost: totalLabor,
      materials_cost: totalMaterials,
      prep_cost: prepFee,
      total_price: grandTotal,
      estimated_start_date: startDate,
      estimated_days: estimatedDays,
      status: 'sent',
      contractor_notes: contractorNotes,
      terms_and_warranty: '2-aastane ehitusgarantii vastavalt EVS 843 standardile. 10a tootjagarantii.',
      line_items: liveEstimate.lineItems,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_quote', quote: quotePayload }),
      });

      setIsSuccess(true);
      setTimeout(() => {
        onQuoteSent(quotePayload);
      }, 1200);
    } catch {
      setIsSuccess(true);
      setTimeout(() => {
        onQuoteSent(quotePayload);
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">
                Pakkumise 1-Kliki Koostaja & Peenhäälestus
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Objekt: {lead.client_name} ({lead.location_city}) • {totalSqm.toFixed(1)} m²
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top AI Conversion Banner */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 leading-relaxed">
              <strong>AI eelandmed on automaatselt üle kantud.</strong> Kohanda allpool oma tunnihinda või ruutmeetritasu, lisa aluspinna ettevalmistustasud ning vali eelistatud ehituskeemia pakett ({selectedSystem}).
            </div>
          </div>

          {/* Pricing Fine-Tuning Sliders & Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Labor rate */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-700">Plaatimistöö tasu / m²</span>
                <span className="font-bold text-orange-600 text-sm">{laborSqmRate} €/m²</span>
              </div>
              <input
                type="range"
                min="25"
                max="85"
                step="1"
                value={laborSqmRate}
                onChange={(e) => setLaborSqmRate(parseInt(e.target.value) || 35)}
                className="w-full accent-orange-600"
              />
              <div className="text-[10px] text-stone-500">
                Põrand + seinad kokku: {formatCurrency(Math.round(totalSqm * laborSqmRate))}
              </div>
            </div>

            {/* Waterproofing rate */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-700">Hüdroisolatsiooni töö / m²</span>
                <span className="font-bold text-blue-600 text-sm">{hydroSqmRate} €/m²</span>
              </div>
              <input
                type="range"
                min="8"
                max="25"
                step="1"
                value={hydroSqmRate}
                onChange={(e) => setHydroSqmRate(parseInt(e.target.value) || 14)}
                className="w-full accent-blue-600"
              />
              <div className="text-[10px] text-stone-500">
                2 kihti + kangad: {formatCurrency(Math.round(totalSqm * hydroSqmRate))}
              </div>
            </div>

            {/* Prep Fee */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-700">Aluspinna tasandus / lammutus</span>
                <span className="font-bold text-stone-900 text-sm">{prepFee} €</span>
              </div>
              <input
                type="number"
                min="0"
                step="25"
                value={prepFee}
                onChange={(e) => setPrepFee(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold"
              />
              <div className="text-[10px] text-stone-500">
                Objekti eripärad (nt vana tasanduskiht)
              </div>
            </div>
          </div>

          {/* System Selection & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Ehituskeemia pakett</label>
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value as 'Mira' | 'Mapei' | 'Kiilto')}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-900"
              >
                <option value="Mira">Mira Byggeprodukter (4400 süsteem)</option>
                <option value="Mapei">Mapei SpA (AquaDefense / Keraflex)</option>
                <option value="Kiilto">Kiilto Oy (Kerafiber süsteem)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Planeeritud alguskuupäev</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Eeldatav tööde kestus (tööpäevi)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(parseInt(e.target.value) || 5)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-900"
              />
            </div>
          </div>

          {/* Notes for client */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Personaalne kaaskiri ja garantiitingimused kliendile
            </label>
            <textarea
              rows={3}
              value={contractorNotes}
              onChange={(e) => setContractorNotes(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white p-3 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Itemized Specification Table */}
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <div className="bg-stone-50 px-4 py-2.5 text-xs font-bold text-stone-700 flex justify-between items-center border-b border-stone-200">
              <span>Pakkumise detailne ridade loetelu</span>
              <span className="text-[11px] text-stone-500">
                Materjalid: {formatCurrency(totalMaterials)} • Töö: {formatCurrency(totalLabor)}
              </span>
            </div>

            <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto text-xs">
              {liveEstimate.lineItems.map((item) => (
                <div key={item.id} className="px-4 py-2 flex items-center justify-between hover:bg-stone-50/60">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-stone-900">{item.name}</span>
                    <span className="text-[11px] text-stone-500 block">
                      {item.quantity} {item.unit} @ {item.unit_price} €
                    </span>
                  </div>
                  <span className="font-bold text-stone-900">{formatCurrency(item.total_price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grand Total Summary Box */}
          <div className="rounded-2xl bg-stone-900 text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                Kliendile esitatav lõpphind kokku:
              </div>
              <div className="text-3xl font-black text-orange-400 mt-1">
                {formatCurrency(grandTotal)}
              </div>
              <div className="text-xs text-stone-300 mt-0.5">
                (Töö {formatCurrency(totalLabor)} + {selectedSystem} materjalid {formatCurrency(totalMaterials)} + ettevalmistus {formatCurrency(prepFee)})
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="default"
                onClick={onClose}
                className="bg-transparent border-stone-700 text-white hover:bg-stone-800"
              >
                Tühista
              </Button>

              <Button
                variant="amber"
                size="default"
                onClick={handleSendOfficialOffer}
                disabled={isSubmitting}
                className="gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <span>Saadan pakkumist...</span>
                ) : isSuccess ? (
                  <span className="flex items-center gap-1.5 text-white">
                    <CheckCircle className="w-4 h-4" /> Pakkumine saadetud!
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kinnita ja saada ametlik pakkumine</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
