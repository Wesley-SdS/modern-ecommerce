import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  matcher: [
    "/",
    "/(pt|es|en)/:path*",
    // Exclude API and Next internals from locale routing
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
}
