export function formatUsdc(balance: bigint): {
  whole: string;
  decimal: string;
} {
  // Convert to string and pad with leading zeros to ensure at least 6 digits
  const balanceStr = balance.toString().padStart(7, "0");

  // Split into whole and decimal parts
  // For amounts less than 1 USDC, whole part will be empty string
  const whole = balanceStr.slice(0, -6) || "0";

  // Get first 2 digits of decimal part and pad with trailing zeros if needed
  const decimal = balanceStr.slice(-6, -4).padEnd(2, "0");

  return {
    whole,
    decimal,
  };
}
