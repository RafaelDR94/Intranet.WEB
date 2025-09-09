'use client'
import type { Set, Get } from '../types'

import { sendOTPEmail } from '@/app/context/AuthContext/utilities/AuthService'

export const askforOTPemail = async (
  _set: Set,
  get: Get
): Promise<void> => {
  await sendOTPEmail(get().token ?? '')
}
