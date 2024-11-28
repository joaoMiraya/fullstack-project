
export const convertTime = (timeString: string): string => {
    const seconds = parseInt(timeString.replace('s', ''));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}:${minutes}:${remainingSeconds}`;
}

export const formatDate = (timestamp: string | undefined, hoursToo: boolean = false): string => {
    if (!timestamp) return "";
  
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
  
    const formattedDate = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  
    if (hoursToo) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${formattedDate} ${hours}:${minutes}:${seconds}`;
    }
  
    return formattedDate;
  };
  
export const formatMoney = (value: number): string => {
    const roundedValue = Math.round(value * 100) / 100;
    return roundedValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

export const convertMetersInKm = (meters: number) => {
    return meters / 1000;
};