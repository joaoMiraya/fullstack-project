
export const formatCurrency = (inputValue: string): string => {
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    const integerPart = numericValue.slice(0, -2) || "0";
    const decimalPart = numericValue.slice(-2).padStart(2, "0");

    const formattedIntegerPart = parseInt(integerPart, 10).toLocaleString("pt-BR");

    return `${formattedIntegerPart},${decimalPart}`;
  };

  export const parseCurrencyToCents = (currency: string | undefined): number | boolean => {
    if(currency == undefined){
        return false;
    }
    const numericString = currency.replace(/[^0-9,.-]/g, '');
    const normalizedString = numericString.replace(',', '.');

    const valueInCents = Math.round(parseFloat(normalizedString) * 100);

    return valueInCents;
};

export const formatToBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
  }).format(value);
}