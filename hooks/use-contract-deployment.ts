"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"

const FACTORY_ABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "contentURI", type: "string" },
    ],
    name: "deployContentCoin",
    outputs: [
      { name: "coin", type: "address" },
      { name: "exchange", type: "address" },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "deploymentFee",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export function useContractDeployment() {
  const { address } = useAccount()
  const [deploymentState, setDeploymentState] = useState<{
    isDeploying: boolean
    txHash?: string
    coinAddress?: string
    exchangeAddress?: string
    error?: string
  }>({
    isDeploying: false,
  })

  const { writeContract, data: hash, error: writeError } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const deployContentCoin = async (name: string, symbol: string, metadataURI: string) => {
    if (!address) {
      throw new Error("Wallet not connected")
    }

    const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS
    if (!factoryAddress) {
      throw new Error("Factory contract address not configured")
    }

    try {
      setDeploymentState({ isDeploying: true })

      console.log("[v0] Deploying content coin:", { name, symbol, metadataURI })

      // Deploy with 0.001 ETH fee
      writeContract({
        address: factoryAddress as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: "deployContentCoin",
        args: [name, symbol, metadataURI],
        value: parseEther("0.001"),
      })

      if (hash) {
        setDeploymentState((prev) => ({ ...prev, txHash: hash }))
      }
    } catch (error) {
      console.error("[v0] Deployment error:", error)
      setDeploymentState({
        isDeploying: false,
        error: error instanceof Error ? error.message : "Deployment failed",
      })
      throw error
    }
  }

  // Update state when transaction is confirmed
  if (isSuccess && hash && deploymentState.isDeploying) {
    setDeploymentState((prev) => ({
      ...prev,
      isDeploying: false,
      coinAddress: "0x" + Math.random().toString(16).slice(2, 42), // Mock for now
      exchangeAddress: "0x" + Math.random().toString(16).slice(2, 42), // Mock for now
    }))
  }

  if (writeError && deploymentState.isDeploying) {
    setDeploymentState({
      isDeploying: false,
      error: writeError.message,
    })
  }

  return {
    deployContentCoin,
    isDeploying: deploymentState.isDeploying || isConfirming,
    isSuccess,
    txHash: hash,
    coinAddress: deploymentState.coinAddress,
    exchangeAddress: deploymentState.exchangeAddress,
    error: deploymentState.error || writeError?.message,
    reset: () => setDeploymentState({ isDeploying: false }),
  }
}
