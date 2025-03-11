'use client'

import { ReactNode } from 'react'
import { 
  Box, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription, 
  CloseButton,
  useDisclosure,
  useColorMode
} from '@chakra-ui/react'

interface ErrorAlertProps {
  title?: string
  description: string
  status?: 'error' | 'warning' | 'info' | 'success'
  isClosable?: boolean
  onClose?: () => void
}

export function ErrorAlert({
  title = 'Fehler',
  description,
  status = 'error',
  isClosable = true,
  onClose
}: ErrorAlertProps) {
  const { isOpen, onClose: handleClose } = useDisclosure({ defaultIsOpen: true })
  const { colorMode } = useColorMode()
  
  if (!isOpen) return null
  
  const handleCloseClick = () => {
    handleClose()
    if (onClose) onClose()
  }
  
  return (
    <Alert 
      status={status} 
      variant="subtle" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      textAlign="center" 
      borderRadius="md"
      py={4}
      mb={4}
      boxShadow="md"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {title}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {description}
      </AlertDescription>
      {isClosable && (
        <CloseButton 
          position="absolute" 
          right="8px" 
          top="8px" 
          onClick={handleCloseClick}
        />
      )}
    </Alert>
  )
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  // In einer echten Anwendung würde hier ein React Error Boundary implementiert werden
  // Da dies in einer Client-Komponente nicht direkt möglich ist, ist dies ein Platzhalter
  
  return (
    <Box>
      {children}
    </Box>
  )
}
