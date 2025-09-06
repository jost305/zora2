"use client"

import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { CreatorStatsCards } from "@/components/creator-stats-cards"
import { CreatorCoinsTable } from "@/components/creator-coins-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DiceBearAvatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Plus, Settings, Copy, ExternalLink } from "lucide-react"
import { useAccount } from "wagmi"
import { useCreatorStats } from "@/hooks/use-creator-stats"
import Link from "next/link"

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const { stats, coins, loading, withdrawEarnings, withdrawAllEarnings } = useCreatorStats()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Navigation />
          <main className="flex-1 ml-64 p-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-12 text-center">
                  <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                  <p className="text-muted-foreground mb-6">
                    Connect your wallet to view your creator dashboard and manage your content coins.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Navigation />

        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <DiceBearAvatar
                      seed={address || "default"}
                      className="h-16 w-16"
                      fallbackText={address?.slice(2, 4).toUpperCase()}
                    />

                    <div>
                      <h1 className="text-2xl font-bold mb-2">Creator Dashboard</h1>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        Creator
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button asChild>
                      <Link href="/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Coin
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <CreatorStatsCards stats={stats} />

            {/* Earnings Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Earnings Management</CardTitle>
                  <Button
                    onClick={withdrawAllEarnings}
                    disabled={loading || Number.parseFloat(stats.pendingWithdrawals) === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Withdraw All ({stats.pendingWithdrawals} ETH)
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.pendingWithdrawals} ETH</div>
                    <div className="text-sm text-muted-foreground">Available to Withdraw</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{stats.totalEarnings} ETH</div>
                    <div className="text-sm text-muted-foreground">Total Earned</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">0.05%</div>
                    <div className="text-sm text-muted-foreground">Fee Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for different views */}
            <Tabs defaultValue="coins" className="w-full">
              <TabsList>
                <TabsTrigger value="coins">My Coins</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="coins" className="space-y-6">
                <CreatorCoinsTable coins={coins} onWithdraw={withdrawEarnings} loading={loading} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">Analytics dashboard coming soon...</div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">Activity feed coming soon...</div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
