export async function verifyMobileOtp(mobileNumber) {
  return {
    token: `mobile-${mobileNumber}-${Date.now()}`,
  }
}

export function extractVerificationToken(data) {
  if (!data) return "verified"
  if (typeof data === "string") return data
  return data.token || data.authToken || data.otpToken || data.request_id || JSON.stringify(data)
}

export function normalizeMobileNumber(value) {
  const digits = value.replace(/\D/g, "")
  if (digits.length < 10 || digits.length > 15) {
    throw new Error("Enter a valid mobile number")
  }
  return digits
}
