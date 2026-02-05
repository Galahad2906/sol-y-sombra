/**
 * Pricing service for Custom Framing Calculator.
 * Handles all business logic for calculating framing costs.
 */

export const GLASS_TYPES = {
  SENCILLO: { id: 'sencillo', name: 'Vidrio Sencillo', pricePerM2: 180000 },
  MATE: { id: 'mate', name: 'Vidrio Mate', pricePerM2: 200000 }
};

/**
 * Calculates the price breakdown for a custom frame.
 * 
 * @param {number} widthCm Width in centimeters
 * @param {number} heightCm Height in centimeters
 * @param {number} moldingPricePerMeter Price of the molding per linear meter (Gs)
 * @param {string} glassTypeId ID of the glass type (sencillo | mate)
 * @returns {object} Breakdown of costs and final price
 */
export const calculateFramePrice = (widthCm, heightCm, moldingPricePerMeter, glassTypeId) => {
  // 1. Convert dimensions to meters
  const widthM = widthCm / 100;
  const heightM = heightCm / 100;

  // 2. Calculate Perimeter (Linear Meters)
  const perimeter = (widthM + heightM) * 2;

  // 3. Molding Cost
  const moldingCost = perimeter * moldingPricePerMeter;

  // 4. Glass Area & Cost
  const glassArea = widthM * heightM;
  const selectedGlass = Object.values(GLASS_TYPES).find(g => g.id === glassTypeId) || GLASS_TYPES.SENCILLO;
  const glassCost = glassArea * selectedGlass.pricePerM2;

  // 5. Subtotals
  const materialSubtotal = moldingCost + glassCost;
  
  // 6. Base Sale Price (x2 Markup)
  const baseSalePrice = materialSubtotal * 2;

  // 7. Final Price (10% VAT + 5% Commission = 1.15)
  const finalPrice = baseSalePrice * 1.15;

  return {
    dimensions: {
      widthM,
      heightM,
      perimeter,
      area: glassArea
    },
    costs: {
      molding: moldingCost,
      glass: glassCost,
      materialSubtotal
    },
    prices: {
      base: baseSalePrice,
      final: Math.ceil(finalPrice) // Round up to nearest integer
    }
  };
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
