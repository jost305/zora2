"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"

export interface CreatorStats {
  totalEarnings: string
  totalVolume: string
  totalCoins: number
  totalHolders: number
  pendingWithdrawals: string
}

export interface CreatorCoin {
  id: string
  title: string
  symbol: string
  image: string
  coinAddress: string
  exchangeAddress: string
  marketCap: string
  price: string
  volume24h: string
  holders: number
  earnings: string
  createdAt: string
  category: "image" | "video" | "music" | "text"
}

// Mock data for creator dashboard
const mockCreatorCoins: CreatorCoin[] = [
  {
    id: "1",
    title: "Not me smiling lol",
    symbol: "SMILE",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot-20250805143949-c1IBy5EC605ZLLazq0z6bIciDDQvob.png",
    coinAddress: "0x1111...1111",
    exchangeAddress: "0x2222...2222",
    marketCap: "757.53",
    price: "3.54",
    volume24h: "2.30",
    holders: 3,
    earnings: "0.115", // 0.05% of volume
    createdAt: "2024-01-15",
    category: "image",
  },
  {
    id: "2",
    title: "Sunset Vibes",
    symbol: "SUNSET",
    image: "/vibrant-coastal-sunset.png",
    coinAddress: "0x3333...3333",
    exchangeAddress: "0x4444...4444",
    marketCap: "432.18",
    price: "2.15",
    volume24h: "1.85",
    holders: 7,
    earnings: "0.0925",
    createdAt: "2024-01-10",
    category: "image",
  },
]

export function useCreatorStats() {
  const { address } = useAccount()
  const [stats, setStats] = useState<CreatorStats>({
    totalEarnings: "0",
    totalVolume: "0",
    totalCoins: 0,
    totalHolders: 0,
    pendingWithdrawals: "0",
  })
  const [coins, setCoins] = useState<CreatorCoin[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (address) {
      // In real app, fetch creator's coins and stats from blockchain/API
      const totalEarnings = mockCreatorCoins.reduce((sum, coin) => sum + Number.parseFloat(coin.earnings), 0)
      const totalVolume = mockCreatorCoins.reduce((sum, coin) => sum + Number.parseFloat(coin.volume24h), 0)
      const totalHolders = mockCreatorCoins.reduce((sum, coin) => sum + coin.holders, 0)

      setStats({
        totalEarnings: totalEarnings.toFixed(4),
        totalVolume: totalVolume.toFixed(2),
        totalCoins: mockCreatorCoins.length,
        totalHolders,
        pendingWithdrawals: totalEarnings.toFixed(4),
      })
      setCoins(mockCreatorCoins)
    }
  }, [address])

  const withdrawEarnings = async (coinId: string) => {
    setLoading(true)
    // In real app, call smart contract withdraw function
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update local state
    setCoins((prev) => prev.map((coin) => (coin.id === coinId ? { ...coin, earnings: "0" } : coin)))

    setLoading(false)
  }

  const withdrawAllEarnings = async () => {
    setLoading(true)
    // In real app, call smart contract withdraw function for all coins
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update local state
    setCoins((prev) => prev.map((coin) => ({ ...coin, earnings: "0" })))
    setStats((prev) => ({ ...prev, pendingWithdrawals: "0" }))

    setLoading(false)
  }

  return {
    stats,
    coins,
    loading,
    withdrawEarnings,
    withdrawAllEarnings,
  }
}
