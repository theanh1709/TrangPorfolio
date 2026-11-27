export const formatViNumber = (
  value: number,
  decimals = 0,
  prefix = "",
  suffix = "",
): string => {
  const formatted = value.toLocaleString("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${formatted}${suffix}`;
};
