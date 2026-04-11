export function normalizeMobileNumber(value) {
  const digits = String(value || "").replace(/\D/g, "")
  if (digits.length < 10 || digits.length > 15) {
    throw new Error("Enter a valid mobile number")
  }
  return digits
}