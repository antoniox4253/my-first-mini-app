'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getStoreProducts, buyProduct } from '@/services/storeService'; // Importa la función buyProduct
import { StoreProduct } from '@/types/storeProduct'; // Tipo de datos para el producto
import StoreCard from '@/components/StoreCard';
import TopBar from '@/components/TopBar';
import MenuBar from '@/components/MenuBar';
import Modal from '@/components/modal'; // Modal para mensajes

interface StoreScreenProps {
  username: string;
  userId: string;
  wldBalance: number;  // Pasamos el saldo de WLD
  realmBalance: number;
}

// Tipado del producto del banner
type BannerProduct = {
  title: string;
  itemCode: string;
  tipo: string;
  img: string;
  price: number;
  btn: string;
  token: 'realm' | 'wld';  // Aquí especificamos que 'token' solo puede ser 'realm' o 'wld'
};

export default function StoreScreen({ username, userId, wldBalance, realmBalance }: StoreScreenProps) {
  const [tab, setTab] = useState<'oficial' | 'p2p' | 'canje'>('oficial');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [wldBalanceState, setWldBalance] = useState(wldBalance); // Estado para el saldo WLD
  const [realmBalanceState, setRealmBalance] = useState(realmBalance); // Estado para el saldo Realm

  useEffect(() => {
    async function fetchProducts() {
      const data = await getStoreProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  // Filtrar productos según tipo
  const oficial = products.filter(p => p.tipo === 'consumible' && p.activo);
  const canjes = products.filter(p => p.tipo === 'canje' && p.activo);

  // Banner especial para Esfera de Maná
  const bannerProduct: BannerProduct = {
    title: 'Esfera de Maná',
    itemCode: 'codesferas',
    tipo: 'consumible',
    img: '/store/esfera.png',
    price: 1000,
    btn: 'Comprar',
    token: 'realm', // Aquí definimos qué moneda se usa, puede ser 'wld' o 'realm'
  };

  // Función de compra
  const handleBuy = async (itemCode: string, price: number, token: 'wld' | 'realm') => {
    try {
      // Verificamos el saldo correspondiente según el tipo de moneda
      if (token === 'wld' && wldBalanceState < price) {
        setModalMessage('Saldo WLD insuficiente para realizar la compra.');
        setIsModalOpen(true);
        return;
      }

      if (token === 'realm' && realmBalanceState < price) {
        setModalMessage('Saldo Realm insuficiente para realizar la compra.');
        setIsModalOpen(true);
        return;
      }

      // Procedemos con la compra
      const success = await buyProduct(itemCode, price, token, userId); // Enviamos el token (wld o realm) a la función de compra
      if (success) {
        // Si la compra es exitosa, actualizamos el saldo correspondiente
        if (token === 'wld') {
          setWldBalance(prevBalance => prevBalance - price); // Descontamos WLD
        } else if (token === 'realm') {
          setRealmBalance(prevBalance => prevBalance - price); // Descontamos Realm
        }
        setModalMessage('Producto comprado exitosamente');
        setIsModalOpen(true);
      } else {
        setModalMessage('Error al comprar el producto');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error en la compra:', error);
      setModalMessage('Error al procesar la compra');
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <TopBar username={username} wldBalance={wldBalanceState} realmBalance={realmBalanceState} />

      <div className="min-h-screen pt-24 pb-24 px-4 bg-[#181d2a] overflow-y-auto" style={{ paddingBottom: '96px' }}>
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setTab('oficial')}
            className={tab === 'oficial' ? 'text-white font-bold' : 'text-[#39aaff]'}
          >
            Tienda Oficial
          </button>
          <button
            onClick={() => setTab('p2p')}
            className={tab === 'p2p' ? 'text-white font-bold' : 'text-[#39aaff]'}
          >
            P2P
          </button>
          <button
            onClick={() => setTab('canje')}
            className={tab === 'canje' ? 'text-white font-bold' : 'text-[#39aaff]'}
          >
            Canjes
          </button>
        </div>

        {/* TAB: Oficial */}
        {tab === 'oficial' && (
          <>
            {/* Banner */}
            <div className="bg-gradient-to-r from-[#283b65] to-[#2cc0fa] rounded-xl shadow-lg mb-6 flex p-4 items-center gap-4">
              <Image
                src={bannerProduct.img}
                alt="banner"
                width={80}
                height={80}
                className="rounded-lg shadow-md"
              />
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg">{bannerProduct.title}</h2>
                <p className="text-sm text-[#aeefff]">Gacha exclusivo con recompensas raras</p>
                <p className="text-[#ffe94d] font-bold">{bannerProduct.price} Realm</p>
              </div>
              <button
                onClick={() => handleBuy(bannerProduct.itemCode, bannerProduct.price, bannerProduct.token)} // Usamos la función handleBuy
                className="bg-[#39aaff] text-[#191f33] font-bold px-4 py-2 rounded"
              >
                Comprar
              </button>
            </div>

            {/* Productos Oficiales */}
            <h3 className="text-[#39aaff] font-bold mb-2">Consumibles</h3>
            <div className="grid grid-cols-2 gap-4">
              {oficial.map(p => (
                <StoreCard key={p.itemCode} product={p} onBuy={() => handleBuy(p.itemCode, p.price, p.token)} />
              ))}
            </div>
          </>
        )}

        {/* TAB: Canjes */}
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

        {/* TAB: P2P */}
        {tab === 'p2p' && (
          <div className="text-white font-bold text-center mt-12">
            Marketplace P2P en construcción...
          </div>
        )}
      </div>

      <MenuBar selected="store" />

      {/* Modal de mensaje emergente */}
      <Modal
        message={modalMessage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
