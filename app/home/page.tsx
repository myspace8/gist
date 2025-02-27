"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { supabase } from '@/supabase/client';
import { MobileFab } from "@/components/mobile-fab"
import { PostCard } from "@/components/post-card"
import { RightSidebar } from "@/components/right-sidebar"
import { SiteHeader } from "@/components/site-header"
import { LeftSidebar } from "@/components/left-sidebar"
import PostModal from "@/components/post-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PostButton from "@/components/postButton"

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

export default function HomePage() {
  const { data: session, status } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts()
      const subscription = supabase
        .channel("votes")
        .on("postgres_changes", { event: "*", schema: "public", table: "votes" }, fetchPosts)
        .subscribe()
      return () => subscription.unsubscribe()
    }
  }, [status])

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id, content, user_id, email, created_at, username,
          votes (vote_type)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      const postsWithScores = data.map((post) => {
        const upvotes = post.votes.filter((v: any) => v.vote_type === "up").length
        const downvotes = post.votes.filter((v: any) => v.vote_type === "down").length
        return { ...post, score: upvotes - downvotes }
      })

      setPosts(postsWithScores)
    } catch (err: any) {
      setError(err.message || "Failed to fetch posts")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") return <div>Loading...</div>

  if (!session) {
    return (
      <div className="min-h-screen bg-customBackground">
        <SiteHeader user={null} />
        <div className="container flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Welcome</h1>
          <p className="text-gray-600">
            Please <a href="/login" className="text-blue-500 hover:underline">log in</a> or{" "}
            <a href="/sign-up" className="text-blue-500 hover:underline">sign up</a> to view the home page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-customBackground">
      <SiteHeader user={session.user} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[1fr_400px] lg:grid-cols-[240px_1fr_340px] lg:gap-6 px-0 lg:px-24">
        <LeftSidebar />
        <main className="relative">
          <div className="hidden md:flex items-start gap-3 py-4 pl-6 pr-4 border-x border-white">
            <Avatar className="h-10 w-10">
              <AvatarImage
                alt={session.user.name || "user"}
                src={session.user.image || "/placeholder.svg"}
                className="rounded-full object-cover"
              />
              <AvatarFallback>{session.user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <textarea
              placeholder="What's on your mind?!"
              className="min-h-25 bg-transparent p-2 w-full focus:border-none focus:ring-0 active:border-none"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className="border-x border-white">
            {loading ? (
              <div className="p-4 text-center">Loading posts...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : posts.length === 0 ? (
              <div className="p-4 text-center">No posts yet. Be the first to post!</div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} isAuthenticated={true} />
              ))
            )}
          </div>
        </main>
        <RightSidebar />
      </div>
      <PostButton onClick={() => setIsModalOpen(true)} />
      <PostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}