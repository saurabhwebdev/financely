// Common countries and their currencies
export const countries = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'EU', name: 'European Union', currency: 'EUR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'RU', name: 'Russia', currency: 'RUB' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
];

// Currency information
export const currencies = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  BRL: { symbol: 'R$', code: 'BRL', name: 'Brazilian Real' },
  ZAR: { symbol: 'R', code: 'ZAR', name: 'South African Rand' },
  CNY: { symbol: '¥', code: 'CNY', name: 'Chinese Yuan' },
  RUB: { symbol: '₽', code: 'RUB', name: 'Russian Ruble' },
  MXN: { symbol: '$', code: 'MXN', name: 'Mexican Peso' },
  SGD: { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar' },
  CHF: { symbol: 'Fr', code: 'CHF', name: 'Swiss Franc' },
};

// Get currency symbol for a country code
export function getCurrencyForCountry(countryCode: string): string {
  const country = countries.find(c => c.code === countryCode);
  return country ? country.currency : 'USD';
}

// Get currency symbol for a currency code
export function getCurrencySymbol(currencyCode: string): string {
  return currencies[currencyCode as keyof typeof currencies]?.symbol || '$';
}

// Format amount with currency symbol
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies[currencyCode as keyof typeof currencies];
  if (!currency) return `$${amount.toFixed(2)}`;
  
  return `${currency.symbol}${amount.toFixed(2)}`;
} 