'use client';

import React, { useState } from 'react';
import {
  Check,
  X as XIcon,
  Sparkles,
  Zap,
  Bell,
  Award,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Building2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContractorPricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<'free' | 'pro'>('pro');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const proPrice = billingCycle === 'yearly' ? '7.90' : '9.90';
  const proBilledText = billingCycle === 'yearly' ? 'arveldatakse 94.80 € / aastas (-20% soodustus)' : 'arveldatakse igakuiselt, tühista igal ajal';

  const handleStartCheckout = (plan: 'free' | 'pro') => {
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
    setCheckoutSuccess(false);
  };

  const handleCompleteSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutSuccess(true);
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setCheckoutSuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 border border-orange-200 px-4 py-1 text-xs font-bold text-orange-800">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Meistrite hinnastamismudel & paketid</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Kasvata oma plaatimisäri koos <span className="text-orange-600">Plaatija24</span> platvormiga
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Esitle oma tehtud töid, kogu 5-tärni klientide arvustusi ning saa igakuiselt uusi päringuid otse kinnisvaraomanikelt üle Eesti.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-2 flex items-center justify-center">
            <div className="flex items-center rounded-xl bg-stone-200/80 p-1 text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-lg px-4 py-2 transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Kuumakse
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Aastamakse</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  billingCycle === 'yearly' ? 'bg-white text-orange-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* PLAN 1: TASUTA (0 € / kuu) */}
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700 inline-block">
                  Alustavale meistrile
                </span>
                <h3 className="text-2xl font-black text-stone-900">TASUTA</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Ideaalne uuele meistrile oma nime ja portfoolio tutvustamiseks ning esimeste tööde võitmiseks.
                </p>
              </div>

              {/* Price Display */}
              <div className="border-y border-stone-100 py-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-stone-900">0 €</span>
                  <span className="text-xs font-semibold text-stone-500">/ kuu</span>
                </div>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  Igavesti tasuta ilma varjatud tasudeta
                </span>
              </div>

              {/* Features List */}
              <div className="space-y-3 text-xs">
                <span className="font-bold text-stone-900 uppercase tracking-wider block text-[11px]">
                  Paketti kuulub:
                </span>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">Avalik meistri profiil:</strong>
                    <span className="text-stone-600 block">Kontaktandmed, kutsetunnistused ja piirkonnad</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">Tehtud tööde portfoolio:</strong>
                    <span className="text-stone-600 block">Enne/pärast fotogalerii ja töönäidised</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">5-palli hinnangud ja arvustused:</strong>
                    <span className="text-stone-600 block">Reaalsed klientide soovitused ja tärnid</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-700 shrink-0 mt-0.5 font-bold text-[11px]">
                    3
                  </div>
                  <div>
                    <strong className="text-stone-900">Kuni 3 pakkumise esitamist kuus:</strong>
                    <span className="text-stone-600 block">Kandideeri vabalt valitud 3 objektile igas kuus</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-stone-400 shrink-0 mt-0.5">
                    <XIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-stone-400">Esiletõstetud kuldne PRO märgis (puudub)</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-stone-400 shrink-0 mt-0.5">
                    <XIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-stone-400">Reaalajas SMS teavitused uutest töödest (puudub)</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleStartCheckout('free')}
              className="w-full font-bold border-stone-300 hover:bg-stone-50"
            >
              Alusta tasuta paketiga
            </Button>
          </div>

          {/* PLAN 2: PRO (9.90 € / kuu) */}
          <div className="relative rounded-3xl border-2 border-orange-500 bg-white p-8 shadow-xl flex flex-col justify-between space-y-8">
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Kõige populaarsem valik</span>
            </div>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-900 inline-flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" /> PRO Meister
                  </span>
                </div>
                <h3 className="text-2xl font-black text-stone-900">PRO PAKETT</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Tegutsevale professionaalile ja plaatimisbrigaadile, kes soovib kindlustada kalendri aastaringselt.
                </p>
              </div>

              {/* Price Display */}
              <div className="border-y border-orange-100 py-4 bg-orange-50/50 -mx-8 px-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-stone-900">{proPrice} €</span>
                  <span className="text-xs font-semibold text-stone-500">/ kuu</span>
                </div>
                <span className="text-[11px] text-orange-800 font-medium block mt-0.5">
                  {proBilledText}
                </span>
              </div>

              {/* Features List */}
              <div className="space-y-3 text-xs">
                <span className="font-bold text-stone-900 uppercase tracking-wider block text-[11px]">
                  Kõik Tasuta paketi võimalused, pluss:
                </span>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shrink-0 mt-0.5 font-bold">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">Piiramatu pakkumiste esitamine:</strong>
                    <span className="text-stone-600 block">Esita ametlikke pakkumisi nii paljudele hangetele kui soovid</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shrink-0 mt-0.5">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">Esiletõstetud profiil otsingus:</strong>
                    <span className="text-stone-600 block">Kuldne PRO märk ja esmajärjekorras kuvamine tellijatele</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shrink-0 mt-0.5">
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">SMS & E-posti kiirteavitused reaalajas:</strong>
                    <span className="text-stone-600 block">Saa kohene teade mobiilile, kui sinu piirkonnas lisandub uus päring</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">Otsene kontakt & chat tellijaga:</strong>
                    <span className="text-stone-600 block">Tellija telefoninumber ja e-post koheselt kättesaadavad</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">AI materjalikalkulaatori PDF eksport:</strong>
                    <span className="text-stone-600 block">Koosta 1-klikiga ametlikud pakkumised Mira, Mapei või Kiilto normidega</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <strong className="text-stone-900">Partnerite püsiallahindlused:</strong>
                    <span className="text-stone-600 block">Rubi plaadilõikurid -15%, ehituskeemia erihinnad</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="amber"
              size="lg"
              onClick={() => handleStartCheckout('pro')}
              className="w-full font-bold text-sm shadow-md gap-2"
            >
              <span>Vali PRO pakett (14 päeva tasuta)</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight text-center">
            Pakettide üksikasjalik funktsioonide võrdlus
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-3 px-4 font-bold text-stone-900">Funktsionaalsus</th>
                  <th className="py-3 px-4 font-bold text-stone-700 text-center w-36">TASUTA (0 €)</th>
                  <th className="py-3 px-4 font-bold text-orange-600 text-center w-36 bg-orange-50/50 rounded-t-xl">
                    PRO (9.90 €)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-800">Pakkumiste esitamine kuus</td>
                  <td className="py-3 px-4 text-center text-stone-600 font-semibold">Kuni 3 tk</td>
                  <td className="py-3 px-4 text-center text-orange-600 font-bold bg-orange-50/50">Piiramatu ∞</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-800">Profiil ja kontaktandmed veebis</td>
                  <td className="py-3 px-4 text-center text-emerald-600">✓ Jah</td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-orange-50/50">✓ Jah</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-800">Enne / pärast fotogalerii</td>
                  <td className="py-3 px-4 text-center text-emerald-600">✓ Jah</td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-orange-50/50">✓ Jah</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-800">Klientide 5-tärni arvustused</td>
                  <td className="py-3 px-4 text-center text-emerald-600">✓ Jah</td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-orange-50/50">✓ Jah</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-800">Esiletõstetud profiil otsingus</td>
                  <td className="py-3 px-4 text-center text-stone-300">✕ Ei</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold bg-orange-50/50">✓ Kuldne PRO</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-800">Reaalajas SMS teavitused uutest hangetest</td>
                  <td className="py-3 px-4 text-center text-stone-300">✕ Ei</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold bg-orange-50/50">✓ Koheselt mobiilile</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-800">Otsene chat tellijaga</td>
                  <td className="py-3 px-4 text-center text-stone-600">Standardne</td>
                  <td className="py-3 px-4 text-center text-orange-600 font-bold bg-orange-50/50">Kiirühendus</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-800">Pakkumiste PDF & Excel eksport</td>
                  <td className="py-3 px-4 text-center text-stone-300">✕ Ei</td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-orange-50/50">✓ Jah</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-stone-800">Partnerite tööriistasoodustused</td>
                  <td className="py-3 px-4 text-center text-stone-300">✕ Ei</td>
                  <td className="py-3 px-4 text-center text-emerald-600 bg-orange-50/50">✓ Kuni -20%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-1 mb-6">
            <h3 className="text-xl font-bold text-stone-900">Korduma kippuvad küsimused</h3>
            <p className="text-xs text-stone-500">Kõik, mida pead teadma Plaatija24 meistrite pakettide kohta.</p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Mis saab pärast seda, kui 3 tasuta pakkumist kuus on ära kasutatud?</span>
              </h4>
              <p className="text-xs text-stone-600 pl-6 leading-relaxed">
                Tasuta paketiga uueneb 3 pakkumise limiit iga kalendrikuu 1. päeval. Kui soovid kuu jooksul esitada rohkem pakkumisi, saad oma töölaualt 1-klikiga aktiveerida PRO paketi (9.90 €/kuu), millega kaob pakkumiste limiit täielikult.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Kas PRO paketti saab igal ajal tühistada?</span>
              </h4>
              <p className="text-xs text-stone-600 pl-6 leading-relaxed">
                Jah. Meil puuduvad pikaajalised siduvad lepingud. Saad oma PRO paketi igal ajal oma meistri seadetest ühe nupuvajutusega peatada ning sinu konto läheb tagasi Tasuta paketile.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Kuidas toimivad reaalajas SMS teavitused?</span>
              </h4>
              <p className="text-xs text-stone-600 pl-6 leading-relaxed">
                PRO meistrid saavad oma profiilil määrata teenindatavad piirkonnad (nt. Tallinn, Harjumaa, Tartu). Niipea kui neis piirkondades sisestab klient uue vannitoa või plaatimistöö päringu, saabub meistri telefonile SMS teade otselingiga tööpakkumisele.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CHECKOUT / UPGRADE MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {selectedPlanForCheckout === 'pro' ? 'Aktiveeri PRO Meister pakett' : 'Aktiveeri TASUTA pakett'}
                </h3>
                <span className="text-xs text-stone-500">
                  {selectedPlanForCheckout === 'pro' ? `${proPrice} € / kuus (14p tasuta proov)` : '0 € / kuus'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-stone-900">Pakett edukalt aktiveeritud!</h4>
                <p className="text-xs text-stone-500">
                  {selectedPlanForCheckout === 'pro'
                    ? 'Sinu PRO staatus, piiramatu pakkumiste arv ja SMS teavitused on nüüd aktiivsed.'
                    : 'Sinu tasuta meistrikonto on valmis pakkumiste tegemiseks.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCompleteSubscription} className="space-y-4">
                {selectedPlanForCheckout === 'pro' ? (
                  <>
                    <div className="rounded-xl bg-orange-50 border border-orange-200 p-3 text-xs text-orange-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-orange-600" />
                        <span>14-päevane tasuta prooviperiood</span>
                      </div>
                      <p className="text-[11px] text-orange-800">
                        Esimene makse toimub alles 14 päeva möödumisel. Tühista enne seda igal ajal ilma tasuta.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Vali makseviis
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="border-2 border-orange-500 bg-orange-50/30 rounded-xl p-3 font-semibold text-stone-800 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-orange-600" />
                          <span>Eesti Pangalink</span>
                        </div>
                        <div className="border border-stone-200 rounded-xl p-3 font-medium text-stone-600 flex items-center gap-2 hover:bg-stone-50 cursor-pointer">
                          <CreditCard className="w-4 h-4 text-stone-400" />
                          <span>Krediitkaart</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {['Swedbank', 'SEB', 'LHV', 'Luminor'].map((bank) => (
                        <div
                          key={bank}
                          className="rounded-lg border border-stone-200 bg-stone-50 py-2 text-center text-[11px] font-bold text-stone-800 hover:border-orange-500 cursor-pointer transition-all"
                        >
                          {bank}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-stone-600 space-y-2">
                    <p>
                      Tasuta paketiga saad koheselt ligipääsu meistri töölauale ja esitada kuni 3 pakkumist kuus.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 pt-2">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Turvaline makseplatvorm: Montonio / Stripe SSL</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCheckoutOpen(false)}
                  >
                    Loobu
                  </Button>
                  <Button type="submit" variant="amber" size="sm" className="font-bold">
                    {selectedPlanForCheckout === 'pro' ? 'Kinnita ja alusta prooviperioodi' : 'Kinnita tasuta pakett'}
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
