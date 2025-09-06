export function generateDiceBearAvatar(seed: string, style = "avataaars"): string {
  // Use DiceBear API to generate consistent avatars based on seed
  const baseUrl = "https://api.dicebear.com/7.x"
  const encodedSeed = encodeURIComponent(seed)

  // Available styles: avataaars, big-ears, big-ears-neutral, big-smile, bottts, croodles, fun-emoji, icons, identicon, initials, lorelei, micah, miniavs, open-peeps, personas, pixel-art, shapes, thumbs
  return `${baseUrl}/${style}/svg?seed=${encodedSeed}&backgroundColor=transparent&size=128`
}

export function getAvatarFromAddress(address: string): string {
  // Use wallet address as seed for consistent avatar generation
  return generateDiceBearAvatar(address, "avataaars")
}

export function getAvatarFromUsername(username: string): string {
  // Use username as seed for consistent avatar generation
  return generateDiceBearAvatar(username, "avataaars")
}
