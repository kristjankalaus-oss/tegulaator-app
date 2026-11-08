'use client';

import React from 'react';
import { MaterialManufacturer } from '@/lib/supabase/types';
import { MATERIAL_SYSTEMS, calculateDetailedEstimate } from '@/lib/estimation-engine';
import { Step1Data } from './Step1Measurements';
import { Check, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Step2MaterialsProps {
  step1Data: Step1Data;
  selectedManufacturer: MaterialManufacturer;
  onChange: (manufacturer: MaterialManufacturer) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Materials({
  step1Data,
  selectedManufacturer,
  onChange,
  onNext,
  onBack,
}: Step2MaterialsProps) {
  // Compute the live preview of material costs for this room
  const estimateResult = calculateDetailedEstimate({
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

  const systems: { id: MaterialManufacturer; name: string; country: string; badge: string; color: string }[] = [
    {
      id: 'Mira',
      name: 'Mira Byggeprodukter',
      country: '🇩🇰 Taani standard',
      badge: 'Eesti populaarseim plaatimissüsteem',
      color: 'border-blue-500 bg-blue-50/20',
    },
    {
      id: 'Mapei',
      name: 'Mapei SpA',
      country: '🇮🇹 Itaalia inseneritase',
      badge: 'Suurformaatplaatide & basseinide lemmik',
      color: 'border-indigo-500 bg-indigo-50/20',
    },
    {
      id: 'Kiilto',
      name: 'Kiilto Oy',
      country: '🇫🇮 Soome märgala sertifikaat',
      badge: 'ETAG 022 M1 madala emissiooniga',
      color: 'border-emerald-500 bg-emerald-50/20',
    },
    {
      id: 'flexible',
      name: 'Luba meistril soovitada',
      country: '🇪🇪 Usalda plaatija kogemust',
      badge: 'Meister valib objektile optimaalseima',
      color: 'border-stone-400 bg-stone-50',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-xl font-bold text-stone-900 tracking-tight">
          Vali sertifitseeritud ehituskeemia süsteem
        </h3>
        <p className="text-sm text-stone-600 mt-1 leading-relaxed">
          Plaaditöö pikaealisus ja niiskuskindlus sõltub ühtse tootja süsteemi (krunt + hüdroisolatsioon + elastne plaadisegu + vuugid) kasutamisest. Erinevate brändide segamine võib tühistada süsteemigarantii.
        </p>
      </div>

      {/* Grid of Manufacturers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((sys) => {
          const isSelected = selectedManufacturer === sys.id;
          const sysDetails = sys.id !== 'flexible' ? MATERIAL_SYSTEMS[sys.id as 'Mira' | 'Mapei' | 'Kiilto'] : null;
          const costData =
            sys.id !== 'flexible'
              ? estimateResult.materialBreakdowns.find((b) => b.system === sys.id)
              : null;

          return (
            <div
              key={sys.id}
              onClick={() => onChange(sys.id)}
              className={`cursor-pointer rounded-2xl border-2 p-5 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-orange-600 bg-orange-50/40 shadow-md ring-2 ring-orange-500/20'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 bg-orange-600 text-white rounded-full p-1">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-stone-500">{sys.country}</span>
                  <span className="inline-block rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                    {sys.badge}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-stone-900">{sys.name}</h4>

                {sysDetails && (
                  <p className="text-xs text-stone-600 mt-1 italic">
                    &ldquo;{sysDetails.tagline}&rdquo;
                  </p>
                )}

                {/* Layer Details */}
                {sysDetails && (
                  <div className="mt-4 space-y-1.5 border-t border-stone-100 pt-3 text-xs text-stone-700">
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-400 font-medium">Krunt:</span>
                      <span className="truncate">{sysDetails.primer.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-400 font-medium">Hüdro:</span>
                      <span className="truncate">{sysDetails.waterproofing.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-400 font-medium">Plaadisegu:</span>
                      <span className="truncate">{sysDetails.adhesiveStandard.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-400 font-medium">Vuugisegu:</span>
                      <span className="truncate">{sysDetails.grout}</span>
                    </div>
                  </div>
                )}

                {sys.id === 'flexible' && (
                  <p className="mt-4 text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
                    Meistril on vabadus valida tema poolt eelistatud ja sertifitseeritud süsteem vastavalt plaadi mõõtmetele ning ruumi eripärale.
                  </p>
                )}
              </div>

              {/* Price comparison badge */}
              <div className="mt-5 pt-3 border-t border-stone-200/80 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Eeldatav materjalikulu ruumile ({(step1Data.floorSqm + step1Data.wallSqm).toFixed(1)} m²):
                </span>
                <span className="text-sm font-bold text-stone-900">
                  {costData ? formatCurrency(costData.totalMaterials) : 'Vastavalt pakkumisele'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warranty Alert */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Plaatija24 süsteemikaitse garantii:</strong> Kõik platvormi sertifitseeritud plaatijad järgivad tootjate paigaldusjuhendeid ja ETAG 022 hüdroisolatsiooni sertifikaati, tagades töödele 2 kuni 10-aastase süsteemigarantii.
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-stone-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tagasi mõõtude juurde</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition-colors"
        >
          <span>Arvuta AI hinnang & koosta mockup</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
