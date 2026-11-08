'use client';

import React, { useState } from 'react';
import { Step1Data } from './Step1Measurements';
import { MaterialManufacturer, ProjectLead } from '@/lib/supabase/types';
import { MOCK_CONTRACTORS } from '@/lib/mock-data';
import { calculateDetailedEstimate } from '@/lib/estimation-engine';
import { formatCurrency } from '@/lib/utils';
import {
  Send,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Star,
  ArrowLeft,
  Calendar,
  Building,
} from 'lucide-react';
import Link from 'next/link';

interface Step4SubmitLeadProps {
  step1Data: Step1Data;
  selectedManufacturer: MaterialManufacturer;
  visualMockupUrl: string;
  onBack: () => void;
  onSubmitSuccess: (lead: ProjectLead) => void;
}

export function Step4SubmitLead({
  step1Data,
  selectedManufacturer,
  visualMockupUrl,
  onBack,
  onSubmitSuccess,
}: Step4SubmitLeadProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Tallinn (Kristiine / Kesklinn)');
  const [address, setAddress] = useState('');
  const [timeline, setTimeline] = useState('2_weeks');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string>('');

  const estimate = calculateDetailedEstimate({
    floorSqm: step1Data.floorSqm,
    wallSqm: step1Data.wallSqm,
    roomType: step1Data.roomType,
    tileFormat: step1Data.tileFormat,
    preferredManufacturer: selectedManufacturer,
    substrateCondition: step1Data.substrateCondition,
    needsWaterproofing: step1Data.needsWaterproofing,
    needsFloorHeatingPrep: step1Data.needsFloorHeatingPrep,
    needsEpoxyGrout: step1Data.needsEpoxyGrout,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      client_name: fullName || 'Huviline Tellija',
      client_email: email || 'tellija@plaatija24.ee',
      client_phone: phone || '+372 5500 0000',
      location_city: city,
      location_address: address,
      room_type: step1Data.roomType,
      floor_sqm: step1Data.floorSqm,
      wall_sqm: step1Data.wallSqm,
      ceiling_height: step1Data.ceilingHeight,
      preferred_tile_format: step1Data.tileFormat,
      preferred_manufacturer: selectedManufacturer,
      substrate_condition: step1Data.substrateCondition,
      needs_waterproofing: step1Data.needsWaterproofing,
      needs_floor_heating_prep: step1Data.needsFloorHeatingPrep,
      needs_epoxy_grout: step1Data.needsEpoxyGrout,
      room_photos: step1Data.roomPhotos,
      visual_mockup_url: visualMockupUrl,
      ai_summary: `${step1Data.roomType} ${estimate.totalSqm.toFixed(1)} m². ${estimate.activeSystem} süsteem. ${notes}`,
      ai_estimated_materials_min: Math.round(estimate.materialsCost * 0.95),
      ai_estimated_materials_max: Math.round(estimate.materialsCost * 1.08),
      ai_estimated_labor_min: Math.round(estimate.laborCost * 0.92),
      ai_estimated_labor_max: Math.round(estimate.laborCost * 1.12),
      ai_estimated_duration_days: estimate.estimatedDays,
      status: 'submitted',
    };

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_lead', lead: payload }),
      });

      const data = await res.json();
      const leadId = data.lead?.id || 'lead-' + Date.now();
      setSubmittedLeadId(leadId);
      setIsSuccess(true);
      if (onSubmitSuccess && data.lead) {
        onSubmitSuccess(data.lead);
      }
    } catch {
      // Fallback local ID
      const leadId = 'lead-' + Date.now();
      setSubmittedLeadId(leadId);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 text-center space-y-6 shadow-sm animate-fadeIn">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs">
          <CheckCircle className="h-10 w-10" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-2xl font-black text-stone-900 tracking-tight">
            Päring on edukalt saadetud!
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Teie päring ({estimate.totalSqm.toFixed(1)} m² {estimate.activeSystem} süsteemiga) saadeti piirkonna aktiivsetele plaatijatele. Teiega võetakse ühendust 2–4 töótunni jooksul.
          </p>
        </div>

        {/* Project Summary Box */}
        <div className="max-w-md mx-auto rounded-xl border border-stone-200 bg-stone-50 p-4 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-stone-500">Päringu viitenumber:</span>
            <span className="font-mono font-bold text-stone-800">{submittedLeadId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Eeldatav maksumus:</span>
            <span className="font-bold text-orange-600">
              {formatCurrency(estimate.laborCost + estimate.materialsCost + estimate.prepCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Piirkond:</span>
            <span className="font-medium text-stone-800">{city}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/contractor/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800 transition-colors"
          >
            <Building className="w-4 h-4" />
            <span>Vaata plaatija vaatest (Demo)</span>
          </Link>

          <Link
            href="/contractor/profile"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Tutvu meistrite portfoolioga</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold text-stone-900 tracking-tight">
          Saada päring kohalikele plaatimismeistritele
        </h3>
        <p className="text-sm text-stone-600 mt-1 leading-relaxed">
          Päring saadetakse ainult kontrollitud ja garantiiga plaatijatele Teie piirkonnas. Saate vastu võtta detailseid pakkumisi ning vestelda otse meistriga.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Teie nimi või kontaktisik *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="nt. Jaanika Mets"
                  className="w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Telefoninumber *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+372 5..."
                  className="w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                E-posti aadress *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teie@epost.ee"
                  className="w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Asukoht / Piirkond *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                >
                  <option value="Tallinn (Kesklinn / Kadriorg)">Tallinn (Kesklinn / Kadriorg)</option>
                  <option value="Tallinn (Kristiine / Mustamäe)">Tallinn (Kristiine / Mustamäe)</option>
                  <option value="Tallinn (Põhja-Tallinn / Kalamaja)">Tallinn (Põhja-Tallinn / Kalamaja)</option>
                  <option value="Tallinn (Pirita / Lasnamäe)">Tallinn (Pirita / Lasnamäe)</option>
                  <option value="Harjumaa (Viimsi / Rae / Saue)">Harjumaa (Viimsi / Rae / Saue)</option>
                  <option value="Tartu & Tartumaa">Tartu & Tartumaa</option>
                  <option value="Pärnu & Pärnumaa">Pärnu & Pärnumaa</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Täpsem aadress või tänava nimi (valikuline)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="nt. Tedre tn 42, korter 5"
              className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Soovitud tööde alustamise aeg
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                >
                  <option value="asap">Võimalikult kiiresti (1-2 nädalat)</option>
                  <option value="2_weeks">2–4 nädala jooksul</option>
                  <option value="1_2_months">1–2 kuu jooksul</option>
                  <option value="flexible">Paindlik / Plaani faasis</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Lisamärkused plaatijale
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="nt. plaadid juba ostetud, korrus 3, lift olemas"
                className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-5 space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Aktiivsed meistrid Teie piirkonnas
            </h4>

            <div className="space-y-2.5">
              {MOCK_CONTRACTORS.slice(0, 2).map((c) => (
                <div key={c.id} className="rounded-lg bg-white border border-stone-200 p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{c.company_name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {c.experience_years}a kogemust • {c.accepted_material_standards.join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{c.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-stone-500 leading-relaxed border-t border-stone-200">
              🔒 Teie kontaktandmeid ei avaldata avalikult internetis, vaid edastatakse ainult konkreetse piirkonna reitinguga meistritele.
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex items-center justify-between border-t border-stone-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tagasi AI eelarve juurde</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-7 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Edastan päringut...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Kinnita ja saada päring meistritele</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
