"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSaaS = generateSaaS;
const auth_providers_1 = require("../auth-providers");
const shared_1 = require("./shared");
const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Analytics", href: "/analytics", icon: "📉" },
    { name: "Users", href: "/users", icon: "👥" },
    { name: "Billing", href: "/billing", icon: "💳" },
    { name: "Settings", href: "/settings", icon: "⚙️" },
];
function generateSaaS(options) {
    const { projectTitle, colorPalette, authProvider } = options;
    const auth = (0, auth_providers_1.generateAuthProvider)(authProvider);
    const ownFiles = [
        ...(0, shared_1.sharedFiles)(options),
        (0, shared_1.sidebar)(options, NAV_ITEMS),
        (0, shared_1.header)(options, "Dashboard"),
        (0, shared_1.footer)(options),
        (0, shared_1.profilePage)(options, "(app)"),
        // Root: marketing landing page
        {
            path: "app/page.tsx",
            content: `import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-gray-900 dark:text-white">${projectTitle}</span>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          The platform for{" "}
          <span className="text-${colorPalette}-600">modern teams</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          ${projectTitle} gives your team everything they need to move fast, stay aligned, and scale with confidence.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 text-white font-semibold rounded-xl transition-colors"
          >
            Start free trial
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-${colorPalette}-400 font-medium rounded-xl transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "⚡", title: "Blazing fast", desc: "Sub-100ms response times powered by edge infrastructure." },
          { icon: "🔒", title: "Secure by default", desc: "SOC 2 Type II compliant with end-to-end encryption." },
          { icon: "📈", title: "Built to scale", desc: "From 1 user to 1M — zero configuration needed." },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-3"
          >
            <span className="text-3xl">{f.icon}</span>
            <h3 className="font-semibold text-gray-900 dark:text-white">{f.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
`,
        },
        // App layout (with sidebar)
        {
            path: "app/(app)/layout.tsx",
            content: `import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
`,
        },
        // Dashboard
        {
            path: "app/(app)/dashboard/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard — ${projectTitle}" }

const stats = [
  { label: "Active Users", value: "3,241", change: "+18%", up: true },
  { label: "MRR", value: "$24,800", change: "+12%", up: true },
  { label: "Churn", value: "1.8%", change: "-0.2%", up: false },
  { label: "NPS Score", value: "72", change: "+5", up: true },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Product health at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-2"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <span
              className={\`inline-flex items-center gap-1 text-xs font-medium \${
                s.up
                  ? "text-${colorPalette}-600 dark:text-${colorPalette}-400"
                  : "text-red-600 dark:text-red-400"
              }\`}
            >
              {s.up ? "▲" : "▼"} {s.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 h-52 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
          Revenue Chart — integrate Recharts here
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 h-52 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
          User Growth Chart — integrate Recharts here
        </div>
      </div>
    </div>
  )
}
`,
        },
        // Analytics
        {
            path: "app/(app)/analytics/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Analytics — ${projectTitle}" }

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Deep-dive into product metrics.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Page Views", "Sessions", "Conversion Rate", "Avg. Session Duration"].map((name) => (
          <div
            key={name}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 h-52 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm"
          >
            {name} — chart coming soon
          </div>
        ))}
      </div>
    </div>
  )
}
`,
        },
        // Users
        {
            path: "app/(app)/users/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Users — ${projectTitle}" }

const users = [
  { id: 1, name: "Alice Martin", email: "alice@example.com", plan: "Pro", joined: "Jan 10, 2025", status: "Active" },
  { id: 2, name: "Bob Chen", email: "bob@example.com", plan: "Starter", joined: "Feb 2, 2025", status: "Active" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", plan: "Enterprise", joined: "Dec 5, 2024", status: "Active" },
  { id: 4, name: "Dan Kim", email: "dan@example.com", plan: "Pro", joined: "Mar 1, 2025", status: "Inactive" },
]

export default function UsersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{users.length} registered users</p>
        </div>
        <button className="px-4 py-2 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 text-white text-sm font-medium rounded-lg transition-colors">
          + Invite User
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {["Name", "Email", "Plan", "Joined", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{u.name}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-${colorPalette}-50 dark:bg-${colorPalette}-950 text-${colorPalette}-700 dark:text-${colorPalette}-300">
                    {u.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.joined}</td>
                <td className="px-6 py-4">
                  <span
                    className={\`text-xs font-medium \${
                      u.status === "Active"
                        ? "text-${colorPalette}-600 dark:text-${colorPalette}-400"
                        : "text-gray-400 dark:text-gray-500"
                    }\`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
`,
        },
        // Billing
        {
            path: "app/(app)/billing/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Billing — ${projectTitle}" }

