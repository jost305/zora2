"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DiceBearAvatar } from "@/components/ui/avatar"
import { TrendingUp, Users, Clock, Volume2, ImageIcon, Video, Music, FileText } from "lucide-react"
import type { FeedItem } from "@/hooks/use-feed"

interface FeedCardProps {
  item: FeedItem
  layout?: "grid" | "list"
  onCoinClick?: (coinId: string) => void
}

export function FeedCard({ item, layout = "grid", onCoinClick }: FeedCardProps) {
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

  const handleClick = () => {
    onCoinClick?.(item.id)
  }

  if (layout === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div onClick={handleClick} className="cursor-pointer">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 relative flex-shrink-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base md:text-lg truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <DiceBearAvatar
                        seed={item.creator}
                        className="h-4 w-4 md:h-5 md:w-5"
                        fallbackText={item.creator[0]}
                      />
                      <span className="text-xs md:text-sm text-muted-foreground truncate">{item.creator}</span>
                      <Badge variant="outline" className="text-xs hidden sm:flex">
                        {getCategoryIcon(item.category)}
                        <span className="ml-1">{item.symbol}</span>
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{item.timeAgo}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Market Cap</div>
                    <div className="font-medium text-green-600">${item.marketCap}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Price</div>
                    <div className="font-medium">${item.price}</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-muted-foreground text-xs">24h Volume</div>
                    <div className="font-medium">${item.volume24h}</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-muted-foreground text-xs">Change</div>
                    <div className="font-medium text-green-600">{item.change}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={handleClick}>
        <div className="aspect-square relative">
          <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/50 text-white border-0">
              {getCategoryIcon(item.category)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base md:text-lg mb-1 truncate">{item.title}</h3>
              <div className="flex items-center gap-2">
                <DiceBearAvatar seed={item.creator} className="h-4 w-4 md:h-5 md:w-5" fallbackText={item.creator[0]} />
                <span className="text-xs md:text-sm text-muted-foreground truncate">{item.creator}</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{item.timeAgo}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-green-600 bg-green-50 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />${item.marketCap}
              </Badge>
              <span className="text-sm font-medium text-green-600">{item.change}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />${item.price}
              </div>
              <div className="flex items-center">
                <Volume2 className="h-3 w-3 mr-1" />${item.volume24h}
              </div>
              <div className="flex items-center col-span-2 md:col-span-1">
                <Users className="h-3 w-3 mr-1" />
                {item.holders}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
