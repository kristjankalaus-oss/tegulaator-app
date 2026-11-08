'use client';

import React, { useState } from 'react';
import { Step1Data } from './Step1Measurements';
import { MaterialManufacturer } from '@/lib/supabase/types';
import { calculateDetailedEstimate, MATERIAL_SYSTEMS } from '@/lib/estimation-engine';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  Layers,
  Wrench,
  Clock,
  ArrowLeft,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';

interface Step3AIEstimateProps {
  step1Data: Step1Data;
  selectedManufacturer: MaterialManufacturer;
  visualMockupUrl: string;
  onMockupGenerated: (url: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const AI_MOCKUP_STYLES = [
  {
    id: 'marble_luxury',
    name: 'Carrara marmor & messing',
    desc: 'Hele 60x120 marmorplaat kuldsete dušisegistite ja LED süvisnišiga',
    url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'modern_anthracite',
    name: 'Nordic Antratsiit & Tamm',
    desc: 'Tume kiltkivi 60x60 põrandal ja naturaalse puidu aktsendiga saun/vannituba',
    url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'scandi_terrazzo',
    name: 'Skandinaavia Terrazzo & Valge',
    desc: 'Peeneteraline terrazzo põrand ja vertikaalne 10x30 valge seinaladu',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
  },
];

export function Step3AIEstimate({
  step1Data,
  selectedManufacturer,
  visualMockupUrl,
  onMockupGenerated,
  onNext,
  onBack,
}: Step3AIEstimateProps) {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'material_comparison'>('breakdown');
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);
  const [selectedMockupStyle, setSelectedMockupStyle] = useState(AI_MOCKUP_STYLES[0].id);

  // Compute live estimation values
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

  const laborMin = Math.round(estimate.laborCost * 0.92);
  const laborMax = Math.round(estimate.laborCost * 1.12);
  const materialsMin = Math.round(estimate.materialsCost * 0.95);
  const materialsMax = Math.round(estimate.materialsCost * 1.08);
  const totalMin = laborMin + materialsMin + estimate.prepCost;
  const totalMax = laborMax + materialsMax + estimate.prepCost;

  const currentMockup = visualMockupUrl || AI_MOCKUP_STYLES[0].url;

  const handleGenerateNewMockup = async (styleId: string) => {
    setSelectedMockupStyle(styleId);
    setIsGeneratingMockup(true);

    try {
      const response = await fetch('/api/generate-mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType: step1Data.roomType,
          tileFormat: step1Data.tileFormat,
          style: styleId,
          userPhoto: step1Data.roomPhotos[0] || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.mockupUrl) {
          onMockupGenerated(data.mockupUrl);
        }
      } else {
        // Fallback to style preset
        const style = AI_MOCKUP_STYLES.find((s) => s.id === styleId);
        if (style) onMockupGenerated(style.url);
      }
    } catch {
      const style = AI_MOCKUP_STYLES.find((s) => s.id === styleId);
      if (style) onMockupGenerated(style.url);
    } finally {
      setIsGeneratingMockup(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-3 py-0.5 text-xs font-semibold text-white mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Eelarve mootor & 3D Renderdus</span>
            </div>
            <h3 className="text-2xl font-black text-stone-900 tracking-tight">
              Eeldatav projekti kogumaksumus:{' '}
              <span className="text-orange-600">{formatCurrency(totalMin)} – {formatCurrency(totalMax)}</span>
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Arvutatud {estimate.totalSqm.toFixed(1)} m² pinnale ({step1Data.floorSqm} m² põrand + {step1Data.wallSqm} m² seinad) kasutades{' '}
              <strong className="text-stone-900">{estimate.activeSystem}</strong> sertifitseeritud süsteemi.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-orange-100 shrink-0">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-xs text-stone-500 font-medium">Eeldatav tööaeg:</div>
              <div className="text-sm font-bold text-stone-900">
                ~{estimate.estimatedDays} tööpäeva
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Left Mockup, Right Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-orange-600" /> AI visuaalne ruumikontseptsioon
            </h4>
            <span className="text-[11px] text-stone-400">Valmis ruumi simulatsioon</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-[4/3] bg-stone-900 group shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentMockup}
              alt="AI genereeritud vannitoa mockup"
              className={`w-full h-full object-cover transition-all duration-500 ${
                isGeneratingMockup ? 'opacity-40 blur-xs scale-102' : 'opacity-100 scale-100'
              }`}
            />

            {isGeneratingMockup && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40">
                <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mb-2" />
                <span className="text-xs font-semibold">Genereerin uut plaadikontseptsiooni...</span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/70 backdrop-blur-md p-2.5 text-white flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold block">Viimistlusnäidis</span>
                <span className="text-[10px] text-stone-300">
                  {step1Data.tileFormat === 'standard_30x60' && '30x60 cm keraamiline plaat'}
                  {step1Data.tileFormat === 'large_60x60' && '60x60 cm portselanplaat'}
                  {step1Data.tileFormat === 'slab_120x240' && '120x240 cm suuremõõtmeline kiviplaat'}
                  {step1Data.tileFormat === 'herringbone' && 'Kalasaba mosaiikladu'}
                </span>
              </div>
              <span className="rounded bg-orange-600 px-2 py-0.5 text-[10px] font-bold">
                GPT-4o Vision + DALL-E
              </span>
            </div>
          </div>

          {/* Style Selector Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-700">Vali meelepärane disainistiil:</span>
            <div className="grid grid-cols-1 gap-2">
              {AI_MOCKUP_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleGenerateNewMockup(st.id)}
                  disabled={isGeneratingMockup}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    selectedMockupStyle === st.id
                      ? 'border-orange-600 bg-orange-50 text-orange-950 font-semibold shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div>
                    <div className="font-bold">{st.name}</div>
                    <div className="text-[11px] text-stone-500 font-normal">{st.desc}</div>
                  </div>
                  {selectedMockupStyle === st.id && (
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown & System Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sub tabs */}
          <div className="flex border-b border-stone-200 gap-4 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('breakdown')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'breakdown'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Kulude jaotus (Töö vs Materjalid)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('material_comparison')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'material_comparison'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Süsteemide hinnavõrdlus (Mira vs Mapei vs Kiilto)</span>
            </button>
          </div>

          {activeTab === 'breakdown' ? (
            <div className="space-y-4">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-stone-200 bg-white p-3.5">
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-orange-600" /> Plaatimistöö vahemik
                  </div>
                  <div className="text-lg font-bold text-stone-900 mt-1">
                    {formatCurrency(laborMin)} – {formatCurrency(laborMax)}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    ~{(estimate.laborCost / estimate.totalSqm).toFixed(0)} €/m² (sh. hüdro & vuuk)
                  </div>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-3.5">
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-blue-600" /> Ehituskeemia materjalid
                  </div>
                  <div className="text-lg font-bold text-stone-900 mt-1">
                    {formatCurrency(materialsMin)} – {formatCurrency(materialsMax)}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Sertifitseeritud {estimate.activeSystem} pakett
                  </div>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-3.5 col-span-2 sm:col-span-1">
                  <div className="text-xs text-stone-500">Aluspinna ettevalmistus</div>
                  <div className="text-lg font-bold text-stone-900 mt-1">
                    {estimate.prepCost > 0 ? formatCurrency(estimate.prepCost) : '0 € (Kaasas)'}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {step1Data.substrateCondition === 'new_drywall' ? 'Sirge kipsi standard' : 'Eritööd / tasandus'}
                  </div>
                </div>
              </div>

              {/* Itemized Detailed Table */}
              <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
                <div className="bg-stone-50 px-4 py-2.5 text-xs font-bold text-stone-700 uppercase tracking-wider border-b border-stone-200">
                  Arvutatud kulumaterjalide spetsifikatsioon
                </div>
                <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                  {estimate.lineItems.map((item) => (
                    <div key={item.id} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-stone-50/60">
                      <div className="space-y-0.5 max-w-sm">
                        <div className="font-semibold text-stone-900">{item.name}</div>
                        <div className="text-[11px] text-stone-500">
                          Kogus: {item.quantity} {item.unit} × {item.unit_price} €/{item.unit}
                        </div>
                      </div>
                      <div className="font-bold text-stone-900">
                        {formatCurrency(item.total_price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-normal flex items-start gap-1.5">
                <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                Märkus: Hinnang ei sisalda keraamiliste plaatide endi ostuhinda, kuna plaatide hinnatase varieerub kliendi valikul vahemikus 15 €/m² kuni 120+ €/m².
              </p>
            </div>
          ) : (
            /* Material Manufacturer Comparison Tab */
            <div className="space-y-4">
              <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 text-xs text-stone-600">
                Võrdlus põhineb antud ruumi ({estimate.totalSqm.toFixed(1)} m²) täiskomplektil: krunt, 2-kihiline hüdroisolatsioon kangaste ja mansettidega, C2TE S1 plaatimissegu, vuuk ja silikoon.
              </div>

              <div className="space-y-3">
                {estimate.materialBreakdowns.map((b) => {
                  const sysDef = MATERIAL_SYSTEMS[b.system];
                  const isCurrent = b.system === estimate.activeSystem;

                  return (
                    <div
                      key={b.system}
                      className={`rounded-xl border p-4 transition-all ${
                        isCurrent
                          ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500/30'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-900">{b.system} Täispakett</span>
                            {isCurrent && (
                              <span className="rounded-full bg-orange-600 px-2 py-0.2 text-[10px] font-bold text-white">
                                Valitud
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">{sysDef.tagline}</p>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-stone-900">
                            {formatCurrency(b.totalMaterials)}
                          </div>
                          <div className="text-[11px] font-medium">
                            {b.deltaVsSelected === 0 ? (
                              <span className="text-stone-500">Baashind</span>
                            ) : b.deltaVsSelected > 0 ? (
                              <span className="text-amber-700 flex items-center justify-end gap-0.5">
                                <TrendingUp className="w-3 h-3" /> +{formatCurrency(b.deltaVsSelected)}
                              </span>
                            ) : (
                              <span className="text-emerald-700 flex items-center justify-end gap-0.5">
                                <TrendingDown className="w-3 h-3" /> {formatCurrency(b.deltaVsSelected)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex items-center justify-between border-t border-stone-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Muuda materjale</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition-colors"
        >
          <span>Saada päring piirkonna plaatijatele</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
