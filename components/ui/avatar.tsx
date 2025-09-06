"use client"

import type * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { generateDiceBearAvatar } from "@/lib/dicebear"

import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full", className)} {...props} />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
      {...props}
    />
  )
}

interface DiceBearAvatarProps {
  seed: string
  style?: string
  className?: string
  fallbackText?: string
}

function DiceBearAvatar({ seed, style = "avataaars", className, fallbackText }: DiceBearAvatarProps) {
  const avatarUrl = generateDiceBearAvatar(seed, style)

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={`Avatar for ${seed}`} />
      <AvatarFallback>{fallbackText || seed.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback, DiceBearAvatar }
