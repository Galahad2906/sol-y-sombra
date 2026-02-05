
/**
 * Service to fetch currency exchange rates.
 * Uses the volpe.com.py aggregator as a proxy for accurate local rates in Encarnación.
 */

const BASE_API_URL = 'https://cotizacion.volpe.com.py/api/exchange';

/**
 * Fetches exchange rates for a specific currency.
 * @param {string} currencyCode 'USD', 'BRL', 'ARS'
 */
const fetchRateForCurrency = async (currencyCode) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(`${BASE_API_URL}/${currencyCode}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) return null;

        const data = await response.json();

        // Filter for a reliable Asunción source.
        // Priority: specific keywords indicating Asunción branches or Head Offices (Matriz/Central).
        const asuncionRates = data.data.find(item => {
            const name = item.branch?.name?.toLowerCase() || '';
            return name.includes('asuncion') ||
                name.includes('asunción') ||
                name.includes('villa morra') ||
                name.includes('matriz') ||
                name.includes('central');
        });

        // Fallback: Use the first available if no specific Asunción data
        const result = asuncionRates || data.data[0];

        if (!result) return null;

        return {
            purchasePrice: result.purchasePrice,
            salePrice: result.salePrice,
            lastUpdate: result.queryDate,
            source: result.place?.name || 'General',
            branch: result.branch?.name || 'Central'
        };

    } catch (error) {
        console.error(`Error fetching ${currencyCode}:`, error);
        return null;
    }
};

export const fetchAllExchangeRates = async () => {
    try {
        const [usd, brl, ars] = await Promise.all([
            fetchRateForCurrency('USD'),
            fetchRateForCurrency('BRL'),
            fetchRateForCurrency('ARS')
        ]);

        return {
            USD: usd,
            BRL: brl,
            ARS: ars
        };
    } catch (error) {
        console.error('Error fetching all rates:', error);
        throw error;
    }
};
