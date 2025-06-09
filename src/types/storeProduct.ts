
export interface StoreProduct {
  _id?: string;
  itemCode: string;
  title: string;
  tipo: 'canje' | 'consumible' | 'item';
  itemRef?: string;
  descripcion?: string;
  value?: number;
  damage?: number;
  manaCost?: number;
  type?: 'atk' | 'def';
  efecto?: string;
  res?: boolean;
  cant?: number;
  price: number;
  token: 'realm' | 'wld';
  img: string;
  activo: boolean;
  createdAt: string;
  btn?: string;
}
