'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ReactNode, useEffect, useState } from 'react'

interface ChakraProviderWrapperProps {
  children: ReactNode
}

export function ChakraProviderWrapper({ children }: ChakraProviderWrapperProps) {
  // This prevents hydration mismatch by only rendering on the client
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    // Return a placeholder with the same structure during SSR
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }
  
  return (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  )
}
