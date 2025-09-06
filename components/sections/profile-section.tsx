"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DiceBearAvatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Copy, ExternalLink } from "lucide-react"
import { useAccount } from "wagmi"
import { useCreatorStats } from "@/hooks/use-creator-stats"
import { useSectionNavigation } from "@/hooks/use-section-navigation"

export function ProfileSection() {
  const { address, isConnected } = useAccount()
  const { stats, coins, loading, withdrawEarnings, withdrawAllEarnings } = useCreatorStats()
  const { navigateToCreate } = useSectionNavigation()

  if (!isConnected) {
    return (
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
    )
  }

  return (
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
              <Button onClick={navigateToCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Coin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
