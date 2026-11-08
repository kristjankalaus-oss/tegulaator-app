'use client';

import React, { useState } from 'react';
import { Step1Measurements, Step1Data } from '@/components/client-wizard/Step1Measurements';
import { Step2Materials } from '@/components/client-wizard/Step2Materials';
import { Step3AIEstimate } from '@/components/client-wizard/Step3AIEstimate';
import { Step4SubmitLead } from '@/components/client-wizard/Step4SubmitLead';
import { MaterialManufacturer } from '@/lib/supabase/types';
import { Check, Calculator } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Mõõdud & Fotod', desc: 'Pindade ja ruumi sisestus' },
  { id: 2, title: 'Ehituskeemia', desc: 'Mira, Mapei või Kiilto' },
  { id: 3, title: 'AI Eelarve & Mockup', desc: 'Kulude jaotus & visuaal' },
  { id: 4, title: 'Päring meistrile', desc: 'Pakkumiste laekumine' },
];

export default function EstimatePage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 State
  const [step1Data, setStep1Data] = useState<Step1Data>({
    roomType: 'bathroom',
    floorSqm: 6.5,
    wallSqm: 22.0,
    ceilingHeight: 2.5,
    tileFormat: 'standard_30x60',
    substrateCondition: 'new_drywall',
    needsWaterproofing: true,
    needsFloorHeatingPrep: false,
    needsEpoxyGrout: false,
    roomPhotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    ],
  });

  // Step 2 State
  const [selectedManufacturer, setSelectedManufacturer] = useState<MaterialManufacturer>('Mira');

  // Step 3 State
  const [visualMockupUrl, setVisualMockupUrl] = useState<string>(
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&auto=format&fit=crop&q=80'
  );

  const handleStep1Change = (updates: Partial<Step1Data>) => {
    setStep1Data((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-stone-100/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Wizard Progress Bar */}
        <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600">
                <Calculator className="w-3.5 h-3.5" /> Kliendi plaatimistööde kalkulaator
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Tee kindlaks eelarve ja leia sertifitseeritud plaatija
              </h1>
            </div>

            <div className="text-xs font-medium text-stone-500 text-right">
              Samm <strong className="text-stone-900 text-sm">{currentStep}</strong> / 4
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STEPS.map((s) => {
              const isCompleted = currentStep > s.id;
              const isCurrent = currentStep === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    if (s.id < currentStep) setCurrentStep(s.id);
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-orange-50/80 border border-orange-300'
                      : isCompleted
                      ? 'cursor-pointer hover:bg-stone-50'
                      : 'opacity-50'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-orange-600 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.id}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-stone-900 truncate">{s.title}</div>
                    <div className="text-[11px] text-stone-500 truncate hidden sm:block">
                      {s.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
          {currentStep === 1 && (
            <Step1Measurements
              data={step1Data}
              onChange={handleStep1Change}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2Materials
              step1Data={step1Data}
              selectedManufacturer={selectedManufacturer}
              onChange={setSelectedManufacturer}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3AIEstimate
              step1Data={step1Data}
              selectedManufacturer={selectedManufacturer}
              visualMockupUrl={visualMockupUrl}
              onMockupGenerated={setVisualMockupUrl}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step4SubmitLead
              step1Data={step1Data}
              selectedManufacturer={selectedManufacturer}
              visualMockupUrl={visualMockupUrl}
              onBack={() => setCurrentStep(3)}
              onSubmitSuccess={(lead) => {
                console.log('Lead submitted:', lead.id);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
