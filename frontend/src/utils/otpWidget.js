const SCRIPT_URLS = [
  "https://verify.msg91.com/otp-provider.js",
  "https://verify.phone91.com/otp-provider.js",
]

let loadPromise

function loadOtpScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("OTP can only run in the browser"))
  }

  if (typeof window.initSendOTP === "function") {
    return Promise.resolve(window.initSendOTP)
  }

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    let index = 0

    function attempt() {
      if (index >= SCRIPT_URLS.length) {
        reject(new Error("Unable to load OTP provider"))
        return
      }

      const script = document.createElement("script")
      script.src = SCRIPT_URLS[index]
      script.async = true
      script.onload = () => {
        if (typeof window.initSendOTP === "function") {
          resolve(window.initSendOTP)
        } else {
          index += 1
          attempt()
        }
      }
      script.onerror = () => {
        index += 1
        attempt()
      }
      document.head.appendChild(script)
    }

    attempt()
  })

  return loadPromise
}

export async function verifyMobileOtp(mobileNumber) {
  const widgetId = import.meta.env.VITE_MSG91_WIDGET_ID
  const tokenAuth = import.meta.env.VITE_MSG91_TOKEN_AUTH

  if (!widgetId || !tokenAuth) {
    throw new Error("OTP widget is not configured")
  }

  const initSendOTP = await loadOtpScript()

  return new Promise((resolve, reject) => {
    initSendOTP({
      widgetId,
      tokenAuth,
      identifier: mobileNumber,
      exposeMethods: false,
      success: (data) => resolve(data),
      failure: (error) => reject(error),
    })
  })
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