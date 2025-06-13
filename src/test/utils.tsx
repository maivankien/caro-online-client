import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@/contexts/ToastContext'

interface ICustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    initialEntries?: string[]
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <BrowserRouter>
            <ToastProvider>
                {children}
            </ToastProvider>
        </BrowserRouter>
    )
}

const customRender = (
    ui: ReactElement,
    options?: ICustomRenderOptions
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from React Testing Library
export * from '@testing-library/react'
// Override the render export with our custom one
export { customRender as render } 