import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Rocket, ArrowRight, MessageSquare, CheckCircle, RefreshCw, 
  Sparkles, ShieldAlert, Lock, Zap, BarChart3, Package, Layers, Globe, ChevronDown, Smartphone, Bell, TrendingUp, DollarSign
} from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const COUNTRIES = [
    { code: '+51', flag: '🇵🇪', name: 'Perú' },
    { code: '+52', flag: '🇲🇽', name: 'México' },
    { code: '+57', flag: '🇨🇴', name: 'Colombia' },
    { code: '+54', flag: '🇦🇷', name: 'Argentina' },
    { code: '+34', flag: '🇪🇸', name: 'España' },
    { code: '+56', flag: '🇨🇱', name: 'Chile' },
    { code: '+1', flag: '🇺🇸', name: 'USA' },
];

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'CLIENT' | 'DEMO'>('CLIENT');
  const [loading, setLoading] = useState(false);
  
  // Login State
  const [loginStep, setLoginStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [countryCode, setCountryCode] = useState('+51');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // God Mode
  const [logoClicks, setLogoClicks] = useState(0);
  const [showGodMode, setShowGodMode] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [godError, setGodError] = useState('');

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const newCount = prev + 1;
      if (newCount === 4) {
        setShowGodMode(true);
        return 0;
      }
      return newCount;
    });
    setTimeout(() => setLogoClicks(0), 1000);
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoginStep('OTP');
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        if (activeTab === 'CLIENT') {
            onLogin({ id: `user-${phoneNumber}`, name: 'Emprendedor PosGo!', role: 'cashier' });
        } else {
            const fullPhone = `${countryCode} ${phoneNumber}`;
            onLogin({ 
                id: 'test-user-demo', 
                name: `Lead: ${fullPhone}`, 
                role: 'admin' 
            });
        }
    }, 1500);
  };

  const handleTabSwitch = (tab: 'CLIENT' | 'DEMO') => {
      setActiveTab(tab);
      setLoginStep('PHONE');
      setPhoneNumber('');
      setOtpCode('');
      setGodError('');
  };

  const handleGodModeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterPassword === 'Luis2021') {
       onLogin({ id: 'god-mode', name: 'Super Admin', role: 'admin' });
    } else {
       setGodError('Acceso Denegado');
       setMasterPassword('');
    }
  };

  const currentCountry = COUNTRIES.find(c => c.code === countryCode);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-inter overflow-hidden relative selection:bg-indigo-500 selection:text-white">
        
        {/* ANIMATED BACKGROUND MESH */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-50">
            <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-teal-200/40 rounded-full blur-[100px] animate-blob mix-blend-multiply opacity-70"></div>
            <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-200/40 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply opacity-70"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-purple-200/40 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply opacity-70"></div>
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {/* LEFT PANEL: INTERACTIVE VISUALIZATION */}
        <div className="hidden lg:flex lg:w-[55%] relative z-10 flex-col justify-center items-center p-12">
             
             {/* TEXTO EN CABECERA (MOVIDO ARRIBA) */}
             <div className="mb-12 text-center max-w-xl z-20">
                 <h1 className="text-5xl font-black text-slate-800 tracking-tight mb-4 leading-tight">
                     Todo tu negocio <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">en una sola pantalla.</span>
                 </h1>
                 <p className="text-slate-500 text-lg font-medium">
                     Sin complicaciones técnicas. Entra, vende y crece.
                 </p>
             </div>

             {/* THE "LIVE SYSTEM" MOCKUP */}
             <div className="relative w-full max-w-lg aspect-square">
                
                {/* Central Dashboard Card */}
                <div className="absolute inset-0 m-auto w-full h-full max-w-md max-h-[400px] bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-2xl shadow-indigo-200/50 flex flex-col overflow-hidden animate-float">
                    
                    {/* Mock Header */}
                    <div className="h-16 border-b border-white/50 flex items-center justify-between px-8">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                    </div>

                    {/* Mock Content */}
                    <div className="p-8 flex-1 relative">
                        {/* Abstract Chart */}
                        <div className="flex items-end justify-between h-32 gap-3 mb-8 px-2">
                            <div className="w-full bg-indigo-100/50 rounded-t-xl h-[40%] animate-pulse"></div>
                            <div className="w-full bg-indigo-200/50 rounded-t-xl h-[70%] animate-pulse" style={{animationDelay: '100ms'}}></div>
                            <div className="w-full bg-indigo-300/50 rounded-t-xl h-[50%] animate-pulse" style={{animationDelay: '200ms'}}></div>
                            <div className="w-full bg-indigo-500 rounded-t-xl h-[90%] shadow-lg shadow-indigo-300/50"></div>
                            <div className="w-full bg-indigo-200/50 rounded-t-xl h-[60%] animate-pulse" style={{animationDelay: '300ms'}}></div>
                        </div>

                        {/* List Items */}
                        <div className="space-y-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-10 w-full bg-white/50 rounded-xl flex items-center gap-3 px-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-100"></div>
                                    <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Notification 1: New Sale */}
                <div className="absolute top-[10%] right-[-5%] bg-white p-4 rounded-2xl shadow-xl shadow-emerald-100/50 border border-white/60 animate-float-slow flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <DollarSign className="w-5 h-5"/>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Nueva Venta</p>
                        <p className="font-black text-slate-800">+ S/ 125.00</p>
                    </div>
                </div>

                {/* Floating Notification 2: Analytics */}
                <div className="absolute bottom-[20%] left-[-5%] bg-white p-4 rounded-2xl shadow-xl shadow-indigo-100/50 border border-white/60 animate-float animation-delay-2000 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <TrendingUp className="w-5 h-5"/>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Crecimiento</p>
                        <p className="font-black text-slate-800">+ 24% Hoy</p>
                    </div>
                </div>
             </div>
        </div>

        {/* RIGHT PANEL: LOGIN / CTA */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 lg:p-12 relative z-20">
            <div className="w-full max-w-[440px]">
                
                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center mb-8">
                    <button onClick={handleLogoClick} className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[2rem] flex items-center justify-center shadow-lg transform rotate-3">
                        <Rocket className="w-10 h-10 text-white"/>
                    </button>
                </div>

                {/* GLASS CARD */}
                <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden">
                    
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500"></div>

                    <div className="text-center mb-8 mt-2">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                            {activeTab === 'CLIENT' ? '¡Bienvenido de nuevo!' : 'Prueba Gratis Hoy'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {activeTab === 'CLIENT' ? 'Ingresa a tu panel de control.' : 'Acceso inmediato. Sin tarjetas de crédito.'}
                        </p>
                    </div>

                    {/* TABS - VISUAL TOGGLE */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 relative z-10">
                        <button 
                            onClick={() => handleTabSwitch('CLIENT')}
                            className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'CLIENT' ? 'bg-white text-slate-900 shadow-md transform scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Soy Cliente
                        </button>
                        <button 
                            onClick={() => handleTabSwitch('DEMO')}
                            className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'DEMO' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 transform scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Sparkles className="w-4 h-4"/> Quiero Probar
                        </button>
                    </div>

                    {/* FORM CONTAINER */}
                    <div className="min-h-[220px]">
                       {loginStep === 'PHONE' ? (
                        <form onSubmit={handleSendCode} className="space-y-6 animate-fade-in">
                            <div className="space-y-2">
                                 <div className="flex justify-between px-1">
                                     <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                        {activeTab === 'CLIENT' ? 'Tu Número de Celular' : 'WhatsApp para Demo'}
                                     </label>
                                 </div>
                                 <div className="flex items-center gap-3 bg-white border-2 border-slate-100 rounded-2xl p-3 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50 transition-all shadow-sm group">
                                    
                                    {/* Country Selector */}
                                    <div className="relative pl-1 border-r border-slate-100 pr-2">
                                        <select 
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="appearance-none bg-transparent font-black text-slate-700 outline-none w-full h-full absolute inset-0 opacity-0 cursor-pointer z-10"
                                        >
                                            {COUNTRIES.map(c => (
                                                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                                            ))}
                                        </select>
                                        <div className="flex items-center gap-1">
                                            <span className="text-2xl">{currentCountry?.flag}</span>
                                            <ChevronDown className="w-3 h-3 text-slate-300"/>
                                        </div>
                                    </div>

                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-transparent outline-none font-black text-xl text-slate-800 placeholder:text-slate-300 h-full tracking-wide transition-all group-focus-within:tracking-normal"
                                        placeholder="900 000 000"
                                        autoFocus
                                    />
                                 </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || phoneNumber.length < 4}
                                className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden ${
                                    activeTab === 'CLIENT' 
                                    ? 'bg-slate-900 text-white hover:scale-[1.02]' 
                                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-[1.02] shadow-indigo-200'
                                }`}
                            >
                                {/* Shimmer Effect */}
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shimmer" />

                                {loading ? <RefreshCw className="w-5 h-5 animate-spin"/> : (
                                    <>
                                        {activeTab === 'CLIENT' ? 'INGRESAR AHORA' : 'OBTENER DEMO'} 
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                                    </>
                                )}
                            </button>
                        </form>
                       ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4 border-2 border-emerald-100 shadow-sm animate-bounce">
                                    <MessageSquare className="w-8 h-8 fill-current"/>
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-1">Código Enviado</h3>
                                <p className="text-sm text-slate-500">
                                    Revisa tu WhatsApp o SMS al <br/><span className="font-black text-slate-800">{countryCode} {phoneNumber}</span>
                                </p>
                                <button type="button" onClick={() => setLoginStep('PHONE')} className="text-xs font-black text-indigo-500 hover:underline mt-4 uppercase tracking-widest">
                                    Corregir Número
                                </button>
                            </div>
                            
                            <div className="flex justify-center my-4">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full text-center bg-white border-2 border-slate-100 rounded-2xl py-4 font-black text-4xl tracking-[0.3em] text-slate-800 outline-none focus:border-indigo-500 focus:shadow-lg transition-all placeholder:text-slate-100"
                                    placeholder="000000"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otpCode.length < 4}
                                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                            >
                                {loading ? <RefreshCw className="w-5 h-5 animate-spin"/> : <>VALIDAR Y ENTRAR <CheckCircle className="w-5 h-5"/></>}
                            </button>
                        </form>
                       )}
                    </div>
                </div>

                <div className="mt-8 text-center space-y-3">
                    <p className="text-[10px] font-medium text-slate-400">
                        Al continuar, aceptas nuestros <a href="#" className="text-indigo-500 hover:underline font-bold">Términos de Uso</a>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <span>Software by</span>
                        <a href="https://gaorsystem.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-300 hover:text-indigo-500 transition-colors">
                            <Globe className="w-3 h-3"/> GaorSystemPeru
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {/* GOD MODE MODAL */}
        {showGodMode && (
             <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
                 <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-fade-in-up text-center relative overflow-hidden border-4 border-slate-900">
                     <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-red-100 rotate-12">
                         <ShieldAlert className="w-10 h-10 text-red-600 -rotate-12"/>
                     </div>
                     <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Super Admin</h2>
                     <p className="text-slate-400 text-xs mb-8 font-black uppercase tracking-wide">Acceso Master</p>
                     
                     <form onSubmit={handleGodModeLogin} className="space-y-4">
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-600 transition-colors"/>
                            <input 
                                type="password" 
                                value={masterPassword}
                                onChange={e => setMasterPassword(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-black outline-none focus:border-red-600 focus:bg-white transition-all placeholder:text-slate-300 text-lg"
                                placeholder="******"
                                autoFocus
                            />
                        </div>
                        {godError && <p className="text-red-600 text-xs font-black animate-pulse bg-red-50 py-2 rounded-xl border border-red-100">{godError}</p>}
                        
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowGodMode(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-100 rounded-2xl transition-colors text-sm">Cancelar</button>
                            <button type="submit" className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-red-200 transition-all text-sm hover:scale-105">Desbloquear</button>
                        </div>
                     </form>
                 </div>
             </div>
        )}
    </div>
  );
};