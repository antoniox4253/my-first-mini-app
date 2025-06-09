
'use client';

import React from 'react';
import Image from 'next/image';
import { StoreProduct } from '@/types/storeProduct';

interface Props {
  product: StoreProduct;
  onBuy: () => void;
}

export default function StoreCard({ product, onBuy }: Props) {
  return (
    <div className="bg-[#1e2235] rounded-lg p-3 w-full max-w-[160px] shadow-md flex flex-col items-center">
      <Image
        src={product.img}
        alt={product.title}
        width={64}
        height={64}
        className="rounded-md mb-2 object-contain"
      />
      <div className="text-white font-bold text-center text-sm mb-1">{product.title}</div>
      <div className="text-[#39aaff] font-semibold text-xs mb-2">
        {product.price} {product.token === 'wld' ? 'WLD' : 'Realm'}
      </div>
      <button
        onClick={onBuy}
        className="bg-gradient-to-r from-[#31bc47] to-[#52ffbc] text-[#191f33] font-bold px-3 py-1 text-xs rounded shadow-md w-full"
      >
        {product.btn}
      </button>
    </div>
  );
}
