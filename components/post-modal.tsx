"use client"

import { useState, useEffect, useRef } from "react"
import { X, Image, Smile, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { createClient } from "@supabase/supabase-js"

interface PostModalProps {
  isOpen: boolean
  onClose: () => void
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PostModal({ isOpen, onClose }: PostModalProps) {
  const [post, setPost] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handlePostSubmit = async () => {
    if (!session || !post || post.length > 280) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("posts").insert({
        content: post,
        user_id: session.user.id,
        email: session.user.email,
        username: session.user.name, // Add username from session
        created_at: new Date().toISOString(),
      })

      if (error) throw error

      setPost("") // Clear the textarea
      onClose() // Close the modal
    } catch (err: any) {
      setError(err.message || "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const remainingChars = 280 - post.length
  const isOverLimit = remainingChars < 0
  const isAuthenticated = !!session && status === "authenticated"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
          <Button
            disabled={!isAuthenticated || post.length === 0 || isOverLimit || loading}
            onClick={handlePostSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full px-4 py-2 text-sm"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
        <div className="p-4">
          <div className="flex">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={session?.user?.user_metadata?.avatar_url || "/placeholder-avatar.jpg"} />
              <AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <Textarea
              value={post}
              onChange={(e) => setPost(e.target.value)}
              placeholder={isAuthenticated ? "What's on your mind?!" : "Please log in to post"}
              className="flex-grow resize-none border-none focus:ring-0 text-lg"
              rows={4}
              disabled={!isAuthenticated}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" disabled={!isAuthenticated}>
                <Image className="h-5 w-5 text-blue-500" />
              </Button>
              <Button variant="ghost" size="icon" disabled={!isAuthenticated}>
                <Smile className="h-5 w-5 text-blue-500" />
              </Button>
              <Button variant="ghost" size="icon" disabled={!isAuthenticated}>
                <Calendar className="h-5 w-5 text-blue-500" />
              </Button>
              <Button variant="ghost" size="icon" disabled={!isAuthenticated}>
                <MapPin className="h-5 w-5 text-blue-500" />
              </Button>
            </div>
            <div className={`text-sm ${isOverLimit ? "text-red-500" : "text-gray-500"}`}>
              {remainingChars}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}