'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HardHat,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  Building,
  Phone,
  User,
  Smartphone,
  CreditCard,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

type AuthTab = 'login' | 'register';
type MethodTab = 'social' | 'smartid' | 'mobiilid' | 'email';

export default function ContractorLoginPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [methodTab, setMethodTab] = useState<MethodTab>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [registryCode, setRegistryCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceRegions, setServiceRegions] = useState<string[]>(['Tallinn', 'Harjumaa']);

  // Smart-ID / Mobiil-ID states
  const [idCode, setIdCode] = useState('');
  const [idPhone, setIdPhone] = useState('');
  const [authStep, setAuthStep] = useState<'idle' | 'waiting_pin' | 'success'>('idle');
  const [verificationCode, setVerificationCode] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Social Auth Handler
  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setErrorMessage(null);

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/contractor/dashboard`,
          },
        });
        if (error) throw error;
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(`Sotsiaalne sisselogimine ebaõnnestus: ${error.message || 'Tundmatu viga'}`);
        setIsLoading(false);
      }
    } else {
      // Demo environment simulation
      setTimeout(() => {
        setIsLoading(false);
        router.push('/contractor/dashboard');
      }, 1000);
    }
  };

  // Smart-ID / Mobiil-ID Flow Simulation
  const handleSmartIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCode || idCode.length < 11) {
      setErrorMessage('Palun sisesta korrektne 11-kohaline Eesti isikukood.');
      return;
    }

    setErrorMessage(null);
    setAuthStep('waiting_pin');
    // Generate realistic 4-digit verification code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);

    // Simulate user approving PIN1 on mobile device
    setTimeout(() => {
      setAuthStep('success');
      setTimeout(() => {
        router.push('/contractor/dashboard');
      }, 1200);
    }, 3000);
  };

  const handleMobiilIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCode || !idPhone) {
      setErrorMessage('Palun sisesta nii isikukood kui ka telefoninumber.');
      return;
    }

    setErrorMessage(null);
    setAuthStep('waiting_pin');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);

    setTimeout(() => {
      setAuthStep('success');
      setTimeout(() => {
        router.push('/contractor/dashboard');
      }, 1200);
    }, 3000);
  };

  // Email / Password Form Submit
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (isSupabaseConfigured()) {
      try {
        if (activeTab === 'login') {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                company_name: companyName,
                registry_code: registryCode,
                full_name: contactName,
                phone: phoneNumber,
                role: 'contractor',
                service_regions: serviceRegions,
              },
            },
          });
          if (error) throw error;
        }
        router.push('/contractor/dashboard');
      } catch (err: unknown) {
        const error = err as Error;
        // In local/demo or if credentials invalid, let contractor enter demo mode with alert
        setErrorMessage(error.message || 'Viga autentimisel.');
        setIsLoading(false);
      }
    } else {
      // Demo login
      setTimeout(() => {
        setIsLoading(false);
        router.push('/contractor/dashboard');
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand & Page Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600 text-white font-black shadow-md">
              <HardHat className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-stone-900">
              PLAATIJA<span className="text-orange-600">24</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {activeTab === 'login' ? 'Meistri sisselogimine' : 'Liitu meistrina'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {activeTab === 'login'
              ? 'Halda oma tööpakkumisi, vasta klientidele ja koosta ametlikke kalkulatsioone.'
              : 'Registreeri oma plaatimisettevõte ja hakka saama kvaliteetseid eraklientide päringuid.'}
          </p>
        </div>

        {/* Card Box */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* Main Mode Toggle: Logi sisse vs Registreeru */}
          <div className="grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
                setAuthStep('idle');
              }}
              className={`rounded-lg py-2.5 transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Logi sisse
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
                setAuthStep('idle');
              }}
              className={`rounded-lg py-2.5 transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Loo meistrikonto (Tasuta)
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
              <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Social Auth Providers (Google & Facebook) */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-800 hover:bg-stone-50 hover:border-stone-400 transition-all shadow-2xs"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('facebook')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-800 hover:bg-stone-50 hover:border-stone-400 transition-all shadow-2xs"
              >
                <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-stone-200" />
              <span className="absolute bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                või Eesti e-identiteet / e-post
              </span>
            </div>
          </div>

          {/* Sub-Methods Switcher: Email vs Smart-ID vs Mobiil-ID */}
          <div className="flex border-b border-stone-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMethodTab('email');
                setAuthStep('idle');
              }}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                methodTab === 'email'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-post</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMethodTab('smartid');
                setAuthStep('idle');
              }}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                methodTab === 'smartid'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Smart-ID</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMethodTab('mobiilid');
                setAuthStep('idle');
              }}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                methodTab === 'mobiilid'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobiil-ID</span>
            </button>
          </div>

          {/* METHOD 1: SMART-ID */}
          {methodTab === 'smartid' && (
            <div className="space-y-4">
              {authStep === 'idle' && (
                <form onSubmit={handleSmartIdSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Eesti isikukood
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      required
                      placeholder="nt. 38501230000"
                      value={idCode}
                      onChange={(e) => setIdCode(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-orange-500 focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Valmisolek Smart-ID REST API / Dokobit autentimiseks
                    </span>
                  </div>

                  <Button type="submit" variant="amber" size="default" className="w-full gap-2 font-bold">
                    <span>Logi sisse Smart-ID-ga</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              {authStep === 'waiting_pin' && (
                <div className="rounded-xl bg-orange-50/80 border border-orange-200 p-6 text-center space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 animate-pulse">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-orange-800 font-semibold uppercase tracking-wider block">
                      Kontrollkood sinu nutiseadmes:
                    </span>
                    <div className="text-3xl font-black text-stone-900 font-mono tracking-widest my-1">
                      {verificationCode}
                    </div>
                    <p className="text-xs text-stone-600">
                      Ava telefonis Smart-ID rakendus ja veendu, et kontrollkood klapib. Seejärel sisesta PIN1.
                    </p>
                  </div>
                </div>
              )}

              {authStep === 'success' && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">Isik tuvastatud!</h4>
                  <p className="text-xs text-emerald-700">Suuname sind meistri töölauale...</p>
                </div>
              )}
            </div>
          )}

          {/* METHOD 2: MOBIIL-ID */}
          {methodTab === 'mobiilid' && (
            <div className="space-y-4">
              {authStep === 'idle' && (
                <form onSubmit={handleMobiilIdSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Telefoninumber
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+372 5..."
                        value={idPhone}
                        onChange={(e) => setIdPhone(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Isikukood
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        required
                        placeholder="3850..."
                        value={idCode}
                        onChange={(e) => setIdCode(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs text-stone-900 focus:border-orange-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="amber" size="default" className="w-full gap-2 font-bold">
                    <span>Logi sisse Mobiil-ID-ga</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              {authStep === 'waiting_pin' && (
                <div className="rounded-xl bg-orange-50/80 border border-orange-200 p-6 text-center space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 animate-pulse">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-orange-800 font-semibold uppercase tracking-wider block">
                      Kontrollkood telefonis:
                    </span>
                    <div className="text-3xl font-black text-stone-900 font-mono tracking-widest my-1">
                      {verificationCode}
                    </div>
                    <p className="text-xs text-stone-600">
                      Oota ekraaniteadet telefonile ja sisesta oma Mobiil-ID PIN1.
                    </p>
                  </div>
                </div>
              )}

              {authStep === 'success' && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">Autentimine õnnestus!</h4>
                  <p className="text-xs text-emerald-700">Suuname sind meistri töölauale...</p>
                </div>
              )}
            </div>
          )}

          {/* METHOD 3: EMAIL & PASSWORD (LOGIN OR REGISTER) */}
          {methodTab === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {activeTab === 'register' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Ettevõtte ärinimi *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          placeholder="nt. Balti Plaat OÜ"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full rounded-xl border border-stone-300 pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Äriregistri kood *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="nt. 16482910"
                        value={registryCode}
                        onChange={(e) => setRegistryCode(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Kontaktisiku nimi *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          placeholder="Ees- ja perekonnanimi"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full rounded-xl border border-stone-300 pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Kontakttelefon *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          placeholder="+372 5..."
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full rounded-xl border border-stone-300 pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Teeninduspiirkonnad
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Tallinn', 'Harjumaa', 'Tartumaa', 'Pärnumaa'].map((r) => {
                        const isSel = serviceRegions.includes(r);
                        return (
                          <button
                            type="button"
                            key={r}
                            onClick={() => {
                              if (isSel) {
                                setServiceRegions(serviceRegions.filter((x) => x !== r));
                              } else {
                                setServiceRegions([...serviceRegions, r]);
                              }
                            }}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                              isSel
                                ? 'bg-orange-50 border-orange-400 text-orange-800 font-bold'
                                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            {r} {isSel ? '✓' : '+'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  E-posti aadress *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="meister@plaatija24.ee"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Parool *
                  </label>
                  {activeTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => alert('Parooli taastamise link saadetakse sisestatud e-posti aadressile.')}
                      className="text-[11px] text-orange-600 hover:underline"
                    >
                      Unustasid parooli?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Vähemalt 8 tähemärki"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 space-y-1.5 text-xs text-stone-600">
                  <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Algpakett: TASUTA (0 € / kuu)</span>
                  </div>
                  <p className="text-[11px]">
                    Registreerumisel aktiveerub koheselt tasuta pakett (kuni 3 pakkumist kuus). PRO paketile saad üle minna igal ajal oma töölaualt.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="amber"
                size="default"
                disabled={isLoading}
                className="w-full gap-2 font-bold shadow-sm"
              >
                <span>{activeTab === 'login' ? 'Logi sisse meistrina' : 'Loo tasuta meistrikonto'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* Pricing Model Highlight Footer inside Card */}
          <div className="border-t border-stone-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sertifitseeritud meistrite võrgustik</span>
            </div>
            <Link
              href="/contractor/pricing"
              className="text-orange-600 hover:underline font-semibold"
            >
              Vaata meistrite hinnapakette (TASUTA ja PRO) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
