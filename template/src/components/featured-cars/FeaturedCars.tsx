import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Importa los módulos necesarios
import { getFeaturedCars } from "../../lib/fetchSliders";
import { VehicleCard } from "../product-card/ProductCard";

import type { Datum } from "../../types/vehicule";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Define la interfaz para un vehículo
interface VehicleCardProps {
  readonly vehicle: Datum;
}

export const FeaturedCars: React.FC = () => {
  // Estado para almacenar los vehículos (arreglo de objetos de tipo Vehicle)
  const [vehicles, setVehicles] = useState<VehicleCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para obtener los vehículos destacados
  const fetchFeaturedCars = async () => {
    try {
      const autos: Datum[] = await getFeaturedCars();
      setVehicles(autos.map((auto) => ({ vehicle: auto })));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setLoading(false);
    }
  };

  // useEffect para cargar los vehículos al montar el componente
  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const isLoopEnabled = vehicles.length > 4; // Desactiva el bucle si hay menos de 4 vehículos

  return (
    <section className="py-0 md:py-5 bg-white text-black">
      {/* Título separado del contenedor de Swiper */}
      <div className="md:w-7xl mx-auto px-4 mb-0">
        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
          Destacados
        </h2>
        <p className="text-center text-gray-600">
          Tenemos una amplia variedad de vehículos usados y de todas las marcas
        </p>
      </div>

      {/* Contenedor separado para Swiper */}
      <div className="md:w-7xl mx-auto px-4 py-5">
        <Swiper
          modules={[Navigation, Autoplay]} // Registra los módulos
          spaceBetween={30} // Espacio entre diapositivas
          slidesPerView={4} // Cantidad de diapositivas visibles
          pagination={{ clickable: true }} // Activa paginación con clic
          autoplay={{
            delay: 3000, // Tiempo entre cada cambio de diapositiva (en ms)
            disableOnInteraction: false, // Continúa el autoplay incluso si el usuario interactúa
          }}
          loop={isLoopEnabled} // Desactiva el bucle si hay menos de 4 vehículos
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            639: {
              slidesPerView: 1,
            },
            865: {
              slidesPerView: 2,
            },
            1000: {
              slidesPerView: 3,
            },
            1500: {
              slidesPerView: 4,
            },
            1700: {
              slidesPerView: 4,
            },
          }}
        >
          {vehicles.map(({ vehicle }) => (
            <SwiperSlide key={vehicle.id}>
              <div className="py-8">
                <VehicleCard vehicle={vehicle} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
