'use client'

const normalizeValue = (value: string | null | undefined) =>
  String(value ?? '')
    .trim()
    .toLowerCase()

const getNavigatorPlatform = () =>
  typeof navigator === 'undefined' ? '' : navigator.platform || ''

const getNavigatorUserAgent = () =>
  typeof navigator === 'undefined' ? '' : navigator.userAgent || ''

const detectBrowser = () => {
  const userAgent = getNavigatorUserAgent()

  if (/Edg\//i.test(userAgent)) return 'Edge'
  if (/OPR\//i.test(userAgent) || /Opera/i.test(userAgent)) return 'Opera'
  if (/Firefox\//i.test(userAgent)) return 'Firefox'
  if (/CriOS\//i.test(userAgent)) return 'Chrome iOS'
  if (/Chrome\//i.test(userAgent) || /Chromium\//i.test(userAgent)) return 'Chrome'
  if (/FxiOS\//i.test(userAgent)) return 'Firefox iOS'
  if (/Safari\//i.test(userAgent)) return 'Safari'

  return 'Navegador'
}

const detectOperatingSystem = () => {
  const platform = getNavigatorPlatform()
  const userAgent = getNavigatorUserAgent()

  if (/iPhone/i.test(userAgent)) return 'iPhone'
  if (/iPad/i.test(userAgent)) return 'iPad'
  if (/Android/i.test(userAgent)) return 'Android'
  if (/Windows/i.test(platform) || /Windows/i.test(userAgent)) return 'Windows'
  if (/Mac/i.test(platform) || /Mac OS X/i.test(userAgent)) return 'macOS'
  if (/Linux/i.test(platform) || /Linux/i.test(userAgent)) return 'Linux'

  return platform || 'Dispositivo'
}

const detectFormFactor = () => {
  if (typeof navigator === 'undefined') return 'Desktop'

  const userAgent = getNavigatorUserAgent()
  const maxTouchPoints = navigator.maxTouchPoints || 0
  const screenWidth =
    typeof window === 'undefined' ? 0 : Math.min(window.screen.width, window.screen.height)

  if (/iPad/i.test(userAgent)) return 'Tablet'
  if (/Tablet/i.test(userAgent)) return 'Tablet'
  if (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) return 'Tablet'
  if (/Mobi|iPhone|Android/i.test(userAgent) || (maxTouchPoints > 1 && screenWidth > 0 && screenWidth < 768)) {
    return 'Móvil'
  }

  return 'Desktop'
}

export const getPasskeyDeviceName = () => {
  const formFactor = detectFormFactor()
  const os = detectOperatingSystem()
  const browser = detectBrowser()

  return `${formFactor} ${os} - ${browser}`.trim()
}

export const getLegacyPasskeyDeviceName = () => {
  const platform = getNavigatorPlatform() || 'Dispositivo'
  const browser = detectBrowser()

  return `${platform} - ${browser}`
}

export const getPasskeyDeviceNameCandidates = () => {
  const current = getPasskeyDeviceName()
  const legacy = getLegacyPasskeyDeviceName()

  return Array.from(
    new Set([current, legacy].map((value) => normalizeValue(value)).filter(Boolean)),
  )
}

export const normalizePasskeyDeviceName = normalizeValue
