import { create } from "zustand"

type UIState = {
  pageTitle: string
  setPageTitle: (title: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  pageTitle: "Dashboard",
  setPageTitle: (pageTitle) => set({ pageTitle }),
}))

// Helper to derive a pretty title from a path
export function titleFromPath(pathname: string): string {
  if (!pathname || pathname === "/") return "Dashboard"
  // Normalize trailing slashes
  const path = pathname.replace(/\/$/, "")
  // Known mappings (modules)
  const map: Record<string, string> = {
    "/vehicles": "Vehicles",
    "/makes": "Vehicle Makes",
    "/sales": "Sales",
    "/enquiries/quotations": "Quotation Enquiries",
    "/enquiries/financing": "Financing Enquiries",
    "/settings/business": "Business Information",
    "/testimonials": "Testimonials",
    "/legal/terms": "Terms & Conditions",
    "/legal/privacy": "Privacy Policy",
  }

  // Exact match first
  if (map[path]) return map[path]

  // Prefix match by module
  const entries = Object.entries(map)
  for (const [prefix, label] of entries) {
    if (path === prefix || path.startsWith(prefix + "/")) return label
  }

  // Fallback: last segment -> Title Case
  const seg = path.split("/").filter(Boolean).pop() || "Dashboard"
  return seg
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}
