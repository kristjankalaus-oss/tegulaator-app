'use client';

import React from 'react';
import { RoomType, TileFormat, SubstrateCondition } from '@/lib/supabase/types';
import { UploadCloud, Ruler, Layers } from 'lucide-react';

export interface Step1Data {
  roomType: RoomType;
  floorSqm: number;
  wallSqm: number;
  ceilingHeight: number;
  tileFormat: TileFormat;
  substrateCondition: SubstrateCondition;
  needsWaterproofing: boolean;
  needsFloorHeatingPrep: boolean;
  needsEpoxyGrout: boolean;
  roomPhotos: string[];
}

interface Step1MeasurementsProps {
  data: Step1Data;
  onChange: (updates: Partial<Step1Data>) => void;
  onNext: () => void;
}

const ROOM_OPTIONS: { id: RoomType; label: string; icon: string; defaultWall: number; defaultFloor: number }[] = [
  { id: 'bathroom', label: 'Vannituba & Duširuum', icon: '🛁', defaultWall: 22, defaultFloor: 6.5 },
  { id: 'wc', label: 'Tualettruum (WC)', icon: '🚽', defaultWall: 10, defaultFloor: 2.5 },
  { id: 'kitchen_floor', label: 'Köögi põrand', icon: '🍳', defaultWall: 0, defaultFloor: 14 },
  { id: 'kitchen_backsplash', label: 'Köögi tagasein', icon: '🍽️', defaultWall: 4.5, defaultFloor: 0 },
  { id: 'sauna', label: 'Saun & Pesuruum', icon: '🧖', defaultWall: 18, defaultFloor: 8 },
  { id: 'hallway', label: 'Esik / Koridor', icon: '🚪', defaultWall: 0, defaultFloor: 9 },
];

const TILE_FORMAT_OPTIONS: { id: TileFormat; label: string; desc: string; icon: string }[] = [
  { id: 'standard_30x60', label: 'Klassikaline 30x60 cm', desc: 'Kõige levinum ja kuluefektiivsem vannitoa plaat', icon: '📐' },
  { id: 'large_60x60', label: 'Suurformaat 60x60 cm', desc: 'Moodne ja minimaalsete vuukidega pind', icon: '🔲' },
  { id: 'slab_120x240', label: 'XXL Plaadid 60x120 / 120x240 cm', desc: 'Luksuslik vuugivaba marmor / graniit imitatsioon', icon: '🏛️' },
  { id: 'herringbone', label: 'Kalasaba (Herringbone)', desc: 'Dekoratiivne mustripaigaldus seinale või põrandale', icon: '⚡' },
  { id: 'mosaic', label: 'Mosaiik & Väikeplaat', desc: 'Dušipõranda trapikalletele ja erikujulistele pindadele', icon: '🔹' },
];

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Tüüpiline kipsplaat-karp',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Renoveeritav vana vannituba',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Uusehitis betoonpõrandaga',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
  },
];

