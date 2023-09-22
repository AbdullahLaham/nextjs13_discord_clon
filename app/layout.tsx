import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Clerk } from '@clerk/nextjs/server'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import ProviderModal from '@/components/modals/ProviderModal'
import { SocketProvider } from '@/components/providers/socket-provider'
const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Team Chat Application',
  description: 'Abdullah AL-Lahham',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white", "dark:bg-[#313338]")}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} storageKey='discord-clone' >
            <SocketProvider>
              <ProviderModal />
              {children}
              
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
