import { useEffect } from "react"
import { useLocation } from "react-router"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import Logo from "~/components/shared/Logo"
import { titleFromPath, useUIStore } from "~/stores/ui"

export function SiteHeader() {
  const location = useLocation()
  const pageTitle = useUIStore((s) => s.pageTitle)
  const setPageTitle = useUIStore((s) => s.setPageTitle)

  useEffect(() => {
    setPageTitle(titleFromPath(location.pathname))
  }, [location.pathname, setPageTitle])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b/50 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden md:block">
          <Logo size="sm" variant="dark" />
        </div>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://royaldrivecanada.com/"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              Visit Website
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
