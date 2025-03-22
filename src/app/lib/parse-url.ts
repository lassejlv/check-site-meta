import { AppError } from "../module/error/error-primitives"

export function parseUrlFromQuery(query?: string | string[]) {
  if (!query) return null

  // Infer URL
  let inferredUrl = Array.isArray(query) ? query[0] : query

  if (inferredUrl.startsWith("localhost")) {
    inferredUrl = "http://" + inferredUrl
  }
  if (inferredUrl.startsWith(":")) {
    inferredUrl = "http://localhost" + inferredUrl
  }
  if (!inferredUrl.startsWith("http")) {
    inferredUrl = "http://" + inferredUrl
  }

  // Validate URL
  if (
    !inferredUrl.startsWith("http://") &&
    !inferredUrl.startsWith("https://") &&
    !inferredUrl.startsWith("localhost:")
  ) {
    throw new AppError(new Error(), "input", "Invalid URL", "URL must have valid protocol with http:// or https:// - or no protocol at all", [])
  }

  try {
    // Final check
    return new URL(inferredUrl)
  } catch (error) {
    throw new AppError(new Error(), "input", "Invalid URL", "URL must start with http:// or https://", [JSON.stringify(error)])
  }
}