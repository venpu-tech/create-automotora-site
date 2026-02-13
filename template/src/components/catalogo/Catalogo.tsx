import { useState, useEffect, useMemo } from "react";
import { VehicleCard } from "../product-card/ProductCard";
import { fetchAllVehicles } from "../../lib/fetchSliders";
import { formatPrice } from "../../helpers/formatHelpers";
import { parsePrice } from "../../helpers/parcePrice";
import type { Datum } from "../../types/vehicule";

interface FilterState {
  brand: string;
  priceRange: {
    min: number;
    max: number;
  };
  fuelType: string;
  transmission: string;
  milesRange: {
    min: number;
    max: number;
  };
  available: boolean | null;
}

const ITEMS_PER_PAGE = 12;

export function Catalogo() {
  const [vehicles, setVehicles] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    brand: "",
    priceRange: { min: 0, max: 100000000 },
    fuelType: "",
    transmission: "",
    milesRange: { min: 0, max: 500000 },
    available: null,
  });

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await fetchAllVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Error loading vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  // Obtener valores únicos para los filtros
  const uniqueBrands = useMemo(() => {
    return [...new Set(vehicles.map((v) => v.brand))].sort();
  }, [vehicles]);

  const priceRange = useMemo(() => {
    if (vehicles.length === 0) {
      return { min: 0, max: 100000000 };
    }
    const prices = vehicles
      .map((v) => parsePrice(v.price))
      .filter((price) => !isNaN(price) && price > 0);

    if (prices.length === 0) {
      return { min: 0, max: 100000000 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [vehicles]);

  const milesRange = useMemo(() => {
    if (vehicles.length === 0) {
      return { min: 0, max: 500000 };
    }
    const miles = vehicles.map((v) => v.miles).filter((mile) => !isNaN(mile));
    return {
      min: Math.min(...miles),
      max: Math.max(...miles),
    };
  }, [vehicles]);

  // Actualizar filtros cuando cambien los rangos de precio y kilometraje
  useEffect(() => {
    if (vehicles.length > 0) {
      setFilters((prev) => {
        const newFilters = {
          ...prev,
          priceRange: {
            min:
              prev.priceRange.min === 0 || prev.priceRange.min === 100000000
                ? priceRange.min
                : prev.priceRange.min,
            max:
              prev.priceRange.max === 100000000 || prev.priceRange.max === 0
                ? priceRange.max
                : prev.priceRange.max,
          },
          milesRange: {
            min:
              prev.milesRange.min === 0 || prev.milesRange.min === 500000
                ? milesRange.min
                : prev.milesRange.min,
            max:
              prev.milesRange.max === 500000 || prev.milesRange.max === 0
                ? milesRange.max
                : prev.milesRange.max,
          },
        };
        return newFilters;
      });
    }
  }, [
    vehicles.length,
    priceRange.min,
    priceRange.max,
    milesRange.min,
    milesRange.max,
  ]);

  // Filtrar vehículos
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const price = parsePrice(vehicle.price);

      // Validar que el precio sea un número válido
      if (isNaN(price) || price <= 0) return false;

      return (
        (filters.brand === "" || vehicle.brand === filters.brand) &&
        price >= filters.priceRange.min &&
        price <= filters.priceRange.max &&
        (filters.fuelType === "" || vehicle.fuelType === filters.fuelType) &&
        (filters.transmission === "" ||
          vehicle.transmission === filters.transmission) &&
        vehicle.miles >= filters.milesRange.min &&
        vehicle.miles <= filters.milesRange.max &&
        (filters.available === null || vehicle.available === filters.available)
      );
    });
  }, [vehicles, filters]);

  // Paginación
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVehicles = filteredVehicles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleFilterChange = (filterKey: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      priceRange: { min: priceRange.min, max: priceRange.max },
      fuelType: "",
      transmission: "",
      milesRange: { min: milesRange.min, max: milesRange.max },
      available: null,
    });
    setCurrentPage(1);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-CL").format(num);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-400"></div>
      </div>
    );
  }

  return (
    <div className="md:w-7xl mx-auto px-4 py-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-4">
          Catálogo de Vehículos
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-400">
            {filteredVehicles.length} vehículos encontrados
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtros - Sidebar */}
        <div
          className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}
        >
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Filtros</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Limpiar todo
              </button>
            </div>

            {/* Disponibilidad */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Disponibilidad
              </h3>
              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.available === null}
                    onChange={() => handleFilterChange("available", null)}
                    className="mr-2"
                  />
                  Todos
                </label>
                <label className="flex items-center text-gray-300">
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.available === true}
                    onChange={() => handleFilterChange("available", true)}
                    className="mr-2"
                  />
                  Disponibles
                </label>
                <label className="flex items-center text-gray-300">
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.available === false}
                    onChange={() => handleFilterChange("available", false)}
                    className="mr-2"
                  />
                  Vendidos
                </label>
              </div>
            </div>

            {/* Marca */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Marca</h3>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">Todas las marcas</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de precio */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Precio</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Mínimo: {formatPrice(filters.priceRange.min)}
                  </label>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step="1000000"
                    value={filters.priceRange.min}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      handleFilterChange("priceRange", {
                        ...filters.priceRange,
                        min: newMin,
                      });
                    }}
                    className="w-full accent-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Máximo: {formatPrice(filters.priceRange.max)}
                  </label>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step="1000000"
                    value={filters.priceRange.max}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      handleFilterChange("priceRange", {
                        ...filters.priceRange,
                        max: newMax,
                      });
                    }}
                    className="w-full accent-red-400"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Rango disponible: {formatPrice(priceRange.min)} -{" "}
                  {formatPrice(priceRange.max)}
                </div>
              </div>
            </div>

            {/* Tipo de combustible */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Combustible
              </h3>
              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange("fuelType", e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">Todos</option>
                <option value="Bencina">Bencina</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            {/* Transmisión */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Transmisión
              </h3>
              <select
                value={filters.transmission}
                onChange={(e) =>
                  handleFilterChange("transmission", e.target.value)
                }
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">Todas</option>
                <option value="Automático">Automático</option>
                <option value="Manual">Manual</option>
                <option value="Mecánico">Mecánico</option>
              </select>
            </div>

            {/* Kilometraje */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Kilometraje
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Mínimo: {formatNumber(filters.milesRange.min)} km
                  </label>
                  <input
                    type="range"
                    min={milesRange.min}
                    max={milesRange.max}
                    step="10000"
                    value={filters.milesRange.min}
                    onChange={(e) =>
                      handleFilterChange("milesRange", {
                        ...filters.milesRange,
                        min: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Máximo: {formatNumber(filters.milesRange.max)} km
                  </label>
                  <input
                    type="range"
                    min={milesRange.min}
                    max={milesRange.max}
                    step="10000"
                    value={filters.milesRange.max}
                    onChange={(e) =>
                      handleFilterChange("milesRange", {
                        ...filters.milesRange,
                        max: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-red-400"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Rango disponible: {formatNumber(milesRange.min)} -{" "}
                  {formatNumber(milesRange.max)} km
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="lg:w-3/4">
          {paginatedVehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No se encontraron vehículos con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  >
                    Anterior
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-2 rounded-lg ${
                            currentPage === pageNumber
                              ? "bg-red-400 text-black font-bold"
                              : "bg-gray-800 text-white hover:bg-gray-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
