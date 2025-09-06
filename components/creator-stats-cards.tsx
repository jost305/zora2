"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Coins, Users } from "lucide-react"
import type { CreatorStats } from "@/hooks/use-creator-stats"

interface CreatorStatsCardsProps {
  stats: CreatorStats
}

export function CreatorStatsCards({ stats }: CreatorStatsCardsProps) {
  const ethPrice = 2500 // Mock ETH price

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.totalEarnings} ETH</div>
          <p className="text-xs text-muted-foreground">
            ${(Number.parseFloat(stats.totalEarnings) * ethPrice).toFixed(2)} USD
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVolume} ETH</div>
          <p className="text-xs text-muted-foreground">
            ${(Number.parseFloat(stats.totalVolume) * ethPrice).toFixed(2)} USD
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Content Coins</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCoins}</div>
          <p className="text-xs text-muted-foreground">Active coins created</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHolders}</div>
          <p className="text-xs text-muted-foreground">Across all coins</p>
        </CardContent>
      </Card>
    </div>
  )
}
