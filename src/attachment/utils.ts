export const formatCurrency = (value?: number) => {
  if (!value) {
    return 'R$ 0,00';
  }

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (value?: Date) => {
  const date = value || new Date();

  return date.toLocaleString('pt-BR', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};
