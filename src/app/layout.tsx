import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ChakraProviderWrapper } from '@/components/providers/chakra-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'World KPI Dashboard',
  description: 'Interaktives Dashboard für weltweite Batterie-KPIs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <ChakraProviderWrapper>
          {children}
        </ChakraProviderWrapper>
      </body>
    </html>
  )
}
