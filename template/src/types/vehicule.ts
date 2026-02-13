// types vehicules

export type APICars = {
  status: boolean;
  error: null;
  data: Datum[];
};

export type Datum = {
  id: number;
  name: string;
  price: string;
  location: string;
  miles: number;
  fuelType: FuelType;
  transmission: Transmission;
  imageUrl: string;
  available: boolean;
  description: string;
  brand: string;
  label: string;
  imageGallery: ImageGallery[];
  vendedor: {
    id: number;
    name: string;
    email: string;
    phone: string;
    sucursal: string;
  };
};

export enum FuelType {
  Bencina = "Bencina",
  Diesel = "Diesel",
}

export type ImageGallery = {
  imageUrl: string;
};

export enum Transmission {
  Automático = "Automático",
  Manual = "Manual",
  Mecánico = "Mecánico",
}
