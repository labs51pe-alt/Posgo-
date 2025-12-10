import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, ProductVariant, CartItem } from '../types';
import { CATEGORIES } from '../constants';
import { Cart } from './Cart';
import { Lock, Wallet, LayoutGrid, List, ScanBarcode, Search, Layers, ShoppingBasket, Plus, AlertCircle, X, Tag, Check, Package } from 'lucide-react';

export const POSView = ({ products, cart, onAddToCart, onUpdateCart, onRemoveFromCart, onUpdateDiscount, onCheckout, onClearCart, settings, customers, activeShift, onOpenCashControl }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [posBarcodeBuffer, setPosBarcodeBuffer] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  
  // Variant Selection State
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);

  const barcodeRef = useRef<HTMLInputElement>(null);

  // Smart Focus: Refocus scanner if user clicks empty space
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('input') || 
                              target.closest('button') || 
                              target.closest('select') || 
                              target.closest('textarea') ||
                              target.closest('#pos-cart');
        
        if (!isInteractive && activeShift && barcodeRef.current) {
            barcodeRef.current.focus();
        }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeShift]);

  // Initial focus
  useEffect(() => { if (activeShift && barcodeRef.current) barcodeRef.current.focus(); }, [activeShift]);

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

  // Helper to check if item is in cart
  const getCartQuantity = (productId: string) => {
      return cart.filter((c: CartItem) => c.id === productId).reduce((sum: number, c: CartItem) => sum + c.quantity, 0);
  };

  if (!activeShift) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden bg-[#f8fafc]">
            <div className="bg-white/60 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-white max-w-md w-full relative z-10 transform transition-all">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-50 to-violet-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
                    <Lock className="w-10 h-10 text-indigo-300" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Turno Finalizado</h2>
                <p className="text-slate-400 font-medium text-sm mb-10 leading-relaxed">
                    La caja se encuentra cerrada. Inicia un nuevo turno para acceder al sistema de ventas.
                </p>
                <button 
                    onClick={() => onOpenCashControl('OPEN')} 
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    <Wallet className="w-6 h-6"/>
                    <span>Aperturar Caja</span>
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="h-full flex overflow-hidden bg-[#f8fafc]">
        <div className="flex-1 flex flex-col p-6 overflow-hidden relative">
            {/* Header Status */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                    <div>
                        <h2 className="text-xs font-black text-emerald-600 tracking-wide uppercase">Caja Abierta</h2>
                        <p className="text-[10px] text-slate-400 font-bold">Turno #{activeShift.id.slice(-4)}</p>
                    </div>
                </div>
                
                {/* ID added for Tour */}
                <button 
                    id="pos-cash-control"
                    onClick={() => onOpenCashControl('IN')} 
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                >
                    <Wallet className="w-4 h-4 text-slate-400"/> Movimientos
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4 mb-4">
                {/* ID added for Tour */}
                <div id="pos-view-toggles" className="flex gap-1 bg-white p-1.5 rounded-[1.2rem] border border-slate-100 h-[64px] items-center shrink-0 shadow-sm">
                    <button onClick={() => setViewMode('GRID')} className={`h-full aspect-square flex items-center justify-center rounded-2xl transition-all ${viewMode === 'GRID' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-5 h-5"/></button>
                    <button onClick={() => setViewMode('LIST')} className={`h-full aspect-square flex items-center justify-center rounded-2xl transition-all ${viewMode === 'LIST' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-5 h-5"/></button>
                </div>
                {/* ID added for Tour */}
                <div id="pos-scanner-section" className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <ScanBarcode className="w-6 h-6 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input 
                        ref={barcodeRef} 
                        type="text" 
                        placeholder="Escanear código de barras..." 
                        className="w-full h-[64px] pl-16 pr-4 bg-white border border-slate-100 rounded-[1.2rem] focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-lg text-slate-700 transition-all placeholder-slate-300 shadow-sm" 
                        value={posBarcodeBuffer} 
                        onChange={(e) => setPosBarcodeBuffer(e.target.value)} 
                        onKeyDown={handlePosScanner} 
                        autoFocus
                    />
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 mb-6 items-center overflow-x-auto pb-2 custom-scrollbar" id="pos-search-bar">
                <div className="w-64 relative shrink-0">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"/>
                    <input 
                        type="text" 
                        placeholder="Buscar producto..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-slate-100 outline-none transition-all font-bold text-sm text-slate-700 placeholder:text-slate-300" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2" id="pos-categories">
                    <button onClick={() => setSelectedCategory('Todos')} className={`px-6 py-3.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === 'Todos' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}>Todos</button>
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-3.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}>{cat}</button>
                    ))}
                </div>
            </div>

            {/* Products Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1" id="pos-products-grid">
                {viewMode === 'GRID' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                        {filteredProducts.map((p: Product, idx: number) => {
                            const isOutOfStock = p.stock <= 0 && !p.hasVariants;
                            const isLowStock = p.stock <= 5 && !isOutOfStock;
                            const inCartQty = getCartQuantity(p.id);
                            
                            return (
                                <div 
                                    key={p.id} 
                                    onClick={() => handleProductClick(p)} 
                                    className={`
                                        bg-white p-5 rounded-[2rem] border transition-all duration-200 relative flex flex-col justify-between h-[220px] animate-fade-in-up
                                        ${isOutOfStock 
                                            ? 'opacity-60 grayscale cursor-not-allowed border-slate-100 bg-slate-50' 
                                            : `cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/50 active:scale-95 
                                               ${inCartQty > 0 ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100 shadow-sm'}`}
                                    `}
                                    style={{animationDelay: `${idx * 40}ms`}}
                                >
                                    {/* In Cart Indicator */}
                                    {inCartQty > 0 && !isOutOfStock && (
                                        <div className="absolute top-4 left-4 z-10 bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shadow-lg shadow-indigo-200 animate-bounce">
                                            {inCartQty}
                                        </div>
                                    )}

                                    {/* Stock Badge - Soft Pill Style */}
                                    <div className="flex justify-end absolute top-4 right-4 z-10">
                                        {isOutOfStock ? (
                                            <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                                <X className="w-3 h-3"/> AGOTADO
                                            </div>
                                        ) : (
                                            <div className={`
                                                px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 border
                                                ${isLowStock 
                                                    ? 'bg-rose-50 border-rose-100 text-rose-500 animate-pulse' 
                                                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'}
                                            `}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                                {p.stock} un.
                                            </div>
                                        )}
                                    </div>

                                    {/* Icon / Image */}
                                    <div className="flex-1 flex items-center justify-center relative mt-6 mb-2">
                                        <div className={`text-slate-200 font-black text-6xl select-none transition-transform duration-300 ${!isOutOfStock && 'group-hover:scale-110 group-hover:text-indigo-200'}`}>
                                            {p.name.charAt(0)}
                                        </div>
                                        {p.hasVariants && <Layers className="absolute bottom-0 right-0 w-6 h-6 text-indigo-400 bg-indigo-50 rounded-lg p-1"/>}
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{p.category}</p>
                                        <h3 className="font-bold text-slate-800 leading-tight mb-3 truncate text-sm" title={p.name}>{p.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-black text-slate-800 tracking-tight">{settings.currency}{p.price.toFixed(2)}</span>
                                            {!isOutOfStock && (
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${inCartQty > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                                    {inCartQty > 0 ? <Check className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
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
                            <thead className="bg-slate-50/50 text-xs font-bold uppercase text-slate-400 border-b border-slate-100">
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
                                    const isLowStock = p.stock <= 5 && !isOutOfStock;
                                    const inCartQty = getCartQuantity(p.id);

                                    return (
                                        <tr 
                                            key={p.id} 
                                            className={`transition-colors ${isOutOfStock ? 'opacity-50 grayscale bg-slate-50' : 'hover:bg-indigo-50/30 cursor-pointer active:bg-indigo-50'}`} 
                                            onClick={() => !isOutOfStock && handleProductClick(p)}
                                        >
                                            <td className="p-5 pl-8">
                                                <div className="flex items-center gap-3">
                                                    {inCartQty > 0 && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                                    <div>
                                                        <div className={`font-bold ${inCartQty > 0 ? 'text-indigo-700' : 'text-slate-800'}`}>{p.name}</div>
                                                        <div className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                                                            {p.hasVariants && <Layers className="w-3 h-3 text-indigo-400"/>}
                                                            {p.category} • {p.barcode}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                {isOutOfStock ? (
                                                     <span className="text-[10px] px-3 py-1 rounded-lg font-black bg-slate-100 text-slate-400 border border-slate-200">AGOTADO</span>
                                                ) : (
                                                    <span className={`text-[10px] px-3 py-1 rounded-lg font-black border ${isLowStock ? 'bg-rose-50 border-rose-100 text-rose-500 animate-pulse' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                                        {p.stock} UN
                                                    </span>
                                                )}
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
            </div>
            
            {/* VARIANT SELECTOR MODAL */}
            {isVariantModalOpen && selectedProductForVariant && (
                <div className="absolute inset-0 z-50 bg-slate-900/20 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 w-full max-w-md overflow-hidden animate-fade-in-up border border-white">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="font-black text-xl text-slate-800">Seleccionar Variante</h3>
                                <p className="text-sm font-medium text-indigo-500 mt-1">{selectedProductForVariant.name}</p>
                            </div>
                            <button onClick={() => setIsVariantModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-colors"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#f8fafc]">
                            {selectedProductForVariant.variants?.map((variant) => {
                                const inCartQty = cart.find((c: any) => c.id === selectedProductForVariant.id && c.selectedVariantId === variant.id)?.quantity || 0;
                                
                                return (
                                    <button
                                        key={variant.id}
                                        onClick={() => handleVariantSelect(variant)}
                                        disabled={variant.stock <= 0}
                                        className={`
                                            p-5 rounded-[1.5rem] border text-left transition-all relative
                                            ${variant.stock <= 0 
                                                ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' 
                                                : `bg-white hover:shadow-lg hover:-translate-y-0.5 active:scale-95 duration-200
                                                   ${inCartQty > 0 ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md shadow-indigo-100' : 'border-slate-100 shadow-sm hover:border-indigo-200'}`
                                            }
                                        `}
                                    >
                                        {inCartQty > 0 && (
                                            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                                En carrito: {inCartQty}
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-800 text-lg">{variant.name}</span>
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${variant.stock <= 0 ? 'bg-slate-200 text-slate-500' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                {variant.stock > 0 ? `${variant.stock} UN` : 'AGOTADO'}
                                            </span>
                                        </div>
                                        <p className="font-medium text-indigo-600 mt-1">{settings.currency}{variant.price.toFixed(2)}</p>
                                    </button>
                                );
                            })}
                             {(!selectedProductForVariant.variants || selectedProductForVariant.variants.length === 0) && (
                                <div className="text-center py-10 text-slate-400">
                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                                    <p className="font-medium">No hay variantes configuradas.</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            )}
        </div>
        {/* ID added for Tour */}
        <div id="pos-cart" className="w-[400px] bg-white shadow-2xl shadow-indigo-900/10 z-20"><Cart items={cart} onUpdateQuantity={onUpdateCart} onRemoveItem={onRemoveFromCart} onUpdateDiscount={onUpdateDiscount} onCheckout={onCheckout} onClearCart={onClearCart} settings={settings} customers={customers} /></div>
    </div>
  );
};