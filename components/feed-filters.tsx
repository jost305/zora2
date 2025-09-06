"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw } from "lucide-react"
import type { SortOption, FilterOption } from "@/hooks/use-feed"

interface FeedFiltersProps {
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  filterBy: FilterOption
  setFilterBy: (filter: FilterOption) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  onRefresh: () => void
  loading: boolean
}

export function FeedFilters({
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  searchQuery,
  setSearchQuery,
  onRefresh,
  loading,
}: FeedFiltersProps) {
  const filterTabs = [
    { label: "All", value: "all" as FilterOption },
    { label: "Images", value: "image" as FilterOption },
    { label: "Videos", value: "video" as FilterOption },
    { label: "Music", value: "music" as FilterOption },
    { label: "Text", value: "text" as FilterOption },
  ]

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search creators, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="marketCap">Market Cap</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <Button
            key={tab.value}
            variant={filterBy === tab.value ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setFilterBy(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
