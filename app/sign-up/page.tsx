"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase-client"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("") // New state for username
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username, // Store username in user_metadata
          },
        },
      })

      if (error) throw error

      if (data.session) {
        // Sign in with NextAuth using the credentials
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (signInResult?.error) {
          throw new Error(signInResult.error)
        }

        router.push("/home")
      } else if (data.user) {
        setError("Please check your email to confirm your account")
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[#E8E8E8] p-6">
      <div className="w-full max-w-[320px]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/simple-icons_packagist.png"
            alt="Logo"
            width={64}
            height={64}
            className="h-16 w-16"
          />
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || !username}>
            {loading ? "Signing up..." : "Sign up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          By signing up, you agree to the{" "}
          <Link href="#" className="text-[#1D9BF0] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-[#1D9BF0] hover:underline">
            Privacy Policy
          </Link>
          , including{" "}
          <Link href="#" className="text-[#1D9BF0] hover:underline">
            Cookie Use
          </Link>
          .
        </p>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link
            href="/login"
            className="mt-2 inline-block w-full rounded-full border border-gray-300 px-4 py-3 text-center text-[#1D9BF0] hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>
      </div>
      <div className="mt-8 text-xs text-gray-500">© All rights reserved 2025</div>
    </div>
  )
}