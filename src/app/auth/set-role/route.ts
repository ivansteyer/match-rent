import { NextRequest, NextResponse } from "next/server";

type Role = "LANDLORD" | "TENANT";

const TEN_MINUTES = 600;
const VALID_ROLES = new Set<Role>(["LANDLORD", "TENANT"]);

function isRole(value: string): value is Role {
  return VALID_ROLES.has(value as Role);
}

function resolveRole(role: string | null): Role {
  if (role && isRole(role)) {
    return role;
  }
  return "TENANT";
}

export async function GET(request: NextRequest) {
  const role = resolveRole(request.nextUrl.searchParams.get("role"));
  const prod = process.env.NODE_ENV === "production";
  const response = NextResponse.redirect(new URL("/auth/start", request.url), {
    status: 307,
  });

  response.cookies.set("intendedRole", role, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: prod,
    maxAge: TEN_MINUTES,
  });

  return response;
}
