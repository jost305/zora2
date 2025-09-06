"use server"

export interface IPFSUploadResult {
  hash: string
  url: string
  size: number
}

export interface ContentMetadata {
  name: string
  description: string
  image: string
  category: "image" | "video" | "music" | "text"
  creator: string
  createdAt: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

export async function uploadFileToIPFS(formData: FormData): Promise<IPFSUploadResult> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file provided")
    }

    const pinataFormData = new FormData()
    pinataFormData.append("file", file)

    const pinataMetadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
      },
    })
    pinataFormData.append("pinataMetadata", pinataMetadata)

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    pinataFormData.append("pinataOptions", pinataOptions)

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: pinataFormData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    return {
      hash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      size: result.PinSize,
    }
  } catch (error) {
    console.error("Error uploading to IPFS:", error)
    throw new Error("Failed to upload file to IPFS")
  }
}

export async function uploadMetadataToIPFS(metadata: ContentMetadata): Promise<IPFSUploadResult> {
  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${metadata.name}_metadata`,
          keyvalues: {
            type: "metadata",
            creator: metadata.creator,
            category: metadata.category,
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    return {
      hash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      size: result.PinSize,
    }
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error)
    throw new Error("Failed to upload metadata to IPFS")
  }
}
