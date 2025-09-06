"use client"

import { uploadFileToIPFS, uploadMetadataToIPFS, type IPFSUploadResult, type ContentMetadata } from "@/app/actions/ipfs"

class IPFSService {
  async uploadFile(file: File): Promise<IPFSUploadResult> {
    try {
      const formData = new FormData()
      formData.append("file", file)

      return await uploadFileToIPFS(formData)
    } catch (error) {
      console.error("Error uploading to IPFS:", error)
      throw new Error("Failed to upload file to IPFS")
    }
  }

  async uploadMetadata(metadata: ContentMetadata): Promise<IPFSUploadResult> {
    try {
      return await uploadMetadataToIPFS(metadata)
    } catch (error) {
      console.error("Error uploading metadata to IPFS:", error)
      throw new Error("Failed to upload metadata to IPFS")
    }
  }

  async fetchMetadata(hash: string): Promise<ContentMetadata> {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching metadata from IPFS:", error)
      throw new Error("Failed to fetch metadata from IPFS")
    }
  }

  getIPFSUrl(hash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${hash}`
  }

  // Fallback method using public IPFS gateway (for demo purposes)
  async uploadToPublicIPFS(file: File): Promise<IPFSUploadResult> {
    // This is a mock implementation for demo purposes
    // In production, you should use a proper IPFS service
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: mockHash,
          url: `https://ipfs.io/ipfs/${mockHash}`,
          size: file.size,
        })
      }, 2000) // Simulate upload delay
    })
  }
}

export const ipfsService = new IPFSService()
export type { IPFSUploadResult, ContentMetadata }
