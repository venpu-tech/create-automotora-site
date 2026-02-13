import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { VehicleCard } from "../product-card/ProductCard";

import type { Vehicle } from "../../types/vehicle";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FeaturedCarsProps {
  readonly vehicles: Vehicle[];
}

export const FeaturedCars: React.FC<FeaturedCarsProps> = ({ vehicles }) => {
  const isLoopEnabled = vehicles.length > 4;

  return (
    <section className="py-0 md:py-5 bg-white text-black">
      <div className="md:w-7xl mx-auto px-4 mb-0">
        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
          Destacados
        </h2>
        <p className="text-center text-gray-600">
          Tenemos una amplia variedad de vehículos usados y de todas las marcas
        </p>
      </div>

      <div className="md:w-7xl mx-auto px-4 py-5">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={4}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={isLoopEnabled}
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
          {vehicles.map((vehicle) => (
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
