'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getStoreProducts } from '@/services/storeService';
import { StoreProduct } from '@/types/storeProduct';
import StoreCard from '@/components/StoreCard';
import TopBar from '@/components/TopBar';
import MenuBar from '@/components/MenuBar';

export default function StoreScreen({ username }: { username: string }) {
  const [tab, setTab] = useState<'oficial' | 'p2p' | 'canje'>('oficial');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const data = await getStoreProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const bannerProduct = {
    title: 'Esfera de Maná',
    itemCode: 'codesferas',
    tipo: 'consumible',
    img: '/store/esfera.png',
    price: 1000,
    btn: 'Comprar',
    token: 'realm'
  };

  const oficial = products.filter(p => p.tipo === 'consumible' && p.activo);
  const canjes = products.filter(p => p.tipo === 'canje' && p.activo);

  return (
<>
<TopBar username={username} />
{/* contenido tienda aquí */}  
    <div className="min-h-screen pt-24 pb-20 px-4 bg-[#181d2a]">
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setTab('oficial')} className={tab === 'oficial' ? 'text-white font-bold' : 'text-[#39aaff]'}>Tienda Oficial</button>
        <button onClick={() => setTab('p2p')} className={tab === 'p2p' ? 'text-white font-bold' : 'text-[#39aaff]'}>P2P</button>
        <button onClick={() => setTab('canje')} className={tab === 'canje' ? 'text-white font-bold' : 'text-[#39aaff]'}>Canjes</button>
      </div>

      {tab === 'oficial' && (
        <>
          <div className="bg-gradient-to-r from-[#283b65] to-[#2cc0fa] rounded-xl shadow-lg mb-6 flex p-4 items-center gap-4">
            <Image src={bannerProduct.img} alt="banner" width={80} height={80} className="rounded-lg shadow-md" />
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg">{bannerProduct.title}</h2>
              <p className="text-sm text-[#aeefff]">Gacha exclusivo con recompensas raras</p>
              <p className="text-[#ffe94d] font-bold">{bannerProduct.price} Realm</p>
            </div>
            <button
              onClick={() => alert('Comprar Esfera')}
              className="bg-[#39aaff] text-[#191f33] font-bold px-4 py-2 rounded"
            >
              Comprar
            </button>
          </div>

          <h3 className="text-[#39aaff] font-bold mb-2">Consumibles</h3>
          <div className="grid grid-cols-2 gap-4">
            {oficial.map(p => (
              <StoreCard key={p.itemCode} product={p} onBuy={() => alert(`Comprar ${p.title}`)} />
            ))}
          </div>
        </>
      )}

      {tab === 'canje' && (
        <>
          <h3 className="text-[#ffe94d] font-bold mb-2">Canjes disponibles</h3>
          <div className="grid grid-cols-2 gap-4">
            {canjes.map(p => (
              <StoreCard key={p.itemCode} product={p} onBuy={() => alert(`Canjear ${p.title}`)} />
            ))}
          </div>
        </>
      )}

      {tab === 'p2p' && (
        <div className="text-white font-bold text-center mt-12">Marketplace P2P en construcción...</div>
      )}
    </div>
    <MenuBar selected="store" onSelect={(key) => router.push(key === 'home' ? '/' : `/${key}`)} />
    </>
  );
}
