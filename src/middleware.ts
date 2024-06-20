import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/error'
];

const API_BASE_PATH = '/api';

export async function middleware(request: NextRequest) {
  const {user, response} = await updateSession(request);

  const isAPIRoute = request.nextUrl.pathname.startsWith(API_BASE_PATH)
  const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname);

  if(isAPIRoute) {
    return response;
  }

  if((!user && !isPublicRoute)) {
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(new URL(`${origin}/login`));
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
