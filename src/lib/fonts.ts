import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'

// Clash Display — Headlines
// Using next/font/google alternative: Outfit (geometric, bold, similar weight to Clash Display)
// We'll use @fontsource or local fonts for the actual Clash Display
import { Outfit, DM_Sans } from 'next/font/google'

export const displayFont = Outfit({
  subsets: ['latin'],
  variable: '--font-clash-display',
  weight: ['700', '800', '900'],
  display: 'swap',
})

// Satoshi alternative: DM Sans (clean, geometric, modern)
export const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-satoshi',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

// JetBrains Mono — Specs
export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
})
