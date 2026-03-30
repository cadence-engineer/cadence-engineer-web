import { NextRequest, NextResponse } from "next/server";
import { createUnauthorizedResponse } from "@/lib/server/auth-cookies";
import { getValidAccessTokenFromRequest } from "@/lib/server/access-token";

export async function GET(request: NextRequest) {
  const accessToken = getValidAccessTokenFromRequest(request);

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  return new NextResponse(null, { status: 204 });
}
