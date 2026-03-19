"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateERP = generateERP;
const auth_providers_1 = require("../auth-providers");
const shared_1 = require("./shared");
const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Inventory", href: "/inventory", icon: "📦" },
    { name: "Orders", href: "/orders", icon: "🛒" },
    { name: "Procurement", href: "/procurement", icon: "🏭" },
    { name: "Finance", href: "/finance", icon: "💰" },
    { name: "HR", href: "/hr", icon: "🧑‍💼" },
    { name: "Reports", href: "/reports", icon: "📈" },
];
function generateERP(options) {
    const { projectTitle, colorPalette, authProvider } = options;
    const auth = (0, auth_providers_1.generateAuthProvider)(authProvider);
    const ownFiles = [
        ...(0, shared_1.sharedFiles)(options),
        (0, shared_1.sidebar)(options, NAV_ITEMS),
        (0, shared_1.header)(options, "Dashboard"),
        (0, shared_1.footer)(options),
        (0, shared_1.profilePage)(options, "(erp)"),
        // Root redirect
        {
            path: "app/page.tsx",
            content: `import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
}
`,
        },
        // ERP layout
        {
            path: "app/(erp)/layout.tsx",
            content: `import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ERPLayout({ children }: { children: React.ReactNode }) {
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
            path: "app/(erp)/dashboard/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard — ${projectTitle}" }

const stats = [
  { label: "Total Revenue", value: "$1.24M", change: "+9%", up: true },
  { label: "Open Orders", value: "342", change: "+4%", up: true },
  { label: "Inventory Items", value: "8,910", change: "-1%", up: false },
  { label: "Active Employees", value: "124", change: "+2", up: true },
]

const recentOrders = [
  { id: "PO-0091", supplier: "FastParts Inc.", status: "Received", amount: "$4,200" },
  { id: "SO-0445", customer: "Acme Corp", status: "Shipped", amount: "$8,750" },
  { id: "SO-0444", customer: "GlobalTech", status: "Processing", amount: "$3,100" },
  { id: "PO-0090", supplier: "MetalWorks Ltd.", status: "Pending", amount: "$6,500" },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enterprise overview — today at a glance.</p>
      </div>

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

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {recentOrders.map((order) => (
            <li key={order.id} className="flex items-center justify-between px-6 py-3.5">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {"supplier" in order ? order.supplier : (order as typeof order).customer}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{order.amount}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-${colorPalette}-50 dark:bg-${colorPalette}-950 text-${colorPalette}-700 dark:text-${colorPalette}-300 font-medium">
                  {order.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
`,
        },
        // Inventory page
        {
            path: "app/(erp)/inventory/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Inventory — ${projectTitle}" }

const items = [
  { sku: "WGT-001", name: "Widget A", category: "Components", qty: 1200, reorder: 200, status: "In Stock" },
  { sku: "WGT-002", name: "Widget B", category: "Components", qty: 85, reorder: 150, status: "Low Stock" },
  { sku: "ASM-010", name: "Assembly Kit X", category: "Assemblies", qty: 0, reorder: 50, status: "Out of Stock" },
  { sku: "PKG-005", name: "Packaging Set M", category: "Packaging", qty: 4500, reorder: 500, status: "In Stock" },
  { sku: "RAW-021", name: "Steel Rod 12mm", category: "Raw Materials", qty: 320, reorder: 100, status: "In Stock" },
]

const statusColor: Record<string, string> = {
  "In Stock": "bg-${colorPalette}-50 dark:bg-${colorPalette}-950 text-${colorPalette}-700 dark:text-${colorPalette}-300",
  "Low Stock": "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  "Out of Stock": "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
}

export default function InventoryPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{items.length} SKUs tracked</p>
        </div>
        <button className="px-4 py-2 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Item
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {["SKU", "Name", "Category", "Quantity", "Reorder Point", "Status"].map((h) => (
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
            {items.map((item) => (
              <tr key={item.sku} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{item.sku}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.category}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.qty.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.reorder}</td>
                <td className="px-6 py-4">
                  <span className={\`px-2 py-0.5 rounded-full text-xs font-medium \${statusColor[item.status]}\`}>
                    {item.status}
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
        // Orders page
        {
            path: "app/(erp)/orders/page.tsx",
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "Orders — ${projectTitle}" }

const orders = [
  { id: "SO-0445", type: "Sales", customer: "Acme Corp", date: "Mar 18, 2025", total: "$8,750", status: "Shipped" },
  { id: "SO-0444", type: "Sales", customer: "GlobalTech", date: "Mar 17, 2025", total: "$3,100", status: "Processing" },
  { id: "PO-0091", type: "Purchase", customer: "FastParts Inc.", date: "Mar 16, 2025", total: "$4,200", status: "Received" },
  { id: "SO-0443", type: "Sales", customer: "StartupXYZ", date: "Mar 15, 2025", total: "$1,900", status: "Delivered" },
  { id: "PO-0090", type: "Purchase", customer: "MetalWorks Ltd.", date: "Mar 14, 2025", total: "$6,500", status: "Pending" },
]

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sales & purchase orders</p>
        </div>
        <button className="px-4 py-2 bg-${colorPalette}-600 hover:bg-${colorPalette}-700 text-white text-sm font-medium rounded-lg transition-colors">
          + New Order
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {["Order ID", "Type", "Party", "Date", "Total", "Status"].map((h) => (
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
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs font-medium text-gray-900 dark:text-white">{o.id}</td>
                <td className="px-6 py-4">
                  <span className={\`px-2 py-0.5 rounded-full text-xs font-medium \${
                    o.type === "Sales"
                      ? "bg-${colorPalette}-50 dark:bg-${colorPalette}-950 text-${colorPalette}-700 dark:text-${colorPalette}-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }\`}>{o.type}</span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{o.customer}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{o.date}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{o.total}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{o.status}</td>
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
        // Finance, HR, Procurement, Reports — placeholders
        ...["finance", "hr", "procurement", "reports"].map((page) => ({
            path: `app/(erp)/${page}/page.tsx`,
            content: `import { Metadata } from "next"

export const metadata: Metadata = { title: "${page.charAt(0).toUpperCase() + page.slice(1)} — ${projectTitle}" }

export default function ${page.charAt(0).toUpperCase() + page.slice(1)}Page() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          ${page.charAt(0).toUpperCase() + page.slice(1)}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          ${page.charAt(0).toUpperCase() + page.slice(1)} module — connect to your data source to populate this page.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
        ${page.charAt(0).toUpperCase() + page.slice(1)} content coming soon
      </div>
    </div>
  )
}
`,
        })),
    ];
    return {
        files: [...ownFiles, ...auth.files],
        dependencies: auth.dependencies,
        devDependencies: auth.devDependencies,
        instructions: [
            ...auth.instructions,
            "Replace placeholder data with real database queries in each page file",
        ],
    };
}
