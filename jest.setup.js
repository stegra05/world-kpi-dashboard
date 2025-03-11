import '@testing-library/jest-dom'

// Mock für Next.js Router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/'
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))

// Mock für Leaflet, da es DOM-Manipulation verwendet
jest.mock('leaflet', () => ({
  map: jest.fn().mockReturnValue({
    setView: jest.fn().mockReturnThis(),
    remove: jest.fn(),
    fitBounds: jest.fn()
  }),
  tileLayer: jest.fn().mockReturnValue({
    addTo: jest.fn().mockReturnThis()
  }),
  geoJSON: jest.fn().mockReturnValue({
    addTo: jest.fn().mockReturnThis(),
    getBounds: jest.fn().mockReturnValue({}),
    resetStyle: jest.fn()
  }),
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: jest.fn()
    }
  }
}))

// Globale Mocks für window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Globale Mocks für window.ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Globale Mocks für fetch
global.fetch = jest.fn()
