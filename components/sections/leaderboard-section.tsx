"use client"

import { useState } from "react"
import { Trophy } from "lucide-react"

// Mock data for leaderboard
const leaderboardData = [
  {
    id: 1,
    name: "CryptoArtist",
    totalVolume: "1,234.5 ETH",
    totalSales: 156,
    followers: 12500,
    rank: 1,
    change: "+12%",
  },
  {
    id: 2,
    name: "DigitalCreator",
    totalVolume: "987.3 ETH",
    totalSales: 134,
    followers: 9800,
    rank: 2,
    change: "+8%",
  },
  {
    id: 3,
    name: "NFTMaster",
    totalVolume: "756.2 ETH",
    totalSales: 98,
    followers: 7600,
    rank: 3,
    change: "+5%",
  },
  {
    id: 4,
    name: "ArtCollector",
    totalVolume: "654.1 ETH",
    totalSales: 87,
    followers: 6400,
    rank: 4,
    change: "-2%",
  },
  {
    id: 5,
    name: "MetaCreator",
    totalVolume: "543.9 ETH",
    totalSales: 76,
    followers: 5200,
    rank: 5,
    change: "+15%",
  },
]

const timeframes = ["24h", "7d", "30d", "All Time"]
const categories = ["Volume", "Sales", "Followers"]

export function LeaderboardSection() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [selectedCategory, setSelectedCategory] = useState("Volume")

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top creators and collectors in the community</p>
      </div>
    </div>
  )
}
