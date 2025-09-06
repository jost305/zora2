"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DiceBearAvatar } from "@/components/ui/avatar"
import { Trophy, TrendingUp, Users, Coins } from "lucide-react"

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

export default function LeaderboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [selectedCategory, setSelectedCategory] = useState("Volume")

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Navigation />

        <main className="flex-1 md:ml-64 p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
              <p className="text-muted-foreground">Top creators and collectors in the community</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground self-center">Timeframe:</span>
                {timeframes.map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={selectedTimeframe === timeframe ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe)}
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground self-center">Category:</span>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4,175.0 ETH</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">551</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Top Creators - {selectedCategory} ({selectedTimeframe})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.map((creator) => (
                    <div
                      key={creator.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8">{getRankIcon(creator.rank)}</div>
                        <DiceBearAvatar
                          seed={creator.name}
                          className="h-10 w-10"
                          fallbackText={creator.name.slice(0, 2)}
                        />
                        <div>
                          <h3 className="font-semibold">{creator.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {creator.followers.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-right">
                        <div>
                          <p className="font-semibold">{creator.totalVolume}</p>
                          <p className="text-sm text-muted-foreground">{creator.totalSales} sales</p>
                        </div>
                        <Badge variant={creator.change.startsWith("+") ? "default" : "destructive"}>
                          {creator.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
