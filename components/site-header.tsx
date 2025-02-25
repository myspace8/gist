"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
// Optional: Add a dropdown component from your UI library, or use plain CSS
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SiteHeaderProps {
  user?: any // You can refine this type with NextAuth's Session.user
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: false }) // Avoid immediate redirect
    window.location.href = "/" // Manually redirect to home or login
  }
console.log(user)
  return (
    <div className="md:hidden w-full bg-customBackground">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/simple-icons_packagist.png"
            alt="Logo"
            width={45}
            height={25}
            className="object-contain"
          />
        </div>
        {user ? (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex flex-col items-start p-0 border-b border-white/45">
                <Link href={ `/profile/${user.name}`} className="flex items-center w-full justify-between gap-2 hover:bg-white/45 p-2">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-semibold">{user.name || "Unknown User"}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                  </div>
                  <ArrowRight />
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
                <Link href="/help" className="w-full justify-start hover:bg-white/45">
                  Help center
                </Link>
              </DropdownMenuItem> */}
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