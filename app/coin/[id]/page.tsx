import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TradingChart } from "@/components/trading-chart"
import { TradingPanel } from "@/components/trading-panel"
import { Share, MoreHorizontal, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data - in real app this would come from params and API
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

export default function CoinPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Navigation />

        <main className="flex-1 lg:ml-64 p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
              <div className="flex-1 lg:flex-[2] space-y-4 md:space-y-6">
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-square md:aspect-[4/3] relative">
                      <img
                        src={mockCoinData.image || "/placeholder.svg"}
                        alt={mockCoinData.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>

                    <div className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h1 className="text-lg md:text-2xl font-bold mb-2 truncate">{mockCoinData.title}</h1>
                          <div className="flex items-center space-x-2 mb-3">
                            <Avatar className="h-5 w-5 md:h-6 md:w-6">
                              <AvatarImage src={mockCoinData.creatorAvatar || "/placeholder.svg"} />
                              <AvatarFallback>{mockCoinData.creator[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground truncate">{mockCoinData.creator}</span>
                            <span className="text-xs text-muted-foreground">{mockCoinData.timeAgo}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 ml-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                            <Share className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {mockCoinData.holders} holders
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {mockCoinData.symbol}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Price Chart</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <TradingChart currentPrice="0.0042" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 md:p-6">
                    <Tabs defaultValue="comments" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 mb-4">
                        <TabsTrigger value="comments" className="text-xs md:text-sm">
                          Comments
                        </TabsTrigger>
                        <TabsTrigger value="holders" className="text-xs md:text-sm">
                          Holders
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="text-xs md:text-sm">
                          Activity
                        </TabsTrigger>
                        <TabsTrigger value="details" className="text-xs md:text-sm">
                          Details
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="comments" className="space-y-3">
                        <div className="space-y-3">
                          {mockComments.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                              <Avatar className="h-7 w-7 md:h-8 md:w-8">
                                <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{comment.user[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm truncate">{comment.user}</span>
                                  <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                </div>
                                <p className="text-sm break-words">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-3">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-1 px-3 py-2 border rounded-md text-sm min-w-0"
                            />
                            <Button size="sm" className="shrink-0">
                              Post
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="holders">
                        <div className="text-center py-8 text-muted-foreground">Holder information coming soon...</div>
                      </TabsContent>

                      <TabsContent value="activity">
                        <div className="text-center py-8 text-muted-foreground">Trading activity coming soon...</div>
                      </TabsContent>

                      <TabsContent value="details">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contract Address:</span>
                            <span className="font-mono">{mockCoinData.coinAddress.slice(0, 10)}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Exchange Address:</span>
                            <span className="font-mono">{mockCoinData.exchangeAddress.slice(0, 10)}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Symbol:</span>
                            <span>{mockCoinData.symbol}</span>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full lg:w-80 lg:shrink-0">
                <div className="sticky top-4">
                  <TradingPanel exchangeAddress={mockCoinData.exchangeAddress} coinSymbol={mockCoinData.symbol} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
