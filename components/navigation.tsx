"use client"

import { Home, Plus, User, ChevronLeft, ChevronRight, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useSectionNavigation } from "@/hooks/use-section-navigation"

const navItems = [
  { icon: Home, label: "Home", section: "home" as const },
  { icon: Trophy, label: "Leaderboard", section: "leaderboard" as const },
  { icon: Plus, label: "Create", section: "create" as const },
  { icon: User, label: "Profile", section: "profile" as const },
]

export function Navigation() {
  const { currentSection, navigateToSection } = useSectionNavigation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      <nav
        className={cn(
          "hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("mb-4 p-2", isCollapsed ? "w-8 h-8" : "w-full justify-start")}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentSection === item.section

              return (
                <Button
                  key={item.section}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full transition-all duration-200",
                    isCollapsed ? "justify-center p-2" : "justify-start",
                    isActive && "bg-secondary",
                  )}
                  onClick={() => navigateToSection(item.section)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.label}
                </Button>
              )
            })}
          </div>
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentSection === item.section

            return (
              <Button
                key={item.section}
                variant="ghost"
                size="sm"
                className={cn("flex-col h-auto py-2 px-3", isActive && "text-primary")}
                onClick={() => navigateToSection(item.section)}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
