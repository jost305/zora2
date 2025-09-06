"use client"

import { Search, Plus, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const handleWalletAction = () => {
    console.log("[v0] Wallet button clicked")
    console.log("[v0] isConnected:", isConnected)
    console.log("[v0] Available connectors:", connectors)

    if (isConnected) {
      console.log("[v0] Disconnecting wallet")
      disconnect()
    } else {
      const connector = connectors[0]
      console.log("[v0] First connector:", connector)
      if (connector) {
        console.log("[v0] Attempting to connect with connector:", connector.name)
        connect({ connector })
      } else {
        console.log("[v0] No connectors available")
        alert("No wallet connectors available. Please make sure you have MetaMask or another Web3 wallet installed.")
      }
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
            <span className="font-bold text-xl hidden sm:block">Zora Clone</span>
            <span className="font-bold text-lg sm:hidden">Zora</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search creators, content..." className="pl-10" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" asChild>
            <Link href="/create">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Link>
          </Button>
          <Button size="sm" className="sm:hidden" asChild>
            <Link href="/create">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="sm" className="hidden sm:block" onClick={handleWalletAction}>
            {isConnected ? formatAddress(address!) : "Connect Wallet"}
          </Button>
          <Button size="sm" className="sm:hidden" onClick={handleWalletAction}>
            {isConnected ? formatAddress(address!) : "Connect"}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search creators, content..." className="pl-10" />
          </div>
        </div>
      )}
    </header>
  )
}
