"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useAccount } from "wagmi"
import { useIPFSUpload } from "@/hooks/use-ipfs-upload"
import { useContractDeployment } from "@/hooks/use-contract-deployment"

export function CreateSection() {
  const { address, isConnected } = useAccount()
  const { progress, uploadContent, reset, isUploading, isComplete, isError } = useIPFSUpload()
  const {
    deployContentCoin,
    isDeploying,
    isSuccess: isDeploymentSuccess,
    txHash,
    coinAddress,
    exchangeAddress,
    error: deploymentError,
    reset: resetDeployment,
  } = useContractDeployment()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    symbol: "",
    file: null as File | null,
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadResults, setUploadResults] = useState<{
    fileHash: string
    metadataHash: string
    fileUrl: string
    metadataUrl: string
  } | null>(null)

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">Connect your wallet to create and mint new content coins.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <div className="max-w-2xl mx-auto space-y-6"></div>
}