export function Step1Measurements({ data, onChange, onNext }: Step1MeasurementsProps) {
  const handleRoomSelect = (room: (typeof ROOM_OPTIONS)[0]) => {
    onChange({
      roomType: room.id,
      floorSqm: room.defaultFloor,
      wallSqm: room.defaultWall,
      needsWaterproofing: ['bathroom', 'wc', 'sauna'].includes(room.id),
    });
  };

  const addPhotoPreset = (url: string) => {
    if (!data.roomPhotos.includes(url)) {
      onChange({ roomPhotos: [...data.roomPhotos, url] });
    }
  };

  const removePhoto = (index: number) => {
    const updated = [...data.roomPhotos];
    updated.splice(index, 1);
    onChange({ roomPhotos: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Room Type Selection */}
      <section className="space-y-3">
        <label className="block text-sm font-bold text-stone-900 uppercase tracking-wider">
          1. Vali ruumi tüüp
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ROOM_OPTIONS.map((room) => {
            const isSelected = data.roomType === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => handleRoomSelect(room)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 shadow-sm ring-2 ring-orange-500/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span className="text-2xl mb-2">{room.icon}</span>
                <span className="font-semibold text-sm leading-tight">{room.label}</span>
                <span className="text-[11px] text-stone-500 mt-1">
                  Põrand ~{room.defaultFloor} m² | Sein ~{room.defaultWall} m²
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Measurements */}
      <section className="space-y-4 rounded-xl border border-stone-200 bg-stone-50/50 p-5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Ruler className="w-4 h-4 text-orange-600" /> 2. Ruumi mõõdud ja pinnad
          </label>
          <span className="text-xs text-stone-500">
            Kokku plaaditav pind: <strong className="text-stone-900">{(Number(data.floorSqm || 0) + Number(data.wallSqm || 0)).toFixed(1)} m²</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Põrandapind (m²)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={data.floorSqm}
              onChange={(e) => onChange({ floorSqm: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="nt. 6.5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Seinapind kokku (m²)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={data.wallSqm}
              onChange={(e) => onChange({ wallSqm: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="nt. 22"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Laekõrgus (m)
            </label>
            <input
              type="number"
              min="2.0"
              max="4.5"
              step="0.05"
              value={data.ceilingHeight}
              onChange={(e) => onChange({ ceilingHeight: parseFloat(e.target.value) || 2.5 })}
              className="w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="2.50"
            />
          </div>
        </div>
      </section>

      {/* 3. Preferred Tile Format */}
      <section className="space-y-3">
        <label className="block text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-600" /> 3. Soovitud keraamilise plaadi formaat
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TILE_FORMAT_OPTIONS.map((fmt) => {
            const isSelected = data.tileFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onChange({ tileFormat: fmt.id })}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-orange-600 bg-orange-50/70 text-orange-950 shadow-sm ring-2 ring-orange-500/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span className="text-xl mt-0.5">{fmt.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{fmt.label}</div>
                  <div className="text-xs text-stone-500 leading-snug mt-0.5">{fmt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Substrate & Technical Options */}
      <section className="space-y-4">
        <label className="block text-sm font-bold text-stone-900 uppercase tracking-wider">
          4. Aluspinna seisukord & erinõuded
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Olemasolev aluspind:</label>
            <select
              value={data.substrateCondition}
              onChange={(e) => onChange({ substrateCondition: e.target.value as SubstrateCondition })}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
            >
              <option value="new_drywall">Uus ehitus / sirge kipsplaat</option>
              <option value="concrete_screed">Tasandatud betoonpõrand</option>
              <option value="old_tiles_strip_needed">Vana keraamiline plaat (vajab lammutust/piikamist)</option>
              <option value="uneven_old_surface">Ebaühtlane vana aluspind (vajab lisatasandust)</option>
            </select>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
              <input
                type="checkbox"
                checked={data.needsWaterproofing}
                onChange={(e) => onChange({ needsWaterproofing: e.target.checked })}
                className="rounded border-stone-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <span>Vajalik sertifitseeritud märgala hüdroisolatsioon (ETAG 022)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
              <input
                type="checkbox"
                checked={data.needsFloorHeatingPrep}
                onChange={(e) => onChange({ needsFloorHeatingPrep: e.target.checked })}
                className="rounded border-stone-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <span>Põrandaküttekaabli paigaldus / süvistamine</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
              <input
                type="checkbox"
                checked={data.needsEpoxyGrout}
                onChange={(e) => onChange({ needsEpoxyGrout: e.target.checked })}
                className="rounded border-stone-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <span>Veekindel epoksiidvuuk (tavapärase tsementvuugi asemel)</span>
            </label>
          </div>
        </div>
      </section>

      {/* 5. Photo Upload & Visual Mockup Source */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-orange-600" /> 5. Laadi üles ruumi fotod (AI mockup & hinnang)
          </label>
          <span className="text-xs text-stone-500">Mobiilifoto praegusest olukorrast</span>
        </div>

        <div className="rounded-xl border-2 border-dashed border-stone-300 bg-stone-50/70 p-6 text-center hover:bg-stone-50 transition-colors">
          <UploadCloud className="mx-auto h-10 w-10 text-stone-400" />
          <p className="mt-2 text-xs font-medium text-stone-700">
            Lohista ruumi pildid siia või klõpsa faili valimiseks
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">PNG, JPG, HEIC kuni 15MB</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-stone-500">Või kasuta näidispilti:</span>
            {SAMPLE_PHOTO_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => addPhotoPreset(preset.url)}
                className="rounded-full bg-white border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-700 hover:border-orange-500 hover:text-orange-600 shadow-xs transition-colors"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Uploaded Photos Preview */}
        {data.roomPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {data.roomPhotos.map((photoUrl, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden border border-stone-200 aspect-video group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Ruumi foto" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Navigation Footer */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition-colors"
        >
          <span>Jätka: Vali ehituskeemia süsteem</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
