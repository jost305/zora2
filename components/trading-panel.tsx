"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBondingCurveExchange } from "@/hooks/use-contract"
import { useAccount } from "wagmi"
import type { Address } from "viem"

interface TradingPanelProps {
  exchangeAddress: Address
  coinSymbol: string
}

export function TradingPanel({ exchangeAddress, coinSymbol }: TradingPanelProps) {
  const [ethAmount, setEthAmount] = useState("")
  const [tokenAmount, setTokenAmount] = useState("")
  const { address } = useAccount()

  const { currentPrice, marketCap, totalVolume, creatorFees, buyTokens, sellTokens, isPending, isConfirming } =
    useBondingCurveExchange(exchangeAddress)

  const quickAmounts = ["0.001", "0.01", "0.1", "Max"]

  const handleQuickAmount = (amount: string) => {
    if (amount === "Max") {
      // In real app, get user's ETH balance
      setEthAmount("1.0")
    } else {
      setEthAmount(amount)
    }
  }

  const handleBuy = () => {
    if (ethAmount && Number.parseFloat(ethAmount) > 0) {
      buyTokens(ethAmount)
    }
  }

  const handleSell = () => {
    if (tokenAmount && Number.parseFloat(tokenAmount) > 0) {
      // Convert to wei for contract call
      const tokenWei = BigInt(Math.floor(Number.parseFloat(tokenAmount) * 1e18))
      sellTokens(tokenWei)
    }
  }

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Market Cap</div>
            <div className="text-lg font-semibold text-green-600">
              ${(Number.parseFloat(marketCap) * 2500).toFixed(2)} {/* Mock ETH price */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">24H Volume</div>
            <div className="text-lg font-semibold">${(Number.parseFloat(totalVolume) * 2500).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Creator Earnings</div>
            <div className="text-lg font-semibold">${(Number.parseFloat(creatorFees) * 2500).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Trade {coinSymbol}</span>
            <Badge variant="outline">Balance: 0 ETH</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="text-green-600">
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="text-red-600">
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ETH Amount</label>
                <Input
                  type="number"
                  placeholder="0.000111"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="flex gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(amount)}
                    className="flex-1"
                  >
                    {amount} ETH
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleBuy}
                disabled={!address || !ethAmount || isPending || isConfirming}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isPending || isConfirming ? "Processing..." : "Buy"}
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Token Amount</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <Button
                onClick={handleSell}
                disabled={!address || !tokenAmount || isPending || isConfirming}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                {isPending || isConfirming ? "Processing..." : "Sell"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Current Price Display */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span className="text-lg font-semibold">{Number.parseFloat(currentPrice).toFixed(6)} ETH</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
