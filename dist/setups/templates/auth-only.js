"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthOnly = generateAuthOnly;
const auth_providers_1 = require("../auth-providers");
const shared_1 = require("./shared");
function generateAuthOnly(options) {
    const { projectTitle, colorPalette, authProvider } = options;
    const auth = (0, auth_providers_1.generateAuthProvider)(authProvider);
    const ownFiles = [
        (0, shared_1.rootLayout)(options),
        (0, shared_1.globalsCss)(),
        (0, shared_1.authLayout)(options),
        (0, shared_1.signInPage)(options),
        (0, shared_1.signUpPage)(options),
        // Root redirect to sign-in
        {
            path: "app/page.tsx",
            content: `import { redirect } from "next/navigation"

export default function Home() {
  redirect("/sign-in")
}
`,
        },
        // Forgot password page
        {
            path: "app/(auth)/forgot-password/page.tsx",
            content: `"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement password reset email sending
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <p className="text-${colorPalette}-600 dark:text-${colorPalette}-400 font-medium text-sm">
            ✓ Reset link sent! Check your inbox.
          </p>
          <Link href="/sign-in" className="text-sm text-gray-500 hover:underline">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${colorPalette}-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="/sign-in" className="hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}
`,
        },
        // Simple protected home (redirects here after login)
        {
            path: "app/(protected)/layout.tsx",
            content: `export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-900 dark:text-white text-sm">${projectTitle}</span>
        <form action="/api/auth/sign-out" method="POST">
          <button
            type="submit"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Sign out
          </button>
        </form>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
`,
        },
        // Protected home page
        {
            path: "app/(protected)/home/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Home — ${projectTitle}" }

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 py-12">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-${colorPalette}-100 dark:bg-${colorPalette}-900 flex items-center justify-center text-3xl mx-auto">
          🏠
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">You&apos;re in!</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Authentication is working. Start building your app here.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Next steps</h2>
        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <li className="flex items-start gap-2"><span className="text-${colorPalette}-500 shrink-0">1.</span> Connect your database in the auth handler</li>
          <li className="flex items-start gap-2"><span className="text-${colorPalette}-500 shrink-0">2.</span> Add your own pages and navigation</li>
          <li className="flex items-start gap-2"><span className="text-${colorPalette}-500 shrink-0">3.</span> Customize the UI to match your brand</li>
        </ul>
      </div>
    </div>
  )
}
`,
        },
    ];
    return {
        files: [...ownFiles, ...auth.files],
        dependencies: auth.dependencies,
        devDependencies: auth.devDependencies,
        instructions: [
            ...auth.instructions,
            "Update the sign-out handler in app/(protected)/layout.tsx to match your auth provider",
            "Add password reset email logic in app/(auth)/forgot-password/page.tsx",
        ],
    };
}
