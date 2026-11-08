'use client';

import React, { useState } from 'react';
import {
  MOCK_CONTRACTORS,
  MOCK_PORTFOLIO,
  MOCK_REVIEWS,
} from '@/lib/mock-data';
import { PortfolioImage, ContractorReview } from '@/lib/supabase/types';
import {
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Maximize2,
  X,
  MessageSquare,
  Award,
  ChevronRight,
  Send,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ContractorProfilePage() {
  const [selectedContractorIndex, setSelectedContractorIndex] = useState(0);
  const contractor = MOCK_CONTRACTORS[selectedContractorIndex] || MOCK_CONTRACTORS[0];

  const [portfolio] = useState<PortfolioImage[]>(MOCK_PORTFOLIO);
  const [reviews, setReviews] = useState<ContractorReview[]>(MOCK_REVIEWS);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showBeforeAfter, setShowBeforeAfter] = useState<Record<string, boolean>>({});

  // Lightbox modal state for side-by-side comparison
  const [lightboxItem, setLightboxItem] = useState<PortfolioImage | null>(null);

  // New review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [materialSystem, setMaterialSystem] = useState('Mira 4400 süsteem');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  const allTags = [
    'all',
    'Enne/Pärast',
    'Mira süsteem',
    'Mapei süsteem',
    'Suurformaat',
    'Kalasaba',
  ];

  const filteredPortfolio = portfolio.filter((item) => {
    if (selectedTag === 'all') return true;
    if (selectedTag === 'Enne/Pärast') return Boolean(item.before_image_url);
    return item.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));
  });

  const toggleBeforeAfter = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowBeforeAfter((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev: ContractorReview = {
      id: `rev-${Date.now()}`,
      contractor_id: contractor.id,
      client_name: reviewerName.trim(),
      client_city: reviewerCity.trim() || 'Tallinn',
      rating: newRating,
      created_at: new Date().toISOString(),
      project_title: projectTitle.trim() || 'Keraamiliste plaatide paigaldus',
      material_system: materialSystem,
      comment: reviewComment.trim(),
      verified: true,
      categories: {
        quality: newRating,
        punctuality: 5,
        cleanliness: 5,
        communication: 5,
      },
    };

    setReviews([newRev, ...reviews]);
    setReviewSuccessMsg(true);
    setTimeout(() => {
      setReviewSuccessMsg(false);
      setIsReviewModalOpen(false);
      // Reset form
      setReviewerName('');
      setReviewerCity('');
      setProjectTitle('');
      setReviewComment('');
      setNewRating(5);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Contractor Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 pl-2">
            <Building className="w-4 h-4 text-orange-600" />
            <span>Vali plaatimismeister:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_CONTRACTORS.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedContractorIndex(idx)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedContractorIndex === idx
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {c.company_name} ★ {c.rating}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-stone-900 to-stone-700 text-white font-black text-2xl shadow-lg shrink-0">
                {contractor.company_name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    {contractor.company_name}
                  </h1>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Sertifitseeritud meister
                  </span>
                  <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-bold text-amber-900 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" /> PRO Meister
                  </span>
                </div>

                <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
                  {contractor.bio}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {contractor.service_regions.join(', ')}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {contractor.experience_years} aastat kogemust
                  </span>
                  <span>•</span>
                  <a
                    href={`tel:${contractor.phone_public}`}
                    className="flex items-center gap-1 text-orange-600 hover:underline font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {contractor.phone_public}
                  </a>
                  <span>•</span>
                  <a
                    href={contractor.website_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-stone-600 hover:text-stone-900"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {contractor.website_url?.replace(/^https?:\/\//, '') || 'Koduleht puudub'}
                  </a>
                </div>
              </div>
            </div>

            {/* 5-Star Rating Card */}
            <div className="rounded-2xl bg-gradient-to-b from-orange-50/80 to-amber-50/50 border border-orange-200 p-5 text-center shrink-0 min-w-[210px] shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">
                Plaatija24 reiting
              </div>
              <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <div className="text-3xl font-black text-stone-900">
                {contractor.rating} <span className="text-sm font-normal text-stone-500">/ 5.0</span>
              </div>
              <div className="text-xs text-stone-600 mt-1">
                Põhineb <strong>{reviews.length}</strong> kontrollitud arvustusel
              </div>
              <Link href="/estimate" className="inline-block mt-3 w-full">
                <Button variant="amber" size="sm" className="w-full text-xs gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Küsi hinnapakkumist</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Pricing Standards & Materials */}
          <div className="mt-8 border-t border-stone-200 pt-6">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
              Läbipaistvad baastariifid & sertifikaadid
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
                <span className="text-stone-500 block">Plaatimistöö baas</span>
                <strong className="text-base font-bold text-stone-900 mt-0.5 block">
                  {contractor.base_sqm_labor_rate} €/m²
                </strong>
                <span className="text-[10px] text-stone-400">Sisaldab vuukimist</span>
              </div>

              <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
                <span className="text-stone-500 block">Hüdroisolatsioon</span>
                <strong className="text-base font-bold text-stone-900 mt-0.5 block">
                  {contractor.waterproofing_sqm_rate} €/m²
                </strong>
                <span className="text-[10px] text-stone-400">2 kihti + nurgakangad</span>
              </div>

              <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
                <span className="text-stone-500 block">Tunnitariif eritöödel</span>
                <strong className="text-base font-bold text-stone-900 mt-0.5 block">
                  {contractor.hourly_rate} €/h
                </strong>
                <span className="text-[10px] text-stone-400">Tasandused, trapikalded</span>
              </div>

              <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
                <span className="text-stone-500 block">Aktsepteeritud süsteemid</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {contractor.accepted_material_standards.map((m) => (
                    <span
                      key={m}
                      className="rounded bg-white border border-stone-200 px-1.5 py-0.5 text-[10px] font-bold text-stone-700"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Completed Work Photo Gallery (Before/After & Finished Projects) */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  Tehtud tööd & Enne/Pärast fotogalerii
                </h2>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
                  {filteredPortfolio.length} objekti
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Fotod ehtsatelt objektidelt Eestis: kontrollitud veetõke, trapikalded ja laserlooditud plaadiread.
              </p>
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    selectedTag === t
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {t === 'all' ? 'Kõik tööd' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => {
              const isShowingBefore = showBeforeAfter[item.id] || false;
              const displayImage =
                isShowingBefore && item.before_image_url ? item.before_image_url : item.image_url;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                  onClick={() => setLightboxItem(item)}
                >
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {isShowingBefore ? (
                        <span className="rounded-md bg-stone-900/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-amber-400 shadow">
                          ENNE REMONTI (Algseis)
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-600/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white shadow">
                          PÄRAST (Valmis plaatimistöö)
                        </span>
                      )}
                    </div>

                    {/* Lightbox trigger icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900/80 text-white backdrop-blur-sm hover:bg-orange-600">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Before/After Toggle Pill */}
                    {item.before_image_url && (
                      <button
                        type="button"
                        onClick={(e) => toggleBeforeAfter(item.id, e)}
                        className="absolute bottom-3 right-3 rounded-lg bg-black/85 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-white hover:bg-orange-600 transition-colors shadow-md flex items-center gap-1.5"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>{isShowingBefore ? 'Vaata valmis tööd' : 'Vaata algseisu (Enne)'}</span>
                      </button>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-stone-900 text-base group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.before_image_url && (
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                          Enne/Pärast
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-stone-100 text-stone-700 px-2 py-0.5 text-[10px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION: 5-Star Rating Breakdown & Customer Reviews */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  Klientide hinnangud ja arvustused
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {reviews.length} tagasisidet
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Ainult kinnitatud tellijad, kelle tööd on valminud Plaatija24 platvormi lepingute alusel.
              </p>
            </div>

            <Button
              variant="amber"
              size="sm"
              onClick={() => setIsReviewModalOpen(true)}
              className="gap-2 shadow-sm self-start sm:self-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kirjuta arvustus</span>
            </Button>
          </div>

          {/* Rating Breakdown Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-stone-50 rounded-2xl p-6 border border-stone-200">
            {/* Total Score */}
            <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-stone-200">
              <span className="text-4xl font-black text-stone-900">{contractor.rating}</span>
              <div className="flex items-center gap-1 text-amber-500 my-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-medium text-stone-500">
                Üldine rahulolu 5.0 skaalal
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1">
                ✓ 99% klientidest soovitab seda meistrit
              </span>
            </div>

            {/* Star Distribution Bars */}
            <div className="space-y-1.5 justify-center flex flex-col px-2">
              {[
                { stars: 5, pct: 95, count: 36 },
                { stars: 4, pct: 5, count: 2 },
                { stars: 3, pct: 0, count: 0 },
                { stars: 2, pct: 0, count: 0 },
                { stars: 1, pct: 0, count: 0 },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-12 font-medium text-stone-600 flex items-center gap-1">
                    {row.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                  </span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-stone-400 font-mono text-[11px]">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Quality Dimensions */}
            <div className="space-y-2.5 justify-center flex flex-col p-2 text-xs border-t md:border-t-0 md:border-l border-stone-200">
              <div>
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>Tööde kvaliteet & täpsus:</span>
                  <span className="text-orange-600 font-bold">5.0 / 5.0</span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[100%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>Tähtaegadest kinnipidamine:</span>
                  <span className="text-orange-600 font-bold">4.9 / 5.0</span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>Töökoha puhtus ja heakord:</span>
                  <span className="text-orange-600 font-bold">4.9 / 5.0</span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-stone-700">
                  <span>Suhtlus & läbipaistvus:</span>
                  <span className="text-orange-600 font-bold">5.0 / 5.0</span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[100%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 pt-2">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 hover:border-orange-200 transition-colors shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-sm">
                      {rev.client_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          {rev.client_name}
                        </span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Kinnitatud tellimus
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-400">
                        {rev.client_city} • {new Date(rev.created_at).toLocaleDateString('et-EE', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 self-start sm:self-auto">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= Math.round(rev.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-stone-900 ml-1">
                      {rev.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-stone-800">
                    Objekt: {rev.project_title}
                  </span>
                  {rev.material_system && (
                    <span className="rounded bg-stone-100 border border-stone-200 px-2 py-0.5 text-[11px] font-medium text-stone-700">
                      Süsteem: {rev.material_system}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Master CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Oled professionaalne plaatimismeister?
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Loo oma meistri profiil ja saa kvaliteetseid tööpakkumisi
            </h3>
            <p className="text-xs text-stone-300 max-w-xl">
              Liitu Plaatija24 võrgustikuga tasuta või vali PRO pakett piiramatute pakkumiste ja SMS teavitustega.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/contractor/pricing">
              <Button variant="amber" size="default" className="gap-2">
                <span>Vaata meistrite pakette</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contractor/login">
              <Button
                variant="outline"
                size="default"
                className="bg-transparent border-stone-600 text-white hover:bg-stone-800"
              >
                <span>Meistri sisselogimine</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL: Before & After Side-by-Side Comparison */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-fadeIn space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{lightboxItem.title}</h3>
                <p className="text-xs text-stone-500">{lightboxItem.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="rounded-lg p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {lightboxItem.before_image_url ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      1. ENNE TÖÖDE ALGUST (Algseis)
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={lightboxItem.before_image_url}
                      alt="Enne"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      2. PÄRAST VALMIMIST (Lõpptulemus)
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={lightboxItem.image_url}
                      alt="Pärast"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 max-h-[500px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxItem.image_url}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-stone-200 text-xs">
              <div className="flex flex-wrap gap-1.5">
                {lightboxItem.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-stone-100 border border-stone-200 px-2 py-0.5 font-semibold text-stone-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => setLightboxItem(null)}>
                Sulge vaade
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Lisa meistrile arvustus</h3>
                <p className="text-xs text-stone-500">
                  Hindad meistrit: <strong>{contractor.company_name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="rounded-lg p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="py-8 text-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-stone-900">Suur tänu tagasiside eest!</h4>
                <p className="text-xs text-stone-500">Sinu arvustus on edukalt salvestatud ja avalikustatud.</p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4">
                {/* 5-Star Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Hinnang (1 - 5 tärni) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || newRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-black text-stone-800 ml-2">
                      {hoverRating || newRating} / 5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Sinu nimi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="nt. Margus Tamm"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Piirkond / Linn
                    </label>
                    <input
                      type="text"
                      placeholder="nt. Tallinn (Nõmme)"
                      value={reviewerCity}
                      onChange={(e) => setReviewerCity(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Objekti tüüp
                    </label>
                    <input
                      type="text"
                      placeholder="nt. Vannitoa plaatimine 25m²"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Kasutatud ehituskeemia
                    </label>
                    <select
                      value={materialSystem}
                      onChange={(e) => setMaterialSystem(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Mira 4400 süsteem">Mira 4400 süsteem</option>
                      <option value="Mapei Keraflex Maxi S1">Mapei Keraflex Maxi S1</option>
                      <option value="Kiilto Kerafiber süsteem">Kiilto Kerafiber süsteem</option>
                      <option value="Muu sertifitseeritud süsteem">Muu sertifitseeritud süsteem</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Arvustuse sisu & kommentaar *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Kirjelda tööde kvaliteeti, tähtaegadest kinnipidamist, suhtlust ja tulemust..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReviewModalOpen(false)}
                  >
                    Loobu
                  </Button>
                  <Button type="submit" variant="amber" size="sm" className="gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Postita arvustus</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
