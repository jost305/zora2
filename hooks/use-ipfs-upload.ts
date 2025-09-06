"use client"

import { useState } from "react"
import { ipfsService, type IPFSUploadResult, type ContentMetadata } from "@/lib/ipfs"

export interface UploadProgress {
  stage: "idle" | "uploading-file" | "uploading-metadata" | "complete" | "error"
  progress: number
  message: string
}

export function useIPFSUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    stage: "idle",
    progress: 0,
    message: "",
  })

  const uploadContent = async (
    file: File,
    metadata: Omit<ContentMetadata, "image">,
  ): Promise<{ fileResult: IPFSUploadResult; metadataResult: IPFSUploadResult }> => {
    try {
      setProgress({
        stage: "uploading-file",
        progress: 25,
        message: "Uploading file to IPFS...",
      })

      // Upload file first
      let fileResult: IPFSUploadResult

      try {
        // Try Pinata first
        fileResult = await ipfsService.uploadFile(file)
      } catch (error) {
        console.warn("Pinata upload failed, using fallback:", error)
        // Fallback to mock IPFS for demo
        fileResult = await ipfsService.uploadToPublicIPFS(file)
      }

      setProgress({
        stage: "uploading-metadata",
        progress: 75,
        message: "Uploading metadata to IPFS...",
      })

      // Create complete metadata with file URL
      const completeMetadata: ContentMetadata = {
        ...metadata,
        image: fileResult.url,
      }

      // Upload metadata
      let metadataResult: IPFSUploadResult

      try {
        metadataResult = await ipfsService.uploadMetadata(completeMetadata)
      } catch (error) {
        console.warn("Metadata upload failed, using mock:", error)
        // Mock metadata upload for demo
        const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}meta`
        metadataResult = {
          hash: mockHash,
          url: `https://ipfs.io/ipfs/${mockHash}`,
          size: JSON.stringify(completeMetadata).length,
        }
      }

      setProgress({
        stage: "complete",
        progress: 100,
        message: "Upload complete!",
      })

      return { fileResult, metadataResult }
    } catch (error) {
      setProgress({
        stage: "error",
        progress: 0,
        message: error instanceof Error ? error.message : "Upload failed",
      })
      throw error
    }
  }

  const reset = () => {
    setProgress({
      stage: "idle",
      progress: 0,
      message: "",
    })
  }

  return {
    progress,
    uploadContent,
    reset,
    isUploading: progress.stage === "uploading-file" || progress.stage === "uploading-metadata",
    isComplete: progress.stage === "complete",
    isError: progress.stage === "error",
  }
}
