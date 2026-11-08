import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                PLAATIJA<span className="text-orange-500">24</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Professionaalne veebilahendus keraamiliste plaatide paigalduse eelarvestamiseks, sertifitseeritud ehituskeemia süsteemide (Mira, Mapei, Kiilto) võrdluseks ning meistrite ja tellijate otseühenduseks.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-stone-800/90 border border-stone-700/80 px-3 py-1.5 text-xs text-stone-300">
              <Building2 className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Platvormi operaator: <strong className="text-white font-semibold">Tegulaator OÜ</strong></span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Kliendile
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/estimate" className="hover:text-orange-400 transition-colors">
                  Plaatimistööde AI kalkulaator
                </Link>
              </li>
              <li>
                <Link href="/estimate" className="hover:text-orange-400 transition-colors">
                  Vannitoa 3D/AI visuaalne mockup
                </Link>
              </li>
              <li>
                <Link href="/contractor/profile" className="hover:text-orange-400 transition-colors">
                  Sertifitseeritud plaatijad & hinnangud
                </Link>
              </li>
              <li>
                <span className="text-stone-500">Garantiitingimused & RYL normid</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Plaatijale & Ettevõttele
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contractor/dashboard" className="hover:text-orange-400 transition-colors">
                  Aktiivsed tööpakkumised
                </Link>
              </li>
              <li>
                <Link href="/contractor/pricing" className="hover:text-orange-400 transition-colors">
                  Meistrite paketid (Tasuta ja PRO)
                </Link>
              </li>
              <li>
                <Link href="/contractor/login" className="hover:text-orange-400 transition-colors">
                  Meistrite sisselogimine & registreerimine
                </Link>
              </li>
              <li>
                <span className="text-stone-500">Mira, Mapei & Kiilto materjalinormid</span>
              </li>
              <li>
                <span className="text-stone-500">Tööriistapartnerite soodustused (Rubi, Milwaukee)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Toetatud süsteemid
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-stone-800 border border-stone-700 px-2.5 py-1 rounded-md text-stone-300">
                Mira Byggeprodukter
              </span>
              <span className="bg-stone-800 border border-stone-700 px-2.5 py-1 rounded-md text-stone-300">
                Mapei SpA
              </span>
              <span className="bg-stone-800 border border-stone-700 px-2.5 py-1 rounded-md text-stone-300">
                Kiilto Oy
              </span>
              <span className="bg-stone-800 border border-stone-700 px-2.5 py-1 rounded-md text-stone-300">
                Rubi Tools
              </span>
              <span className="bg-stone-800 border border-stone-700 px-2.5 py-1 rounded-md text-stone-300">
                Milwaukee
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} Plaatija24. Kõik õigused kaitstud. Loodud professionaalsetele plaatijatele ja tellijatele.</p>
            <p className="text-[11px] text-stone-400">Platvormi operaator: <strong className="text-stone-300">Tegulaator OÜ</strong> (reg. kood 16999234, info@tegulaator.ee)</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> ETAG 022 hüdroisolatsiooni normid
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
