import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingTourProps {
    isOpen: boolean;
    onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onComplete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-[3rem] p-10 max-w-md text-center shadow-2xl relative overflow-hidden animate-fade-in-up">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-500"></div>
                <div className="w-20 h-20 bg-gradient-to-tr from-violet-100 to-fuchsia-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-violet-600 rotate-6 shadow-lg shadow-violet-100">
                    <Sparkles className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4">¡Bienvenido a Lumina!</h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                    Has ingresado al modo demo. Explora la interfaz de venta, agrega productos al carrito y prueba el control de caja.
                </p>
                <button onClick={onComplete} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-xl">
                    Comenzar Recorrido <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                </button>
            </div>
        </div>
    );
};
