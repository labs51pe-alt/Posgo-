import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Rocket, ArrowRight, MessageSquare, CheckCircle, RefreshCw, 
  Sparkles, ShieldAlert, Lock, Zap, BarChart3, Package, Layers, Globe, ChevronDown, Smartphone
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
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-100/30 rounded-full blur-[120px] mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-100/30 rounded-full blur-[120px] mix-blend-multiply"></div>
        </div>

        {/* LEFT PANEL: PROFESSIONAL SHOWCASE */}
        <div className="hidden lg:flex lg:w-[55%] relative z-10 flex-col justify-between p-16 bg-white/40 backdrop-blur-sm border-r border-white/50">
             
             {/* Header */}
             <div>
                 <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                         <Rocket className="w-5 h-5 text-white" />
                     </div>
                     <span className="text-xl font-black text-slate-800 tracking-tight">PosGo!</span>
                 </div>
                 <h1 className="text-5xl font-black text-slate-800 leading-[1.1] mb-6">
                     La plataforma integral <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">que tu negocio merece.</span>
                 </h1>
                 <p className="text-slate-500 text-lg max-w-lg leading-relaxed">
                     Simplificamos la tecnología para que tú solo te preocupes por vender más. Gestión profesional al alcance de todos.
                 </p>
             </div>

             {/* BENTO GRID FEATURES */}
             <div className="grid grid-cols-2 gap-4 mt-8">
                 {/* Card 1 */}
                 <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                     <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                         <Zap className="w-6 h-6"/>
                     </div>
                     <h3 className="font-bold text-slate-800 mb-1">Punto de Venta Ágil</h3>
                     <p className="text-xs text-slate-400 leading-relaxed">Cobra en segundos. Interfaz diseñada para evitar filas y errores.</p>
                 </div>

                 {/* Card 2 */}
                 <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                     <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                         <Package className="w-6 h-6"/>
                     </div>
                     <h3 className="font-bold text-slate-800 mb-1">Inventario Real</h3>
                     <p className="text-xs text-slate-400 leading-relaxed">Control de stock automático. Alertas inteligentes de reposición.</p>
                 </div>

                 {/* Card 3 (Full Width) */}
                 <div className="col-span-2 p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] shadow-lg text-white relative overflow-hidden group">
                     <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                         <BarChart3 className="w-32 h-32"/>
                     </div>
                     <div className="relative z-10 flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                             <BarChart3 className="w-6 h-6 text-emerald-400"/>
                         </div>
                         <div>
                             <h3 className="font-bold text-lg">Reportes Inteligentes</h3>
                             <p className="text-xs text-slate-400">Toma decisiones basadas en datos, no en intuición.</p>
                         </div>
                     </div>
                 </div>
             </div>

             {/* Footer Trust */}
             <div className="flex items-center gap-6 pt-8 border-t border-slate-200/50">
                 <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                             IMG
                         </div>
                     ))}
                 </div>
                 <div className="text-xs font-medium text-slate-500">
                     <span className="font-bold text-slate-800">Cientos de comercios</span> confían en PosGo!
                 </div>
             </div>
        </div>

        {/* RIGHT PANEL: LOGIN / CTA */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 lg:p-12 relative z-20 bg-white/50">
            <div className="w-full max-w-[420px]">
                
                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center mb-8">
                    <button onClick={handleLogoClick} className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                        <Rocket className="w-8 h-8 text-white"/>
                    </button>
                </div>

                <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                    
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                            {activeTab === 'CLIENT' ? 'Acceso a Clientes' : 'Empieza Gratis'}
                        </h2>
                        <p className="text-slate-400 text-sm font-medium">
                            {activeTab === 'CLIENT' ? 'Gestiona tu negocio desde cualquier lugar.' : 'Prueba el sistema completo sin compromiso.'}
                        </p>
                    </div>

                    {/* PROFESSIONAL TABS */}
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100">
                        <button 
                            onClick={() => handleTabSwitch('CLIENT')}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'CLIENT' ? 'bg-white text-slate-800 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Soy Cliente
                        </button>
                        <button 
                            onClick={() => handleTabSwitch('DEMO')}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'DEMO' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Sparkles className="w-3 h-3"/> Quiero Probar
                        </button>
                    </div>

                    {/* FORM */}
                    <div className="min-h-[220px]">
                       {loginStep === 'PHONE' ? (
                        <form onSubmit={handleSendCode} className="space-y-5 animate-fade-in">
                            <div>
                                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                                    {activeTab === 'CLIENT' ? 'Celular Registrado' : 'WhatsApp de Contacto'}
                                 </label>
                                 <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                                    
                                    {/* Country Selector */}
                                    <div className="relative pl-1 border-r border-slate-200 pr-2">
                                        <select 
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="appearance-none bg-transparent font-bold text-slate-700 outline-none w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                                        >
                                            {COUNTRIES.map(c => (
                                                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                                            ))}
                                        </select>
                                        <div className="flex items-center gap-1 pointer-events-none">
                                            <span className="text-xl">{currentCountry?.flag}</span>
                                            <ChevronDown className="w-3 h-3 text-slate-400"/>
                                        </div>
                                    </div>

                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-transparent outline-none font-bold text-lg text-slate-800 placeholder:text-slate-300 h-full"
                                        placeholder="900 000 000"
                                        autoFocus
                                    />
                                 </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || phoneNumber.length < 4}
                                className={`w-full py-4 text-white rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group ${
                                    activeTab === 'CLIENT' 
                                    ? 'bg-slate-900 hover:bg-black hover:scale-[1.01]' 
                                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.01] shadow-indigo-200'
                                }`}
                            >
                                {loading ? <RefreshCw className="w-5 h-5 animate-spin"/> : (
                                    <>
                                        {activeTab === 'CLIENT' ? 'Ingresar al Panel' : 'Obtener Acceso Demo'} 
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                                    </>
                                )}
                            </button>
                        </form>
                       ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                    <MessageSquare className="w-6 h-6 fill-current"/>
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm mb-1">Código de Verificación</h3>
                                <p className="text-xs text-slate-500">
                                    Enviado al <span className="font-bold text-slate-700">{countryCode} {phoneNumber}</span>
                                </p>
                                <button type="button" onClick={() => setLoginStep('PHONE')} className="text-[10px] font-bold text-indigo-500 hover:underline mt-2 uppercase tracking-wide">
                                    Cambiar Número
                                </button>
                            </div>
                            
                            <div className="flex justify-center">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-full text-center bg-slate-50 border border-slate-200 rounded-2xl py-3 font-black text-3xl tracking-[0.5em] text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-200"
                                    placeholder="000000"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otpCode.length < 4}
                                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <RefreshCw className="w-5 h-5 animate-spin"/> : <>Validar Código <CheckCircle className="w-4 h-4"/></>}
                            </button>
                        </form>
                       )}
                    </div>
                </div>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-[10px] font-medium text-slate-400">
                        Al ingresar, aceptas nuestros <a href="#" className="text-indigo-500 hover:underline">Términos de Servicio</a>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        <span>Powered by</span>
                        <a href="https://gaorsystem.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-600 transition-colors">
                            <Globe className="w-3 h-3"/> GaorSystemPeru
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {/* GOD MODE MODAL */}
        {showGodMode && (
             <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
                 <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-fade-in-up text-center relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                     <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100 rotate-12">
                         <ShieldAlert className="w-8 h-8 text-red-500 -rotate-12"/>
                     </div>
                     <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Super Admin</h2>
                     <p className="text-slate-500 text-xs mb-8 font-bold uppercase tracking-wide">Acceso Restringido</p>
                     
                     <form onSubmit={handleGodModeLogin} className="space-y-4">
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-red-500 transition-colors"/>
                            <input 
                                type="password" 
                                value={masterPassword}
                                onChange={e => setMasterPassword(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-slate-300 text-lg"
                                placeholder="******"
                                autoFocus
                            />
                        </div>
                        {godError && <p className="text-red-500 text-xs font-bold animate-pulse bg-red-50 py-2 rounded-lg">{godError}</p>}
                        
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowGodMode(false)} className="flex-1 py-3 text-slate-400 font-bold hover:bg-slate-100 rounded-xl transition-colors text-sm">Salir</button>
                            <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all text-sm">Entrar</button>
                        </div>
                     </form>
                 </div>
             </div>
        )}
    </div>
  );
};