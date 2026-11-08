'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HardHat,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NativeAdBanner } from '@/components/ads/NativeAdBanner';
import { formatCurrency } from '@/lib/utils';
import { calculateDetailedEstimate } from '@/lib/estimation-engine';

export default func Page() {
  const [quickSqm, setQuickSqm] = useState(25);
  const [quickSystem, setQuickSystem] = useState<'Mira' | 'Mapei' | 'Kiilto'>('Mira');

  const quickEstimate = calculateDetailedEstimate({
    floorSqm: 6.5,
    wallSqm: quickSqm - 6.5 > 0 ? quickSqm - 6.5 : 18.5,
    roomType: 'bathroom',
    tileFormat: 'standard_30x60',
    preferredManufacturer: quickSystem,
    substrateCondition: 'new_drywall',
    needsWaterproofing: true,
    needsFloorHeatingPrep: false,
    needsEpoxyGrout: false,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-stone-800 border border-stone-700 px-4 py-1.5 text-xs font-semibold text-orange-400">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span>Uue põlvkonna plaatimise AI & kalkulatsioonimootor</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Plaatimistööde täpne eelarve <br className="hidden sm:inline" />
            ja <span className="text-orange-500">AI ruumikontseptsioon</span> minutitega
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-stone-300 leading-relaxed">
            Unusta ebamäärased kalkulatsioonid. Arvuta sertifitseeritud ehituskeemia süsteemide (Mira, Mapei, Kiilto) tegelik kulu, näe AI-ga viimistletud ruumi ja saa ametlikud pakkumised piirkonna kontrollitud plaatimismeistritelt.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/estimate" className="w-full sm:w-auto">
              <Button variant="amber" size="lg" className="w-full sm:w-auto gap-2 text-base shadow-lg shadow-orange-600/20">
                <Calculator className="h-5 w-5" />
                <span>Alusta kliendi kalkulaatoriga</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/contractor/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 text-base bg-stone-800/80 border-stone-700 text-white hover:bg-stone-700"
              >
                <HardHat className="h-5 w-5 text-orange-400" />
                <span>Plaatija töölaud & pakkumiste koostaja</span>
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> ETAG 022 hüdroisolatsiooni normid
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-orange-400" /> Mira, Mapei & Kiilto sertifikaadid
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-400" /> Vastus meistritelt kuni 4h
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Quick-Estimator Box */}
      <section className="bg-stone-100 py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-200">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white border border-stone-200 shadow-md p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Kiirkalkulaatori näidis
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-0.5">
                Vali ligikaudne plaaditav kogupind (m²)
              </h2>
            </div>
            <div className="text-xs text-stone-500">
              Vannituba • 30x60 plaat • Täielik hüdroisolatsioon
            </div>
          </div>

          <div className="space-y-6">
            {/* Slider */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold mb-2">
                <span className="text-stone-700">Plaaditav pind (põrand + seinad):</span>
                <span className="text-xl font-black text-stone-900">{quickSqm} m²</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={quickSqm}
                onChange={(e) => setQuickSqm(parseInt(e.target.value) || 20)}
                className="w-full accent-orange-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>Väike WC (5 m²)</span>
                <span>Tavaline vannituba (25 m²)</span>
                <span>Suur spaa/saun (60 m²)</span>
              </div>
            </div>

            {/* System select */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-stone-700 mr-2">Ehituskeemia pakett:</span>
              {(['Mira', 'Mapei', 'Kiilto'] as const).map((sys) => (
                <button
                  key={sys}
                  type="button"
                  onClick={() => setQuickSystem(sys)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    quickSystem === sys
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {sys} süsteem
                </button>
              ))}
            </div>

            {/* Results Pill Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <span className="text-xs text-stone-500 block">Plaatimistöö (sh. hüdro & vuuk)</span>
                <strong className="text-xl font-black text-stone-900 mt-1 block">
                  {formatCurrency(quickEstimate.laborCost)}
                </strong>
                <span className="text-[10px] text-stone-400">Meistritöö 2a garantiiga</span>
              </div>

              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <span className="text-xs text-stone-500 block">{quickSystem} sertifitseeritud materjalid</span>
                <strong className="text-xl font-black text-stone-900 mt-1 block">
                  {formatCurrency(quickEstimate.materialsCost)}
                </strong>
                <span className="text-[10px] text-stone-400">Krunt, hüdro, liim, vuuk</span>
              </div>

              <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4">
                <span className="text-xs text-orange-800 font-semibold block">Eeldatav kogumaksumus</span>
                <strong className="text-2xl font-black text-orange-600 mt-1 block">
                  {formatCurrency(quickEstimate.laborCost + quickEstimate.materialsCost)}
                </strong>
                <span className="text-[10px] text-orange-700">Tööaeg ca {quickEstimate.estimatedDays} tööpäeva</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link href="/estimate">
                <Button variant="amber" size="default" className="gap-2">
                  <span>Sisesta oma ruumi täpsed mõõdud ja vaata AI mockupit</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            Kõik vajalik nii tellijale kui ka professionaalsele plaatijale
          </h2>
          <p className="text-sm text-stone-600">
            Digitaalne tööriistakast, mis viib kokku täpsed tehnilised nõuded ja kvaliteetse teostuse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">AI Ruumikontseptsioon & 3D</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Laadi üles oma poolelioleva ruumi või vana vannitoa foto. GPT-4o ja pildimudelite abil näed valitud keraamiliste plaatide ja vuukide realistlikku lõpptulemust juba enne tööde algust.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Tootjasüsteemide võrdlus</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Võrdle reaalajas Mira, Mapei ja Kiilto märgala süsteeme. Täpne kuluarvestus krundist ja hüdroisolatsioonist kuni C2TE S1 elastse plaatimissegu ja hallituskindla silikoonini.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
              <HardHat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">1-Kliki pakkumiste koostaja</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Plaatija teisendab kliendi AI eelarve sekundiga ametlikuks pakkumiseks. Kohanda ruutmeetritasu, lisa aluspinna ettevalmistused ja suhtle kliendiga otse integreeritud vestluses.
            </p>
          </div>
        </div>

        {/* Sponsored Brand Banner */}
        <NativeAdBanner
          placementZone="contractor_dashboard"
          adId="ad-rubi-1"
          className="shadow-sm"
        />
      </section>
    </div>
  );
}
