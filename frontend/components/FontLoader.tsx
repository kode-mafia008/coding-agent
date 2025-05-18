import { JetBrains_Mono } from 'next/font/google';

// Load JetBrains Mono with all subsets and weights needed
export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700'],
});

// No need for a FontLoader component since Next.js handles font loading for us
// We'll use the font directly in the layout instead
