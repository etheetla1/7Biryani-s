export function dollarsFromCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function taxFromSubtotal(subtotalCents: number, taxBps: number) {
  // 6625 means 6.625% (NJ prepared food).
  return Math.round((subtotalCents * taxBps) / 100_000);
}

export function toE164Us(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  throw new Error("Enter a 10-digit US mobile number");
}
