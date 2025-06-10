export interface InventoryItem {
    _id: string;
    userId: string;
    tipo: 'consumible' | 'canje' | 'item' | 'personaje';
    itemCode: string;
    cantidad?: number;
    usado?: boolean;
    equipado?: boolean;
    img?: string;
    title?: string;
    descripcion?: string;
    createdAt: string;
  }
  