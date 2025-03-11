'use client'

import { ReactNode } from 'react'
import {
  Tooltip,
  IconButton,
  Icon,
  Box,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody
} from '@chakra-ui/react'
import { InfoIcon, QuestionIcon } from '@chakra-ui/icons'

interface TooltipHelpProps {
  label: string
  children: ReactNode
  placement?: 'top' | 'right' | 'bottom' | 'left'
  hasArrow?: boolean
}

export function TooltipHelp({
  label,
  children,
  placement = 'top',
  hasArrow = true
}: TooltipHelpProps) {
  return (
    <Tooltip 
      label={label} 
      placement={placement} 
      hasArrow={hasArrow}
      bg="blue.700"
      color="white"
      borderRadius="md"
      px={3}
      py={2}
    >
      {children}
    </Tooltip>
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
    <TooltipHelp label={label}>
      <IconButton
        icon={<InfoIcon />}
        variant="ghost"
        size="sm"
        aria-label={ariaLabel}
        colorScheme="blue"
        ml={1}
      />
    </TooltipHelp>
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
  const { colorMode } = useColorMode()
  
  return (
    <Popover placement="right" closeOnBlur={true}>
      <PopoverTrigger>
        {trigger || (
          <IconButton
            icon={<QuestionIcon />}
            variant="ghost"
            size="sm"
            aria-label="Hilfe"
            colorScheme="blue"
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        boxShadow="lg"
      >
        <PopoverArrow bg={colorMode === 'light' ? 'white' : 'gray.800'} />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold" borderBottomWidth="1px">
          {title}
        </PopoverHeader>
        <PopoverBody>
          {content}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
