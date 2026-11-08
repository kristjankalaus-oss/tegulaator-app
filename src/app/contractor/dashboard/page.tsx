'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_PROJECT_LEADS, MOCK_CONTRACTORS } from '@/lib/mock-data';
import { ProjectLead, EstimateQuote } from '@/lib/supabase/types';
import { LeadCard } from '@/components/contractor/LeadCard';
import { QuoteEditorModal } from '@/components/contractor/QuoteEditorModal';
import { ProjectChatModal } from '@/components/contractor/ProjectChatModal';
import { NativeAdBanner } from '@/components/ads/NativeAdBanner';
import {
  Briefcase,
  CheckCircle2,
  Crown,
  ShieldCheck,
  Search,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function ContractorDashboardPage() {
  const [leads] = useState<ProjectLead[]>(MOCK_PROJECT_LEADS);
  const [selectedLeadForQuote, setSelectedLeadForQuote] = useState<ProjectLead | null>(null);
  const [selectedLeadForChat, setSelectedLeadForChat] = useState<ProjectLead | null>(null);
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [showProBanner, setShowProBanner] = useState(true);

  const activeContractor = MOCK_CONTRACTORS[0]; // Nordic Plaat OÜ

  const filteredLeads = leads.filter((lead) => {
    if (filterRoom !== 'all' && lead.room_type !== filterRoom) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        lead.client_name.toLowerCase().includes(q) ||
        lead.location_city.toLowerCase().includes(q) ||
        lead.room_type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleQuoteSent = (quote: EstimateQuote) => {
    setSelectedLeadForQuote(null);
    setNotification(
      `Pakkumine summas ${formatCurrency(quote.total_price)} edastati edukalt kliendile!`
    );
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Contractor Profile Top Bar */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-white font-black text-xl shadow-md">
                NP
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    {activeContractor.company_name}
                  </h1>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Sertifitseeritud meister
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                  <span>Reg kood: {activeContractor.registry_code}</span>
                  <span>•</span>
                  <span>Kogemus: {activeContractor.experience_years} aastat</span>
                  <span>•</span>
                  <span>Piirkonnad: {activeContractor.service_regions.join(', ')}</span>
                  <span>•</span>
                  <span>Süsteemid: {activeContractor.accepted_material_standards.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-center min-w-[95px]">
                <div className="text-xs text-stone-500">Aktiivsed tööd</div>
                <div className="text-lg font-bold text-stone-900">{leads.length}</div>
              </div>
              <div className="rounded-xl bg-orange-50 border border-orange-200 p-3 text-center min-w-[95px]">
                <div className="text-xs text-orange-700">Reiting</div>
                <div className="text-lg font-bold text-orange-900">★ {activeContractor.rating}</div>
              </div>
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-center min-w-[110px]">
                <div className="text-xs text-stone-500">Pakett</div>
                <div className="text-xs font-bold text-stone-800 mt-1">TASUTA (2/3)</div>
              </div>
            </div>
          </div>
        </div>

        {/* PRO Upgrade Banner */}
        {showProBanner && (
          <div className="rounded-2xl border border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black text-stone-900">Uuenda PRO paketile</span>
                  <span className="rounded-full bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5">9.90 €/kuu</span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Piiramatu pakkumiste esitamine · Esiletõstetud profiil · SMS/e-mail teavitused uutest päringutest · 14p tasuta prooviperiood
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowProBanner(false)}
                className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1"
              >
                Peida
              </button>
              <Link href="/contractor/pricing">
                <Button variant="amber" size="sm" className="gap-1.5 font-bold shadow-sm">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Aktiveeri PRO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Contractor Plan Status & Upgrade Callout Banner (original) */}
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shrink-0 mt-0.5 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">
                  Praegune pakett: <span className="text-orange-700">TASUTA</span> (2/3 pakkumist esitatud)
                </h3>
                <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  1 pakkumine jäänud
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Soovid piiramatult pakkumisi esitada ja saada reaalajas SMS teavitusi uutest vannitubadest?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Link href="/contractor/pricing" className="w-full md:w-auto">
              <Button variant="amber" size="sm" className="w-full md:w-auto gap-1.5 shadow-sm font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Uuenda PRO paketile (9.90 €/k)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Success Alert Banner */}
        {notification && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 text-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Native Ad Banner 1: Rubi Tools */}
        <NativeAdBanner
          placementZone="contractor_dashboard"
          adId="ad-rubi-1"
          className="shadow-sm"
        />

        {/* Leads Feed Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Otsi linnaosa või nime järgi..."
                className="w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3.5 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <select
              value={filterRoom}
              onChange={(e) => setFilterRoom(e.target.value)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 focus:border-orange-500 focus:outline-none"
            >
              <option value="all">Kõik ruumid ({leads.length})</option>
              <option value="bathroom">Vannitoad</option>
              <option value="kitchen_floor">Köögi põrandad</option>
              <option value="sauna">Saunad & Pesuruumid</option>
            </select>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Kuvatakse <strong className="text-stone-900">{filteredLeads.length}</strong> aktiivset tellimust
          </div>
        </div>

        {/* Leads Feed */}
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onOpenQuoteEditor={(l) => setSelectedLeadForQuote(l)}
              onOpenChat={(l) => setSelectedLeadForChat(l)}
            />
          ))}

          {filteredLeads.length === 0 && (
            <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center text-stone-500 space-y-2">
              <Briefcase className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="font-semibold text-sm">Ühtegi vastavat tellimust ei leitud.</p>
              <p className="text-xs text-stone-400">Proovi muuta otsingusõna või ruumifiltrit.</p>
            </div>
          )}
        </div>

        {/* Native Ad Banner 2: Milwaukee M18 FUEL */}
        <NativeAdBanner
          placementZone="contractor_dashboard"
          adId="ad-milwaukee-1"
          className="shadow-sm"
        />

        {/* Modals */}
        <QuoteEditorModal
          lead={selectedLeadForQuote}
          onClose={() => setSelectedLeadForQuote(null)}
          onQuoteSent={handleQuoteSent}
        />

        <ProjectChatModal
          lead={selectedLeadForChat}
          onClose={() => setSelectedLeadForChat(null)}
        />
      </div>
    </div>
  );
}
