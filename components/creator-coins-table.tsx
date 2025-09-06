"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, ImageIcon, Video, Music, FileText } from "lucide-react"
import Link from "next/link"
import type { CreatorCoin } from "@/hooks/use-creator-stats"

interface CreatorCoinsTableProps {
  coins: CreatorCoin[]
  onWithdraw: (coinId: string) => void
  loading: boolean
}

export function CreatorCoinsTable({ coins, onWithdraw, loading }: CreatorCoinsTableProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "image":
        return <ImageIcon className="h-3 w-3" />
      case "video":
        return <Video className="h-3 w-3" />
      case "music":
        return <Music className="h-3 w-3" />
      case "text":
        return <FileText className="h-3 w-3" />
      default:
        return <ImageIcon className="h-3 w-3" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Content Coins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coins.map((coin) => (
            <div key={coin.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative">
                  <img
                    src={coin.image || "/placeholder.svg"}
                    alt={coin.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{coin.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryIcon(coin.category)}
                      <span className="ml-1">{coin.symbol}</span>
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created {new Date(coin.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                  <div className="font-medium">${coin.marketCap}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">24h Volume</div>
                  <div className="font-medium">${coin.volume24h}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Holders</div>
                  <div className="font-medium">{coin.holders}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Earnings</div>
                  <div className="font-medium text-green-600">{coin.earnings} ETH</div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/coin/${coin.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onWithdraw(coin.id)}
                    disabled={loading || Number.parseFloat(coin.earnings) === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {coins.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">No content coins created yet</div>
            <Button asChild>
              <Link href="/create">Create Your First Coin</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
