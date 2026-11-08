'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Calculator, Briefcase, User, HardHat, Sparkles, Tag, LogIn } from 'lucide-react';
import { Button } from '../ui/button';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-102">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-md shadow-orange-500/20">
            <Layers className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-stone-900 leading-none">
              PLAATIJA<span className="text-orange-600">24</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-600">
              Plaatimise AI & Meistrite Võrk
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <Link
            href="/estimate"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              pathname === '/estimate'
                ? 'bg-orange-50 text-orange-700 font-semibold'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Calculator className="h-4 w-4 text-orange-600" />
            <span>Kliendi kalkulaator & AI</span>
          </Link>

          <Link
            href="/contractor/profile"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              pathname === '/contractor/profile'
                ? 'bg-stone-100 text-stone-900 font-semibold'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <User className="h-4 w-4 text-stone-500" />
            <span>Meistrite profiilid</span>
          </Link>

          <Link
            href="/contractor/pricing"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              pathname === '/contractor/pricing'
                ? 'bg-stone-100 text-stone-900 font-semibold'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Tag className="h-4 w-4 text-amber-600" />
            <span>Paketid meistrile</span>
          </Link>

          <Link
            href="/contractor/dashboard"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              pathname?.startsWith('/contractor/dashboard')
                ? 'bg-stone-100 text-stone-900 font-semibold'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Briefcase className="h-4 w-4 text-stone-700" />
            <span>Plaatija töölaud</span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
              3 uut tööd
            </span>
          </Link>
        </nav>

        {/* Right CTA / Role Switcher */}
        <div className="flex items-center gap-2">
          <Link href="/contractor/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="gap-1.5 text-stone-700 hover:text-stone-900">
              <LogIn className="h-4 w-4 text-stone-500" />
              <span>Logi sisse</span>
            </Button>
          </Link>

          <Link href="/estimate">
            <Button variant="amber" size="sm" className="hidden sm:inline-flex gap-1.5 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>Arvuta eelhinnang</span>
            </Button>
          </Link>

          <Link href="/contractor/dashboard">
            <Button variant="outline" size="sm" className="gap-1.5 border-stone-300">
              <HardHat className="h-4 w-4 text-orange-600" />
              <span className="hidden md:inline">Plaatija režiim</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
