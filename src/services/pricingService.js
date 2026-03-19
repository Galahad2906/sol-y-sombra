/**
 * Pricing service for Custom Framing Calculator.
 * Handles all business logic for calculating framing costs.
 */

export const GLASS_TYPES = {
  SENCILLO: { id: 'sencillo', name: 'Vidrio Sencillo', pricePerM2: 180000 },
  MATE: { id: 'mate', name: 'Vidrio Mate', pricePerM2: 200000 }
};

export const PAYMENT_METHODS = {
  TARJETA: { id: 'tarjeta', name: 'Tarjeta', multiplier: 1.15, label: 'Comisión Bancaria (5%) e IVA (10%)' },
  EFECTIVO: { id: 'efectivo', name: 'Efectivo / Transferencia', multiplier: 1.10, label: 'IVA (10%)' }
};

/**
 * Calculates the price breakdown for a custom frame.
 * 
 * @param {number} widthM Width in meters
 * @param {number} heightM Height in meters
 * @param {number} moldingPricePerMeter Price of the molding per linear meter (Gs)
 * @param {string} glassTypeId ID of the glass type (sencillo | mate)
 * @param {string} paymentMethodId ID of the payment method
 * @returns {object} Breakdown of costs and final price
 */
export const calculateFramePrice = (widthM, heightM, moldingPricePerMeter, glassTypeId, paymentMethodId = 'tarjeta') => {
  // 1. Dimensions are already in meters


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

  // 7. Final Price (Depends on payment method)
  const paymentMethod = Object.values(PAYMENT_METHODS).find(p => p.id === paymentMethodId) || PAYMENT_METHODS.TARJETA;
  const finalPrice = baseSalePrice * paymentMethod.multiplier;

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
      final: Math.ceil(finalPrice), // Round up to nearest integer
      feeLabel: paymentMethod.label
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
