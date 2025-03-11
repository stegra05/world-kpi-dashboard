'use client'

import { ReactNode } from 'react'
import { Box, Text, Button } from '@chakra-ui/react'

interface TooltipHelpProps {
  label: string
  children: ReactNode
}

// Simplified placeholder component until dependencies are resolved
export function TooltipHelp({ label, children }: TooltipHelpProps) {
  return (
    <Box position="relative" display="inline-block">
      {children}
    </Box>
  )
}

interface InfoIconButtonProps {
  label: string
  'aria-label'?: string
}

export function InfoIconButton({
  label,
  'aria-label': ariaLabel = 'Mehr Informationen'
}: InfoIconButtonProps) {
  return (
    <Button
      size="sm"
      ml={1}
      title={label}
      aria-label={ariaLabel}
    >
      ℹ️
    </Button>
  )
}

interface HelpPopoverProps {
  title: string
  content: ReactNode
  trigger?: ReactNode
}

export function HelpPopover({
  title,
  content,
  trigger
}: HelpPopoverProps) {
  return (
    <Box>
      {trigger || (
        <Button
          size="sm"
          title={title}
          aria-label="Hilfe"
        >
          ❓
        </Button>
      )}
    </Box>
  )
}
