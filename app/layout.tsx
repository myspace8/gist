import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { AuthProvider } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gist",
  description: "What's on your mind?"
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  return (
    <html lang="en">
      <body className={`${inter.className} bg-customBackground`}>
        <main>
        <AuthProvider>
          {children}
        </AuthProvider>
        </main>
      </body>
    </html>
  )
}