"use client"
import { TradingPanel } from "@/components/trading-panel"

// Mock data - in real app this would come from coinId prop and API
const mockCoinData = {
  id: "1",
  title: "Not me smiling lol",
  creator: "ilovemolly4ever",
  creatorAvatar: "/placeholder.svg?height=40&width=40",
  image:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot-20250805143949-c1IBy5EC605ZLLazq0z6bIciDDQvob.png",
  coinAddress: "0x1234567890123456789012345678901234567890" as const,
  exchangeAddress: "0x0987654321098765432109876543210987654321" as const,
  symbol: "SMILE",
  timeAgo: "2m",
  holders: 3,
}

const mockComments = [
  {
    id: 1,
    user: "cryptotrader",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "This is going to the moon! 🚀",
    timeAgo: "5m",
  },
  {
    id: 2,
    user: "artlover",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "Love the aesthetic, buying more",
    timeAgo: "12m",
  },
]

interface CoinSectionProps {
  coinId: string
}

export function CoinSection({ coinId }: CoinSectionProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <div className="flex-1 lg:flex-[2] space-y-4 md:space-y-6"></div>

        <div className="w-full lg:w-80 lg:shrink-0">
          <div className="sticky top-4">
            <TradingPanel exchangeAddress={mockCoinData.exchangeAddress} coinSymbol={mockCoinData.symbol} />
          </div>
        </div>
      </div>
    </div>
  )
}
