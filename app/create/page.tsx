"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadProgressComponent } from "@/components/upload-progress"
import { Upload, ImageIcon, Video, Music, FileText, Loader2, ExternalLink } from "lucide-react"
import { useAccount } from "wagmi"
import { useIPFSUpload } from "@/hooks/use-ipfs-upload"
import { useContractDeployment } from "@/hooks/use-contract-deployment"

export default function CreatePage() {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, file }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !formData.file) return

    try {
      const { fileResult, metadataResult } = await uploadContent(formData.file, {
        name: formData.title,
        description: formData.description,
        category: formData.category as "image" | "video" | "music" | "text",
        creator: address!,
        createdAt: new Date().toISOString(),
        attributes: [
          {
            trait_type: "Category",
            value: formData.category,
          },
          {
            trait_type: "Symbol",
            value: formData.symbol,
          },
        ],
      })

      setUploadResults({
        fileHash: fileResult.hash,
        metadataHash: metadataResult.hash,
        fileUrl: fileResult.url,
        metadataUrl: metadataResult.url,
      })

      console.log("[v0] Content uploaded to IPFS:", {
        fileHash: fileResult.hash,
        metadataHash: metadataResult.hash,
      })

      console.log("[v0] Starting contract deployment...")
      await deployContentCoin(formData.title, formData.symbol, metadataResult.url)

      console.log("[v0] Contract deployment initiated")
    } catch (error) {
      console.error("[v0] Error creating content coin:", error)
      alert("Error creating content coin: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      symbol: "",
      file: null,
    })
    setPreview(null)
    setUploadResults(null)
    reset()
    resetDeployment()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "music":
        return <Music className="h-4 w-4" />
      case "text":
        return <FileText className="h-4 w-4" />
      default:
        return <Upload className="h-4 w-4" />
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Navigation />
          <main className="flex-1 ml-64 p-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-12 text-center">
                  <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                  <p className="text-muted-foreground mb-6">
                    Connect your wallet to create and mint new content coins.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Navigation />

        <main className="flex-1 ml-64 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create Content Coin</CardTitle>
                <p className="text-muted-foreground">
                  Upload your content to IPFS and create a tradeable token with automatic bonding curve pricing.
                </p>
              </CardHeader>

              <CardContent>
                {(isUploading || isComplete || isError || isDeploying) && (
                  <div className="mb-6">
                    <UploadProgressComponent progress={progress} />
                  </div>
                )}

                {isDeploymentSuccess && coinAddress && exchangeAddress && (
                  <Card className="mb-6 bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-green-800 mb-2">Content Coin Deployed Successfully!</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Transaction Hash:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-green-100 px-2 py-1 rounded">{txHash?.slice(0, 20)}...</code>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                              <a
                                href={`https://sepolia.basescan.org/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Content Coin:</span>
                          <code className="text-xs bg-green-100 px-2 py-1 rounded">{coinAddress?.slice(0, 20)}...</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Exchange:</span>
                          <code className="text-xs bg-green-100 px-2 py-1 rounded">
                            {exchangeAddress?.slice(0, 20)}...
                          </code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {deploymentError && (
                  <Card className="mb-6 bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-red-800 mb-2">Deployment Failed</h3>
                      <p className="text-sm text-red-700">{deploymentError}</p>
                    </CardContent>
                  </Card>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="file">Content File</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      {preview ? (
                        <div className="space-y-4">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt="Preview"
                            className="max-w-full max-h-48 mx-auto rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setPreview(null)
                              setFormData((prev) => ({ ...prev, file: null }))
                            }}
                            disabled={isUploading || isDeploying}
                          >
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF, MP4, MP3 up to 10MB</p>
                            <p className="text-xs text-blue-600 mt-1">
                              Files will be stored on IPFS for decentralization
                            </p>
                          </div>
                          <Input
                            id="file"
                            type="file"
                            accept="image/*,video/*,audio/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading || isDeploying}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("file")?.click()}
                            disabled={isUploading || isDeploying}
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter content title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                      disabled={isUploading || isDeploying}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your content..."
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      disabled={isUploading || isDeploying}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      disabled={isUploading || isDeploying}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">
                          <div className="flex items-center">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Image
                          </div>
                        </SelectItem>
                        <SelectItem value="video">
                          <div className="flex items-center">
                            <Video className="h-4 w-4 mr-2" />
                            Video
                          </div>
                        </SelectItem>
                        <SelectItem value="music">
                          <div className="flex items-center">
                            <Music className="h-4 w-4 mr-2" />
                            Music
                          </div>
                        </SelectItem>
                        <SelectItem value="text">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Text
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Symbol */}
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Token Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="e.g., MYART"
                      value={formData.symbol}
                      onChange={(e) => setFormData((prev) => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                      maxLength={10}
                      required
                      disabled={isUploading || isDeploying}
                    />
                    <p className="text-xs text-muted-foreground">
                      A short identifier for your content coin (max 10 characters)
                    </p>
                  </div>

                  {/* Deployment Fee Info */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Deployment Fee:</span>
                        <span className="font-medium">0.001 ETH</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        This fee covers gas costs for deploying your content coin and bonding curve contracts. Content
                        is stored permanently on IPFS.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Submit Buttons */}
                  <div className="flex gap-3">
                    {isDeploymentSuccess ? (
                      <Button type="button" variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
                        Create Another
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={
                          isUploading ||
                          isDeploying ||
                          !formData.title ||
                          !formData.category ||
                          !formData.symbol ||
                          !formData.file
                        }
                      >
                        {isUploading || isDeploying ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isUploading ? "Uploading to IPFS..." : "Deploying Contract..."}
                          </>
                        ) : (
                          <>
                            {getCategoryIcon(formData.category)}
                            <span className="ml-2">Create Content Coin</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About IPFS Storage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Your content is stored on IPFS (InterPlanetary File System), a decentralized storage network that
                  ensures your files are:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Permanently accessible and censorship-resistant</li>
                  <li>Distributed across multiple nodes worldwide</li>
                  <li>Identified by unique cryptographic hashes</li>
                  <li>Immutable once uploaded</li>
                </ul>
                <p className="text-xs">
                  Note: For demo purposes, some uploads may use fallback mock IPFS hashes if Pinata service is
                  unavailable.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
