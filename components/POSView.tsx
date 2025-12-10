import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, ProductVariant, CartItem, Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { Cart } from './Cart';
import { Lock, Wallet, LayoutGrid, List, ScanBarcode, Search, Layers, ShoppingBasket, Plus, AlertCircle, X, Tag, Check, Package, TrendingUp, Sparkles, Filter, Keyboard } from 'lucide-react';

export const POSView = ({ products, cart, transactions = [], onAddToCart, onUpdateCart, onRemoveFromCart, onUpdateDiscount, onCheckout, onClearCart, settings, customers, activeShift, onOpenCashControl }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [posBarcodeBuffer, setPosBarcodeBuffer] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  
  // Variant Selection State
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);

  const barcodeRef = useRef<HTMLInputElement>(null);

  // Gradient Generator based on product name
  const getProductGradient = (name: string) => {
      const gradients = [
          'from-indigo-400 to-violet-500',
          'from-emerald-400 to-teal-500',
          'from-rose-400 to-pink-500',
          'from-amber-400 to-orange-500',
          'from-blue-400 to-indigo-500',
          'from-fuchsia-400 to-purple-500'
      ];
      // Simple hash to pick a stable color for the same product
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % gradients.length;
      return gradients[index];
  };

  // Smart Focus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('input') || target.closest('button') || target.closest('select') || target.closest('textarea') || target.closest('#pos-cart');
        if (!isInteractive && activeShift && barcodeRef.current) barcodeRef.current.focus();
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeShift]);

  useEffect(() => { if (activeShift && barcodeRef.current) barcodeRef.current.focus(); }, [activeShift]);

  // Calculate Shift Sales Live
  const shiftTotal = useMemo(() => {
    if (!activeShift) return 0;
    const shiftTransactions = transactions.filter((t: Transaction) => t.shiftId === activeShift.id);
    return shiftTransactions.reduce((sum: number, t: Transaction) => sum + t.total, 0);
  }, [transactions, activeShift]);

  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.barcode && p.barcode.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handlePosScanner = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          const scannedCode = posBarcodeBuffer.trim();
          if (scannedCode) {
              const product = products.find((p: Product) => p.barcode && p.barcode.toLowerCase() === scannedCode.toLowerCase());
              if (product) { 
                  handleProductClick(product);
                  setPosBarcodeBuffer(''); 
              } else { 
                  alert('Producto no encontrado'); 
                  setPosBarcodeBuffer(''); 
              }
          }
      }
  };

  const handleProductClick = (product: Product) => {
      if (product.stock <= 0 && !product.hasVariants) return; 
      if (product.hasVariants) {
          setSelectedProductForVariant(product);
          setIsVariantModalOpen(true);
      } else {
          onAddToCart(product);
      }
  };

  const handleVariantSelect = (variant: ProductVariant) => {
      if (!selectedProductForVariant) return;
      if (variant.stock <= 0) return;
      onAddToCart(selectedProductForVariant, variant.id);
      setIsVariantModalOpen(false);
      setSelectedProductForVariant(null);
      setTimeout(() => barcodeRef.current?.focus(), 100);
  };

  const getCartQuantity = (productId: string) => {
      return cart.filter((c: CartItem) => c.id === productId).reduce((sum: number, c: CartItem) => sum + c.quantity, 0);
  };

  if (!activeShift) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden bg-slate-50/50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/30 via-transparent to-transparent opacity-50"></div>
            <div className="bg-white/70 backdrop-blur-2xl p-12 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-white max-w-md w-full relative z-10 transform transition-all hover:scale-[1.01]">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-300 rotate-3">
                    <Lock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Caja Cerrada</h2>
                <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed px-6">
                    El punto de venta está en reposo. <br/>Inicia un turno para facturar.
                </p>
                <button 
                    onClick={() => onOpenCashControl('OPEN')} 
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                    <Wallet className="w-6 h-6 group-hover:rotate-12 transition-transform"/>
                    <span>Aperturar Turno</span>
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="h-full flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            
            {/* === LIVE DASHBOARD HEADER === */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-white shadow-sm p-5 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">EN VIVO</h2>
                            <p className="text-xs font-bold text-slate-500">Turno #{activeShift.id.slice(-4)}</p>
                        </div>
                    </div>

                    {/* Sales Metric */}
                    <div className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <TrendingUp className="w-5 h-5"/>
                        </div>
                        <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventas del Turno</p>
                             <p className="text-xl font-black text-slate-800">{settings.currency}{shiftTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                     <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200 transition-colors" title="Ver Atajos">
                        <Keyboard className="w-4 h-4"/> Atajos
                     </button>
                     <button 
                        id="pos-cash-control"
                        onClick={() => onOpenCashControl('IN')} 
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                    >
                        <Wallet className="w-4 h-4"/> Control Caja
                    </button>
                </div>
            </div>

            {/* === SCROLLABLE CONTENT === */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                
                {/* TOOLBAR */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* View Toggles */}
                    <div id="pos-view-toggles" className="flex gap-1 bg-white p-1.5 rounded-2xl border border-slate-100 items-center shrink-0 shadow-sm h-[64px]">
                        <button onClick={() => setViewMode('GRID')} className={`h-full aspect-square flex items-center justify-center rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}><LayoutGrid className="w-5 h-5"/></button>
                        <button onClick={() => setViewMode('LIST')} className={`h-full aspect-square flex items-center justify-center rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}><List className="w-5 h-5"/></button>
                    </div>

                    {/* Smart Scanner */}
                    <div id="pos-scanner-section" className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <ScanBarcode className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        <input 
                            ref={barcodeRef} 
                            type="text" 
                            placeholder="Escanear código de barras..." 
                            className="w-full h-[64px] pl-16 pr-4 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-lg text-slate-700 transition-all placeholder-slate-300 shadow-sm" 
                            value={posBarcodeBuffer} 
                            onChange={(e) => setPosBarcodeBuffer(e.target.value)} 
                            onKeyDown={handlePosScanner} 
                            autoFocus
                        />
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-2 text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 animate-fade-in">
                            <span>ENTER</span> para buscar
                        </div>
                    </div>

                     {/* Search Input */}
                     <div className="w-full md:w-64 relative shrink-0 h-[64px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"/>
                        <input 
                            type="text" 
                            placeholder="Buscar nombre..." 
                            className="w-full h-full pl-12 pr-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-sm text-slate-700" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* STICKY CATEGORIES BAR */}
                <div className="sticky top-0 z-20 -mx-6 px-6 py-4 bg-[#f8fafc]/90 backdrop-blur-md mb-2 flex gap-3 overflow-x-auto custom-scrollbar no-scrollbar items-center">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0"/>
                    <button onClick={() => setSelectedCategory('Todos')} className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${selectedCategory === 'Todos' ? 'bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>Todos</button>
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}>{cat}</button>
                    ))}
                </div>

                {/* PRODUCTS GRID */}
                <div id="pos-products-grid" className="min-h-[400px]">
                    {viewMode === 'GRID' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 pb-20">
                            {filteredProducts.map((p: Product, idx: number) => {
                                const isOutOfStock = p.stock <= 0 && !p.hasVariants;
                                const isLowStock = p.stock <= 5 && !isOutOfStock;
                                const inCartQty = getCartQuantity(p.id);
                                
                                return (
                                    <div 
                                        key={p.id} 
                                        onClick={() => handleProductClick(p)} 
                                        className={`
                                            bg-white p-5 rounded-[2.5rem] border transition-all duration-300 relative flex flex-col justify-between h-[240px] animate-fade-in-up
                                            ${isOutOfStock 
                                                ? 'opacity-60 grayscale cursor-not-allowed border-slate-100 bg-slate-50' 
                                                : `cursor-pointer group hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200/50 active:scale-95 
                                                ${inCartQty > 0 ? 'border-indigo-500 ring-4 ring-indigo-50/30' : 'border-slate-100 shadow-sm'}`}
                                        `}
                                        style={{animationDelay: `${idx * 40}ms`}}
                                    >
                                        {/* Dynamic Header */}
                                        <div className="flex justify-between items-start z-10 relative">
                                            {inCartQty > 0 ? (
                                                <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-indigo-300 animate-bounce">
                                                    {inCartQty} en canasta
                                                </div>
                                            ) : <div/>}

                                            {isOutOfStock ? (
                                                <div className="bg-slate-200 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase flex items-center gap-1">
                                                    <X className="w-3 h-3"/> Agotado
                                                </div>
                                            ) : (
                                                <div className={`
                                                    px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-sm
                                                    ${isLowStock 
                                                        ? 'bg-rose-100 text-rose-600 animate-pulse' 
                                                        : 'bg-emerald-100 text-emerald-700'}
                                                `}>
                                                    {p.stock} UN
                                                </div>
                                            )}
                                        </div>

                                        {/* Product "Avatar" */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className={`
                                                w-24 h-24 rounded-[1.5rem] flex items-center justify-center text-4xl font-black text-white shadow-inner
                                                bg-gradient-to-br ${getProductGradient(p.name)} 
                                                transition-transform duration-500 ${!isOutOfStock && 'group-hover:scale-125 group-hover:rotate-6'}
                                            `}>
                                                {p.name.substring(0,2).toUpperCase()}
                                            </div>
                                        </div>

                                        {/* Footer Info */}
                                        <div className="relative z-10 bg-white/90 backdrop-blur-sm p-3 rounded-2xl -mx-2 -mb-2 border border-slate-100">
                                            <h3 className="font-bold text-slate-800 leading-tight mb-1 truncate text-sm">{p.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-black text-slate-800 tracking-tight">{settings.currency}{p.price.toFixed(2)}</span>
                                                {!isOutOfStock && (
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${inCartQty > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110'}`}>
                                                        <Plus className="w-5 h-5"/>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80 backdrop-blur-sm text-xs font-bold uppercase text-slate-400 border-b border-slate-100 sticky top-0">
                                    <tr>
                                        <th className="p-5 pl-8">Producto</th>
                                        <th className="p-5">Stock</th>
                                        <th className="p-5 text-right">Precio</th>
                                        <th className="p-5 w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredProducts.map((p: Product) => {
                                        const isOutOfStock = p.stock <= 0 && !p.hasVariants;
                                        const inCartQty = getCartQuantity(p.id);
                                        return (
                                            <tr 
                                                key={p.id} 
                                                className={`transition-colors ${isOutOfStock ? 'opacity-50 grayscale bg-slate-50' : 'hover:bg-indigo-50/50 cursor-pointer active:bg-indigo-100/50'}`} 
                                                onClick={() => !isOutOfStock && handleProductClick(p)}
                                            >
                                                <td className="p-5 pl-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getProductGradient(p.name)} flex items-center justify-center text-white font-bold text-xs`}>
                                                            {p.name.substring(0,2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className={`font-bold ${inCartQty > 0 ? 'text-indigo-700' : 'text-slate-800'}`}>{p.name}</div>
                                                            <div className="text-xs text-slate-400 font-medium">{p.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`text-[10px] px-3 py-1 rounded-full font-black border ${p.stock <= 5 ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                                        {p.stock} UN
                                                    </span>
                                                </td>
                                                <td className="p-5 text-right font-black text-slate-700">{settings.currency}{p.price.toFixed(2)}</td>
                                                <td className="p-5 text-right">
                                                    {!isOutOfStock && (
                                                        <button className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${inCartQty > 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-500 hover:text-indigo-600'}`}>
                                                            {inCartQty > 0 ? <Check className="w-4 h-4"/> : <Plus className="w-4 h-4" />}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* EMPTY STATE ILLUSTRATION */}
                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                            <div className="w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative">
                                <Search className="w-16 h-16 text-slate-300" />
                                <div className="absolute top-0 right-0 w-12 h-12 bg-rose-400 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg animate-bounce">?</div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">No se encontraron productos</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mb-6">
                                Intenta con otro término de búsqueda o cambia la categoría.
                            </p>
                            <button onClick={() => {setSearchTerm(''); setSelectedCategory('Todos');}} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                Limpiar Filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
             {/* VARIANT MODAL */}
             {isVariantModalOpen && selectedProductForVariant && (
                <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-white">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-xl text-slate-800">Seleccionar Variante</h3>
                                <p className="text-sm font-medium text-indigo-500 mt-1">{selectedProductForVariant.name}</p>
                            </div>
                            <button onClick={() => setIsVariantModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-colors flex items-center justify-center shadow-sm"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-6 grid gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {selectedProductForVariant.variants?.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => handleVariantSelect(v)}
                                    disabled={v.stock <= 0}
                                    className={`p-5 rounded-[1.5rem] border text-left transition-all relative overflow-hidden group ${v.stock <= 0 ? 'opacity-60 bg-slate-50 cursor-not-allowed' : 'bg-white hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1'}`}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <span className="font-bold text-slate-800 text-lg">{v.name}</span>
                                            <p className="text-indigo-600 font-black">{settings.currency}{v.price.toFixed(2)}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-black ${v.stock > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                            {v.stock > 0 ? `${v.stock} UN` : 'AGOTADO'}
                                        </div>
                                    </div>
                                    {v.stock > 0 && <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50/30 transition-colors duration-300"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div id="pos-cart" className="w-[400px] bg-white/95 backdrop-blur-xl border-l border-white shadow-2xl shadow-indigo-100 z-20"><Cart items={cart} onUpdateQuantity={onUpdateCart} onRemoveFromCart={onRemoveFromCart} onUpdateDiscount={onUpdateDiscount} onCheckout={onCheckout} onClearCart={onClearCart} settings={settings} customers={customers} /></div>
    </div>
  );
};