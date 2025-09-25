import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ["en", "es"] as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathLocale = pathname.split("/")[1];
  const hasLocalePrefix = SUPPORTED_LOCALES.includes(pathLocale as any);

  if (!hasLocalePrefix) {
    const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";
    const url = new URL(`/${locale}${pathname}${req.nextUrl.search}`, req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
  ],
};


