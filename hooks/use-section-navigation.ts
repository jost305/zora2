"use client"

import { useState, useCallback } from "react"

export type SectionType = "home" | "create" | "profile" | "leaderboard" | "coin"

interface SectionState {
  currentSection: SectionType
  coinId?: string
}

export function useSectionNavigation() {
  const [sectionState, setSectionState] = useState<SectionState>({
    currentSection: "home",
  })

  const navigateToSection = useCallback((section: SectionType, coinId?: string) => {
    setSectionState({
      currentSection: section,
      coinId,
    })
  }, [])

  const navigateToHome = useCallback(() => navigateToSection("home"), [navigateToSection])
  const navigateToCreate = useCallback(() => navigateToSection("create"), [navigateToSection])
  const navigateToProfile = useCallback(() => navigateToSection("profile"), [navigateToSection])
  const navigateToLeaderboard = useCallback(() => navigateToSection("leaderboard"), [navigateToSection])
  const navigateToCoin = useCallback((coinId: string) => navigateToSection("coin", coinId), [navigateToSection])

  return {
    currentSection: sectionState.currentSection,
    coinId: sectionState.coinId,
    navigateToSection,
    navigateToHome,
    navigateToCreate,
    navigateToProfile,
    navigateToLeaderboard,
    navigateToCoin,
  }
}
