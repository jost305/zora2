"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock price data - in real app this would come from events/API
const mockPriceData = [
  { time: "00:00", price: 0.001 },
  { time: "04:00", price: 0.0015 },
  { time: "08:00", price: 0.002 },
  { time: "12:00", price: 0.0035 },
  { time: "16:00", price: 0.0032 },
  { time: "20:00", price: 0.0038 },
  { time: "24:00", price: 0.0042 },
]

interface TradingChartProps {
  currentPrice: string
}

export function TradingChart({ currentPrice }: TradingChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockPriceData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs text-muted-foreground"
            tickFormatter={(value) => `${value} ETH`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelFormatter={(label) => `Time: ${label}`}
            formatter={(value: number) => [`${value} ETH`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