const plans = [
  { name: "Starter", price: "$9", period: "mo", features: ["5 users", "10 GB storage", "Basic analytics"], current: false },
  { name: "Pro", price: "$29", period: "mo", features: ["25 users", "100 GB storage", "Advanced analytics", "Priority support"], current: true },
  { name: "Enterprise", price: "$99", period: "mo", features: ["Unlimited users", "1 TB storage", "Custom analytics", "Dedicated support", "SLA"], current: false },
]

export default function BillingPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your subscription and payment details.</p>
      </div>

      {/* Current plan banner */}
      <div className="bg-${colorPalette}-50 dark:bg-${colorPalette}-950/50 border border-${colorPalette}-200 dark:border-${colorPalette}-900 rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-${colorPalette}-900 dark:text-${colorPalette}-100">You&apos;re on the Pro plan</p>
          <p className="text-xs text-${colorPalette}-700 dark:text-${colorPalette}-300 mt-0.5">Next billing date: April 1, 2025</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-${colorPalette}-700 dark:text-${colorPalette}-300 border border-${colorPalette}-300 dark:border-${colorPalette}-700 rounded-lg hover:bg-${colorPalette}-100 dark:hover:bg-${colorPalette}-900 transition-colors">
          Manage subscription
        </button>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={\`rounded-xl border p-6 space-y-4 \${
              plan.current
                ? "border-${colorPalette}-400 dark:border-${colorPalette}-600 bg-white dark:bg-gray-900 shadow-sm"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            }\`}
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{plan.name}</p>
              <p className="mt-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">/{plan.period}</span>
              </p>
            </div>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-${colorPalette}-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              className={\`w-full py-2 rounded-lg text-sm font-medium transition-colors \${
                plan.current
                  ? "bg-${colorPalette}-600 text-white cursor-default"
                  : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-${colorPalette}-400"
              }\`}
            >
              {plan.current ? "Current plan" : "Switch to " + plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
`,
        },
        // Settings
        {
            path: "app/(app)/settings/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Settings — ${projectTitle}" }

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage workspace preferences.</p>
      </div>

      {[
        {
          title: "General",
          fields: [
            { label: "Workspace name", value: "${projectTitle}", type: "text" },
            { label: "Support email", value: "support@example.com", type: "email" },
          ],
        },
        {
          title: "Notifications",
          fields: [
            { label: "Email digest", value: "Weekly", type: "text" },
          ],
        },
      ].map((section) => (
        <div
          key={section.title}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{section.title}</h2>
          {section.fields.map((f) => (
            <div key={f.label} className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{f.label}</label>
              <input
                type={f.type}
                defaultValue={f.value}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-${colorPalette}-500 transition"
              />
            </div>
          ))}
          <button className="px-4 py-2 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 text-white text-sm font-medium rounded-lg transition-colors">
            Save changes
          </button>
        </div>
      ))}
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
            "Install Recharts for analytics charts: npm install recharts",
            "Connect a payment provider (Stripe) for the Billing page",
            "Replace placeholder data with real database queries",
        ],
    };
}
