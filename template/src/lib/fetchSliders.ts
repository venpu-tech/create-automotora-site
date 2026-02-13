// src/utils/fetchVehicles.ts
import { type Datum, type APICars } from "../types/vehicule";

interface APIVehicles {
  data: Datum[];
  pagination: any;
}

export const getCarsByIds = async ({ id }: { id: string }) => {
  const token = import.meta.env.PUBLIC_TOKEN;

  const res = await fetch(`https://venpu.cl/api/cars/stock/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const vehiculo = (await res.json()) as {
    status: boolean;
    error: any;
    data: Datum;
  };
  /*   const vehiculo = (await res.json()) as Datum; */

  return vehiculo;
};

// Función existente para obtener autos destacados (no modificada)
export const getFeaturedCars = async () => {
  const token = import.meta.env.PUBLIC_TOKEN;

  const res = await fetch("https://venpu.cl/api/cars/destacados", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  const { data: autos } = (await res.json()) as APICars;
  return autos;
};

// Función para obtener todos los IDs de los autos del stock completo
export const getAllCarIds = async (): Promise<number[]> => {
  const token = import.meta.env.PUBLIC_TOKEN;

  const res = await fetch("https://venpu.cl/api/cars/stock", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  const { data: cars } = (await res.json()) as APICars;
  return cars.map((car) => car.id); // Ajusta 'id' según la estructura de tu objeto car
};

export const fetchAllVehicles = async (): Promise<Datum[]> => {
  const url = "https://venpu.cl/api/cars/stock";
  const token = import.meta.env.PUBLIC_TOKEN;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("Fetch error:", res.status, res.statusText);
    throw new Error("Network response was not ok");
  }

  const { data } = (await res.json()) as APIVehicles;

  return data; // Devuelve directamente los vehículos como Datum[]
};
