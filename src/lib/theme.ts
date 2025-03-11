'use client'

import { extendTheme, ThemeConfig } from '@chakra-ui/react'

// Konfiguration für den Farbmodus
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// Farbpalette
const colors = {
  brand: {
    50: '#e6f6ff',
    100: '#bae3ff',
    200: '#7cc4fa',
    300: '#47a3f3',
    400: '#2186eb',
    500: '#0967d2',
    600: '#0552b5',
    700: '#03449e',
    800: '#01337d',
    900: '#002159',
  },
  // Farben für Kontinente
  continents: {
    europe: '#3b82f6',
    asia: '#ef4444',
    africa: '#f59e0b',
    northAmerica: '#10b981',
    southAmerica: '#6366f1',
    oceania: '#8b5cf6',
    antarctica: '#94a3b8',
  },
  // Farben für Klimazonen
  climate: {
    normal: '#10b981',
    coldland: '#3b82f6',
    hotland: '#ef4444',
  },
}

// Komponenten-Stile
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'md',
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.600',
        },
      }),
      outline: (props: any) => ({
        border: '1px solid',
        borderColor: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
        color: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
      }),
    },
  },
  Card: {
    baseStyle: (props: any) => ({
      container: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        borderRadius: 'lg',
        boxShadow: props.colorMode === 'dark' ? 'lg' : 'md',
        overflow: 'hidden',
      },
    }),
  },
}

// Typografie
const fonts = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
}

// Breakpoints für responsives Design
const breakpoints = {
  sm: '30em',    // 480px
  md: '48em',    // 768px
  lg: '62em',    // 992px
  xl: '80em',    // 1280px
  '2xl': '96em', // 1536px
}

// Theme erstellen
const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  breakpoints,
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
})

export default theme
