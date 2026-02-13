export interface Vehicle {
  id: number;
  code: string;
  title: string;
  description?: string;
  price: number;
  year: number;
  kms: number;
  fuel: string;
  transmission?: string;
  color?: string;
  version?: string;
  doors?: number;
  brand: { id: number; name: string };
  model: { id: number; name: string };
  region?: { id: number; name: string };
  comuna?: { id: number; name: string };
  seller?: { id: number; name: string; phone?: string };
  company?: {
    id: number;
    name: string;
    whatsappNumber?: string;
    planFeatures?: { aiAgents?: boolean };
  };
  images: { id: number; url: string; order: number }[];
  status: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface VehicleListResponse {
  type: "success";
  data: {
    data: Vehicle[];
    pagination: Pagination;
  };
}

export interface VehicleDetailResponse {
  type: "success";
  data: Vehicle;
}
