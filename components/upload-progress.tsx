"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Upload, FileText } from "lucide-react"
import type { UploadProgress } from "@/hooks/use-ipfs-upload"

interface UploadProgressProps {
  progress: UploadProgress
}

export function UploadProgressComponent({ progress }: UploadProgressProps) {
  const getIcon = () => {
    switch (progress.stage) {
      case "uploading-file":
        return <Upload className="h-5 w-5 text-blue-500 animate-pulse" />
      case "uploading-metadata":
        return <FileText className="h-5 w-5 text-blue-500 animate-pulse" />
      case "complete":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getProgressColor = () => {
    switch (progress.stage) {
      case "complete":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  if (progress.stage === "idle") {
    return null
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {getIcon()}
          <span className="text-sm font-medium">{progress.message}</span>
        </div>
        <Progress value={progress.progress} className="h-2" />
        <div className="text-xs text-muted-foreground mt-2">{progress.progress}% complete</div>
      </CardContent>
    </Card>
  )
}
