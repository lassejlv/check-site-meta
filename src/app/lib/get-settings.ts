import { cookies } from "next/headers"
import { defaultUserAgent } from "./fetch"

export async function getUserSettings() {
  const cookie = await cookies()
  return {
    userAgent: cookie.get('userAgent')?.value || defaultUserAgent
  }
}
export type UserSettings = Awaited<ReturnType<typeof getUserSettings>>
