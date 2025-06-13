import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
    }),
})

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

// Mock console.warn for environment validation warnings
const originalConsoleWarn = console.warn
beforeAll(() => {
    console.warn = vi.fn()
})

afterAll(() => {
    console.warn = originalConsoleWarn
})

// Cleanup after each test case
afterEach(() => {
    cleanup()
    vi.clearAllMocks()
}) 