"use client"

import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { FeedFilters } from "@/components/feed-filters"
import { FeedCard } from "@/components/feed-card"
import { Button } from "@/components/ui/button"
import { Grid, List, Loader2 } from "lucide-react"
import { useFeed } from "@/hooks/use-feed"
import { useSectionNavigation } from "@/hooks/use-section-navigation"
import { useState } from "react"

import { CreateSection } from "@/components/sections/create-section"
import { ProfileSection } from "@/components/sections/profile-section"
import { LeaderboardSection } from "@/components/sections/leaderboard-section"
import { CoinSection } from "@/components/sections/coin-section"

export default function HomePage() {
  const { items, loading, sortBy, setSortBy, filterBy, setFilterBy, searchQuery, setSearchQuery, refreshFeed } =
    useFeed()
  const { currentSection, coinId, navigateToCoin } = useSectionNavigation()

  const [layout, setLayout] = useState<"grid" | "list">("grid")

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "create":
        return <CreateSection />
      case "profile":
        return <ProfileSection />
      case "leaderboard":
        return <LeaderboardSection />
      case "coin":
        return <CoinSection coinId={coinId!} />
      default:
        return (
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Discover Content Coins</h1>
              <p className="text-muted-foreground">Trade and collect unique digital content on the blockchain</p>
            </div>

            {/* Filters */}
            <div className="mb-4 md:mb-6">
              <FeedFilters
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRefresh={refreshFeed}
                loading={loading}
              />
            </div>

            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="text-sm text-muted-foreground">
                <span className="hidden sm:inline">{items.length} content coins found</span>
                <span className="sm:hidden">{items.length} coins</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={layout === "grid" ? "default" : "outline"} size="sm" onClick={() => setLayout("grid")}>
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant={layout === "list" ? "default" : "outline"} size="sm" onClick={() => setLayout("list")}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2 hidden sm:inline">Loading content...</span>
                <span className="ml-2 sm:hidden">Loading...</span>
              </div>
            )}

            {!loading && (
              <div
                className={
                  layout === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    : "space-y-3 md:space-y-4"
                }
              >
                {items.map((item) => (
                  <FeedCard key={item.id} item={item} layout={layout} onCoinClick={navigateToCoin} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No content coins found</div>
                <Button onClick={refreshFeed} variant="outline">
                  Try refreshing
                </Button>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 md:ml-64 p-4 md:p-6 pb-20 md:pb-6 transition-all duration-300 ease-in-out">
          {renderCurrentSection()}
        </main>
      </div>
    </div>
  )
}
