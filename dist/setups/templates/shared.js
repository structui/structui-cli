"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootLayout = rootLayout;
exports.globalsCss = globalsCss;
exports.authLayout = authLayout;
exports.signInPage = signInPage;
exports.signUpPage = signUpPage;
exports.sidebar = sidebar;
exports.header = header;
exports.footer = footer;
exports.profilePage = profilePage;
exports.sharedFiles = sharedFiles;
// ─── Root Layout ──────────────────────────────────────────────────────────────
function rootLayout(options) {
    const { projectTitle } = options;
    return {
        path: "app/layout.tsx",
        content: `import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "${projectTitle}",
  description: "${projectTitle} — built with Struct UI",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`,
    };
}
// ─── Global CSS ───────────────────────────────────────────────────────────────
function globalsCss() {
    return {
        path: "app/globals.css",
        content: `@import "tailwindcss";

@layer base {
  * {
    box-sizing: border-box;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }
}
`,
    };
}
// ─── Auth Layout ──────────────────────────────────────────────────────────────
function authLayout(options) {
    const { colorPalette } = options;
    return {
        path: "app/(auth)/layout.tsx",
        content: `export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-${colorPalette}-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
`,
    };
}
// ─── Sign In Page ─────────────────────────────────────────────────────────────
function signInPage(options) {
    const { projectTitle, colorPalette } = options;
    return {
        path: "app/(auth)/sign-in/page.tsx",
        content: `"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const body = { email: form.get("email"), password: form.get("password") }

    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Invalid credentials. Please try again.")
      return
    }
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to ${projectTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colorPalette}-500 focus:border-transparent transition"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colorPalette}-500 focus:border-transparent transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-${colorPalette}-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
`,
    };
}
// ─── Sign Up Page ─────────────────────────────────────────────────────────────
function signUpPage(options) {
    const { projectTitle, colorPalette } = options;
    return {
        path: "app/(auth)/sign-up/page.tsx",
        content: `"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    }

    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Something went wrong. Please try again.")
      return
    }
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Get started with ${projectTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jane Doe"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colorPalette}-500 focus:border-transparent transition"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colorPalette}-500 focus:border-transparent transition"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Min. 8 characters"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colorPalette}-500 focus:border-transparent transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-${colorPalette}-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
`,
    };
}
function sidebar(options, navItems) {
    const { projectTitle, colorPalette } = options;
    const navEntries = navItems
        .map((item) => `  { name: "${item.name}", href: "${item.href}", icon: "${item.icon}" },`)
        .join("\n");
    return {
        path: "components/layout/sidebar.tsx",
        content: `"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const navigation = [
${navEntries}
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await fetch("/api/auth/sign-out", { method: "POST" })
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <aside className="w-64 shrink-0 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="w-7 h-7 rounded-md bg-${colorPalette}-600 flex items-center justify-center text-white font-bold text-sm">
          ${projectTitle.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          ${projectTitle}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={\`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${
                isActive
                  ? "bg-${colorPalette}-50 dark:bg-${colorPalette}-950/50 text-${colorPalette}-700 dark:text-${colorPalette}-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }\`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-0.5">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <span className="text-base leading-none">👤</span>
          Profile
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <span className="text-base leading-none">↩</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
`,
    };
}
// ─── Top Header ───────────────────────────────────────────────────────────────
function header(options, pageTitle) {
    const { colorPalette } = options;
    return {
        path: "components/layout/header.tsx",
        content: `"use client"

interface HeaderProps {
  title?: string
}

export function Header({ title = "${pageTitle}" }: HeaderProps) {
  return (
    <header className="h-16 shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-6">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
      <div className="flex items-center gap-3">
        <button className="relative p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="text-lg leading-none">🔔</span>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-${colorPalette}-500" />
        </button>
        <div className="w-8 h-8 rounded-full bg-${colorPalette}-100 dark:bg-${colorPalette}-900 flex items-center justify-center text-${colorPalette}-700 dark:text-${colorPalette}-300 text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  )
}
`,
    };
}
// ─── Footer ───────────────────────────────────────────────────────────────────
function footer(options) {
    const { projectTitle, colorPalette } = options;
    return {
        path: "components/layout/footer.tsx",
        content: `export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
      <p className="text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-medium text-${colorPalette}-600 dark:text-${colorPalette}-400">
          ${projectTitle}
        </span>
        . All rights reserved.
      </p>
    </footer>
  )
}
`,
    };
}
// ─── Profile Page ─────────────────────────────────────────────────────────────
function profilePage(options, layoutPrefix) {
    const { projectTitle, colorPalette } = options;
    return {
        path: `app/${layoutPrefix}/profile/page.tsx`,
        content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Profile — ${projectTitle}" }

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Avatar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-${colorPalette}-100 dark:bg-${colorPalette}-900 flex items-center justify-center text-${colorPalette}-700 dark:text-${colorPalette}-300 text-2xl font-bold">
          A
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Admin User</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">admin@example.com</p>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full name", value: "Admin User" },
            { label: "Email", value: "admin@example.com" },
            { label: "Role", value: "Administrator" },
            { label: "Member since", value: "January 2025" },
          ].map((field) => (
            <div key={field.label}>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{field.label}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900 rounded-xl p-6 space-y-3">
        <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">Danger Zone</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Permanently delete your account and all associated data.
        </p>
        <button className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
          Delete account
        </button>
      </div>
    </div>
  )
}
`,
    };
}
// ─── Shared files list ────────────────────────────────────────────────────────
function sharedFiles(options) {
    return [rootLayout(options), globalsCss(), authLayout(options), signInPage(options), signUpPage(options)];
}
