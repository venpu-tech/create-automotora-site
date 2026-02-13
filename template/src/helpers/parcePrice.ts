export const parsePrice = (priceString: string): number => {
  if (!priceString) return 0;
  // Remover las comas y convertir a número
  return parseInt(priceString.replace(/,/g, ""));
};
