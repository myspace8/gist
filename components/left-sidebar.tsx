"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"

export function LeftSidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { data: session, status } = useSession()

  const user = session?.user
  

  if (status === "loading") {
    return <div>Loading...</div>
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false }) // Avoid immediate redirect
    window.location.href = "/" // Manually redirect to home or login
  }

  return (
    <div className="sticky top-0 hidden h-screen md:block w-full bg-customBackground">
      <div className="container flex flex-col h-screen py-8 items-start justify-between">
        {/* LOGO */}
        <div className="flex items-center">
          <Image
            src="/simple-icons_packagist.png"
            alt="Logo"
            width={50}
            height={30}
            className="object-contain"
          />
        </div>
        {user ? (
          <div className="flex flex-col gap-20">
              <button
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-customWhite text-primary hover:bg-white/45 shadow h-7 px-4 py-6"
              >
              Post
            </button>          
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
              className="w-full inline-flex flex-col items-start justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-transparent text-primary hover:text-customWhite hover:bg-primary/90 h-7 px-4 py-6"
              >
                <span className="font-medium">
                  {user.name || ""}
                </span>
                <span className="text-sm text-gray-500">{user.email}</span>
            </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled className="flex flex-col items-start">
                <span className="font-semibold">
                  {user.name || ""}
                </span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-customWhite text-primary hover:text-customWhite shadow hover:bg-primary/90 h-7 px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-customWhite text-primary hover:text-customWhite shadow hover:bg-primary/90 h-7 px-4 py-2"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}