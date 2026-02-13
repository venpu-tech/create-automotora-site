import type { Vehicle } from "../../types/vehicle";
import { formatPrice } from "../../helpers/formatHelpers";

interface VehicleCardProps {
  readonly vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const formattedPrice = formatPrice(vehicle.price);
  const imageUrl = vehicle.images[0]?.url ?? "/placeholder.webp";
  const isAvailable = vehicle.status === "available";

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <a href={`/vehiculos/${vehicle.code}`}>
          <img
            src={imageUrl}
            alt={vehicle.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </a>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ✓ Disponible
            </div>
          ) : (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ✕ Vendido
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-md leading-tight line-clamp-2 mb-1 h-10">
            <a
              href={`/vehiculos/${vehicle.code}`}
              className="hover:text-gray-700 transition-colors"
            >
              {vehicle.title}
            </a>
          </h3>
        </div>

        {/* Vehicle Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">🚗</span>
              <span>{vehicle.kms?.toLocaleString()} km</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">⛽</span>
              <span>{vehicle.fuel}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">⚙️</span>
              <span>{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Precio</p>
            <p className="text-[16px] font-bold text-gray-900">
              {formattedPrice}
            </p>
          </div>

          {/* CTA Button */}
          <a
            href={`/vehiculos/${vehicle.code}`}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-[11px] font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Ver más
          </a>
        </div>
      </div>
    </div>
  );
}
