/**
 * Formatea un precio como moneda local.
 * @param price - El precio como string o número.
 * @param locale - El idioma o región para el formato (por defecto "es-CL").
 * @param currency - La moneda a usar (por defecto "CLP").
 * @returns El precio formateado como string.
 */
export function formatPrice(
  price: string | number,
  locale: string = "es-CL",
  currency: string = "CLP"
): string {
  const numericPrice =
    typeof price === "string" ? Number(price.replace(/[^\d]/g, "")) : price;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(numericPrice);
}
