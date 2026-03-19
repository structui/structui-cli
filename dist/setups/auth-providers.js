"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthProvider = generateAuthProvider;
function generateNextAuth() {
    return {
        files: [
            {
                path: "lib/auth.ts",
                content: `import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Replace with your own user lookup & password verification
        if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
          return { id: "1", name: "Admin", email: credentials.email as string }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublic =
        nextUrl.pathname.startsWith("/sign-in") ||
        nextUrl.pathname.startsWith("/sign-up")
      if (isPublic) return true
      return isLoggedIn
    },
  },
})
`,
            },
            {
                path: "app/api/auth/[...nextauth]/route.ts",
                content: `import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
`,
            },
            {
                path: "middleware.ts",
                content: `export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
`,
            },
        ],
        dependencies: ["next-auth@beta"],
        devDependencies: [],
        instructions: [
            "Run: npx auth secret  →  generates AUTH_SECRET and adds it to .env.local",
            "Update lib/auth.ts to connect to your database for user lookup",
            "Add OAuth providers (GitHub, Google, etc.) in lib/auth.ts if needed",
        ],
    };
}
function generateBetterAuth() {
    return {
        files: [
            {
                path: "lib/auth.ts",
                content: `import { betterAuth } from "better-auth"

export const auth = betterAuth({
  // TODO: Connect to your database adapter
  // database: new PrismaAdapter(prisma),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // Refresh every day
  },
})
`,
            },
            {
                path: "lib/auth-client.ts",
                content: `import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
})

export const { signIn, signUp, signOut, useSession } = authClient
`,
            },
            {
                path: "app/api/auth/[...all]/route.ts",
                content: `import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
`,
            },
            {
                path: "middleware.ts",
                content: `import { NextRequest, NextResponse } from "next/server"

const publicPaths = ["/sign-in", "/sign-up", "/api/auth"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token")

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
`,
            },
        ],
        dependencies: ["better-auth"],
        devDependencies: [],
        instructions: [
            "Add to .env.local:  BETTER_AUTH_SECRET=<random>  BETTER_AUTH_URL=http://localhost:3000  NEXT_PUBLIC_APP_URL=http://localhost:3000",
            "Configure a database adapter in lib/auth.ts (Prisma, Drizzle, etc.)",
            "See https://www.better-auth.com/docs for full documentation",
        ],
    };
}
function generateBasicAuth() {
    return {
        files: [
            {
                path: "lib/auth.ts",
                content: `import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-me-in-production-please"
)
const COOKIE_NAME = "session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function setSession(payload: Record<string, unknown>) {
  const token = await createToken(payload)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
`,
            },
            {
                path: "app/api/auth/sign-in/route.ts",
                content: `import { NextRequest, NextResponse } from "next/server"
import { setSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  // TODO: Replace with your database user lookup & bcrypt password check
  // const user = await db.user.findUnique({ where: { email } })
  // const valid = user && await bcrypt.compare(password, user.password)
  if (email !== "admin@example.com" || password !== "password") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  await setSession({ id: "1", email, name: "Admin" })
  return NextResponse.json({ success: true })
}
`,
            },
            {
                path: "app/api/auth/sign-up/route.ts",
                content: `import { NextRequest, NextResponse } from "next/server"
import { setSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json()

  // TODO: Hash password and save user to your database
  // const hashedPassword = await bcrypt.hash(password, 10)
  // const user = await db.user.create({ data: { name, email, password: hashedPassword } })
  void password // remove this line once you implement DB storage

  await setSession({ id: "new-user", email, name })
  return NextResponse.json({ success: true })
}
`,
            },
            {
                path: "app/api/auth/sign-out/route.ts",
                content: `import { NextResponse } from "next/server"
import { clearSession } from "@/lib/auth"

export async function POST() {
  await clearSession()
  return NextResponse.json({ success: true })
}
`,
            },
            {
                path: "middleware.ts",
                content: `import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-me-in-production-please"
)
const publicPaths = ["/sign-in", "/sign-up", "/api/auth"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  const token = request.cookies.get("session")?.value
  if (!token) return NextResponse.redirect(new URL("/sign-in", request.url))

  try {
    await jwtVerify(token, SECRET)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
`,
            },
        ],
        dependencies: ["jose"],
        devDependencies: [],
        instructions: [
            "Add to .env.local:  JWT_SECRET=<strong-random-string>",
            "Update app/api/auth/sign-in/route.ts to verify against your database",
            "Update app/api/auth/sign-up/route.ts to hash passwords (use bcrypt) and store users",
            "Install bcrypt if needed: npm install bcrypt @types/bcrypt",
        ],
    };
}
function generateAuthProvider(provider) {
    switch (provider) {
        case "next-auth":
            return generateNextAuth();
        case "better-auth":
            return generateBetterAuth();
        case "basic-auth":
            return generateBasicAuth();
        case "none":
            return { files: [], dependencies: [], devDependencies: [], instructions: [] };
    }
}
