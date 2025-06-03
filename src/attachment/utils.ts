export const formatCurrency = (value?: number) => {
  const amount = value ?? 0;

  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `USD ${formatted}`;
};

export const formatDate = (value?: Date) => {
  const date = value || new Date();

  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};
