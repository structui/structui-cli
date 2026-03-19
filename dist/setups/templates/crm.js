"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCRM = generateCRM;
const auth_providers_1 = require("../auth-providers");
const shared_1 = require("./shared");
const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Customers", href: "/customers", icon: "👥" },
    { name: "Deals", href: "/deals", icon: "💼" },
    { name: "Activities", href: "/activities", icon: "📅" },
    { name: "Reports", href: "/reports", icon: "📈" },
];
function generateCRM(options) {
    const { projectTitle, colorPalette, authProvider } = options;
    const auth = (0, auth_providers_1.generateAuthProvider)(authProvider);
    const ownFiles = [
        ...(0, shared_1.sharedFiles)(options),
        (0, shared_1.sidebar)(options, NAV_ITEMS),
        (0, shared_1.header)(options, "Dashboard"),
        (0, shared_1.footer)(options),
        (0, shared_1.profilePage)(options, "(crm)"),
        // Root redirect
        {
            path: "app/page.tsx",
            content: `import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
}
`,
        },
        // CRM layout (with sidebar)
        {
            path: "app/(crm)/layout.tsx",
            content: `import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function CRMLayout({ children }: { children: React.ReactNode }) {
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
        // Dashboard page
        {
            path: "app/(crm)/dashboard/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard — ${projectTitle}" }

const stats = [
  { label: "Total Customers", value: "2,847", change: "+12%", up: true },
  { label: "Active Deals", value: "148", change: "+5%", up: true },
  { label: "Revenue (MRR)", value: "$48,290", change: "+8%", up: true },
  { label: "Churn Rate", value: "2.1%", change: "-0.3%", up: false },
]

const recentActivity = [
  { action: "New deal created", detail: "Acme Corp — $12,000", time: "2 min ago" },
  { action: "Customer signed up", detail: "john@example.com", time: "15 min ago" },
  { action: "Deal closed (won)", detail: "GlobalTech — $8,500", time: "1 hr ago" },
  { action: "Follow-up scheduled", detail: "Sarah Johnson", time: "3 hr ago" },
  { action: "Invoice sent", detail: "StartupXYZ — $3,200", time: "5 hr ago" },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-2"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <span
              className={\`inline-flex items-center gap-1 text-xs font-medium \${
                stat.up
                  ? "text-${colorPalette}-600 dark:text-${colorPalette}-400"
                  : "text-red-600 dark:text-red-400"
              }\`}
            >
              {stat.up ? "▲" : "▼"} {stat.change} vs last month
            </span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {recentActivity.map((item, i) => (
            <li key={i} className="flex items-center justify-between px-6 py-3.5">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-4">
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
`,
        },
        // Customers page
        {
            path: "app/(crm)/customers/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Customers — ${projectTitle}" }

const customers = [
  { id: 1, name: "Acme Corp", contact: "alice@acme.com", status: "Active", value: "$24,000", since: "Jan 2024" },
  { id: 2, name: "GlobalTech", contact: "bob@globaltech.io", status: "Active", value: "$18,500", since: "Mar 2024" },
  { id: 3, name: "StartupXYZ", contact: "carol@startupxyz.com", status: "Prospect", value: "$6,200", since: "Jun 2024" },
  { id: 4, name: "MegaStore", contact: "dan@megastore.net", status: "Inactive", value: "$9,800", since: "Nov 2023" },
  { id: 5, name: "TechVentures", contact: "eve@techventures.co", status: "Active", value: "$31,000", since: "Feb 2024" },
]

const statusColor: Record<string, string> = {
  Active: "bg-${colorPalette}-50 dark:bg-${colorPalette}-950 text-${colorPalette}-700 dark:text-${colorPalette}-300",
  Prospect: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  Inactive: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
}

export default function CustomersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{customers.length} total customers</p>
        </div>
        <button className="px-4 py-2 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Customer
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {["Company", "Contact", "Status", "Total Value", "Customer Since"].map((h) => (
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
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{c.name}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{c.contact}</td>
                <td className="px-6 py-4">
                  <span className={\`px-2 py-0.5 rounded-full text-xs font-medium \${statusColor[c.status]}\`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{c.value}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{c.since}</td>
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
        // Deals page
        {
            path: "app/(crm)/deals/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Deals — ${projectTitle}" }

const deals = [
  { id: 1, name: "Acme Corp Enterprise", stage: "Proposal", value: "$12,000", owner: "Alice", close: "Mar 30" },
  { id: 2, name: "GlobalTech Renewal", stage: "Negotiation", value: "$8,500", owner: "Bob", close: "Apr 10" },
  { id: 3, name: "StartupXYZ Pilot", stage: "Discovery", value: "$3,200", owner: "Carol", close: "May 1" },
  { id: 4, name: "MegaStore Expansion", stage: "Closed Won", value: "$19,800", owner: "Dan", close: "Mar 15" },
  { id: 5, name: "TechVentures Pro", stage: "Proposal", value: "$7,500", owner: "Eve", close: "Apr 20" },
]

const stageColor: Record<string, string> = {
  Discovery: "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300",
  Proposal: "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300",
  Negotiation: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  "Closed Won": "bg-${colorPalette}-50 dark:bg-${colorPalette}-950 text-${colorPalette}-700 dark:text-${colorPalette}-300",
  "Closed Lost": "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
}

export default function DealsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Deals</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{deals.length} active deals</p>
        </div>
        <button className="px-4 py-2 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 text-white text-sm font-medium rounded-lg transition-colors">
          + New Deal
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {["Deal Name", "Stage", "Value", "Owner", "Expected Close"].map((h) => (
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
            {deals.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{d.name}</td>
                <td className="px-6 py-4">
                  <span className={\`px-2 py-0.5 rounded-full text-xs font-medium \${stageColor[d.stage] ?? ""}\`}>
                    {d.stage}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{d.value}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{d.owner}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{d.close}</td>
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
        // Reports page (placeholder)
        {
            path: "app/(crm)/reports/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Reports — ${projectTitle}" }

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Analytics and performance insights for your CRM.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Revenue Trend", "Customer Growth", "Deal Funnel", "Activity Summary"].map((name) => (
          <div
            key={name}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex items-center justify-center h-48 text-gray-400 dark:text-gray-600 text-sm"
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
        // Activities page (placeholder)
        {
            path: "app/(crm)/activities/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Activities — ${projectTitle}" }

const activities = [
  { type: "Call", subject: "Follow-up with Acme Corp", due: "Today, 2:00 PM", done: false },
  { type: "Email", subject: "Send proposal to GlobalTech", due: "Today, 5:00 PM", done: false },
  { type: "Meeting", subject: "Demo with StartupXYZ", due: "Tomorrow, 10:00 AM", done: false },
  { type: "Task", subject: "Update CRM notes for MegaStore", due: "Mar 22", done: true },
  { type: "Call", subject: "Renewal discussion — TechVentures", due: "Mar 24", done: false },
]

export default function ActivitiesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Activities</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upcoming tasks and scheduled events</p>
        </div>
        <button className="px-4 py-2 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 text-white text-sm font-medium rounded-lg transition-colors">
          + Log Activity
        </button>
      </div>

      <ul className="space-y-3">
        {activities.map((a, i) => (
          <li
            key={i}
            className={\`flex items-center gap-4 bg-white dark:bg-gray-900 border rounded-xl px-5 py-4 \${
              a.done
                ? "border-gray-100 dark:border-gray-800 opacity-60"
                : "border-gray-200 dark:border-gray-800"
            }\`}
          >
            <span className="text-lg leading-none">
              {a.type === "Call" ? "📞" : a.type === "Email" ? "📧" : a.type === "Meeting" ? "📅" : "✅"}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className={\`text-sm font-medium text-gray-900 dark:text-white \${
                  a.done ? "line-through text-gray-400" : ""
                }\`}
              >
                {a.subject}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{a.type} · {a.due}</p>
            </div>
            {!a.done && (
              <span className="text-xs font-medium text-${colorPalette}-600 dark:text-${colorPalette}-400 bg-${colorPalette}-50 dark:bg-${colorPalette}-950 px-2 py-0.5 rounded-full">
                Pending
              </span>
            )}
          </li>
        ))}
      </ul>
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
            "Replace placeholder data with real database queries in each page file",
            "Install Recharts for the Reports charts: npm install recharts",
        ],
    };
}
