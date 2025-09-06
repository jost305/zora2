"use client"

import { useState } from "react"

export interface FeedItem {
  id: string
  title: string
  creator: string
  creatorAddress: string
  image: string
  marketCap: string
  price: string
  holders: number
  timeAgo: string
  change: string
  volume24h: string
  coinAddress: string
  exchangeAddress: string
  symbol: string
  category: "image" | "video" | "music" | "text"
}

// Mock data with more variety
const mockFeedData: FeedItem[] = [
  {
    id: "1",
    title: "Not me smiling lol",
    creator: "ilovemolly4ever",
    creatorAddress: "0x1234...5678",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot-20250805143949-c1IBy5EC605ZLLazq0z6bIciDDQvob.png",
    marketCap: "757.53",
    price: "3.54",
    holders: 3,
    timeAgo: "2m",
    change: "+15.2%",
    volume24h: "2.30",
    coinAddress: "0x1111...1111",
    exchangeAddress: "0x2222...2222",
    symbol: "SMILE",
    category: "image",
  },
  {
    id: "2",
    title: "Mérida",
    creator: "melhilo",
    creatorAddress: "0x3333...4444",
    image: "/vast-mountain-valley.png",
    marketCap: "191.67",
    price: "1.30",
    holders: 4,
    timeAgo: "4h",
    change: "+8.7%",
    volume24h: "1.20",
    coinAddress: "0x5555...5555",
    exchangeAddress: "0x6666...6666",
    symbol: "MERIDA",
    category: "image",
  },
  {
    id: "3",
    title: "bird sighting #1",
    creator: "d3modisuelto",
    creatorAddress: "0x7777...8888",
    image: "/colorful-bird-perched.png",
    marketCap: "187.37",
    price: "1.71",
    holders: 2,
    timeAgo: "4h",
    change: "+12.1%",
    volume24h: "0.95",
    coinAddress: "0x9999...9999",
    exchangeAddress: "0xaaaa...aaaa",
    symbol: "BIRD",
    category: "image",
  },
  {
    id: "4",
    title: "By the sea",
    creator: "zosphotos",
    creatorAddress: "0xbbbb...cccc",
    image: "/ocean-waves-crashing.png",
    marketCap: "119.35",
    price: "0.91",
    holders: 3,
    timeAgo: "4h",
    change: "+5.8%",
    volume24h: "0.75",
    coinAddress: "0xdddd...dddd",
    exchangeAddress: "0xeeee...eeee",
    symbol: "SEA",
    category: "image",
  },
  {
    id: "5",
    title: "BLURREDLEYES",
    creator: "grams",
    creatorAddress: "0xffff...0000",
    image: "/abstract-blurred-colorful-eyes-art.jpg",
    marketCap: "198.96",
    price: "4.18",
    holders: 3,
    timeAgo: "4h",
    change: "+18.3%",
    volume24h: "1.85",
    coinAddress: "0x1111...2222",
    exchangeAddress: "0x3333...4444",
    symbol: "BLUR",
    category: "image",
  },
  {
    id: "6",
    title: "3",
    creator: "nuv1914",
    creatorAddress: "0x5555...6666",
    image: "/minimalist-number-3-artistic-design.jpg",
    marketCap: "392.11",
    price: "8.55",
    holders: 3,
    timeAgo: "4h",
    change: "+22.7%",
    volume24h: "3.20",
    coinAddress: "0x7777...8888",
    exchangeAddress: "0x9999...aaaa",
    symbol: "THREE",
    category: "text",
  },
]

export type SortOption = "newest" | "trending" | "volume" | "marketCap" | "price"
export type FilterOption = "all" | "image" | "video" | "music" | "text"

export function useFeed() {
  const [items, setItems] = useState<FeedItem[]>(mockFeedData)
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("trending")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter and sort items
  const filteredAndSortedItems = items
    .filter((item) => {
      // Filter by category
      if (filterBy !== "all" && item.category !== filterBy) return false

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(query) ||
          item.creator.toLowerCase().includes(query) ||
          item.symbol.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime()
        case "trending":
          return (
            Number.parseFloat(b.change.replace("%", "").replace("+", "")) -
            Number.parseFloat(a.change.replace("%", "").replace("+", ""))
          )
        case "volume":
          return Number.parseFloat(b.volume24h) - Number.parseFloat(a.volume24h)
        case "marketCap":
          return Number.parseFloat(b.marketCap) - Number.parseFloat(a.marketCap)
        case "price":
          return Number.parseFloat(b.price) - Number.parseFloat(a.price)
        default:
          return 0
      }
    })

  const refreshFeed = async () => {
    setLoading(true)
    // In real app, fetch from API/blockchain
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return {
    items: filteredAndSortedItems,
    loading,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    searchQuery,
    setSearchQuery,
    refreshFeed,
  }
}
