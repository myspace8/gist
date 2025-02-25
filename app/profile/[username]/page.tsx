"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { createClient } from "@supabase/supabase-js"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ProfilePage() {
  const { username } = useParams() ?? {}
  const { data: session } = useSession()
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) return

    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      console.log("Fetching profile for:", username)

      try {
        const { data: userData, error: userError } = await supabase
          .rpc("get_user_by_username", { uname: username })
          .single()

        console.log("User data:", userData, "Error:", userError)

        if (userError) throw new Error(userError.message || "User fetch failed")
        if (!userData) throw new Error("User not found")

        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("*, votes (vote_type)")
          .eq("user_id", userData.id)
          .order("created_at", { ascending: false })

        if (postError) throw new Error(postError.message || "Posts fetch failed")

        const postsWithScores = postData.map(post => ({
          ...post,
          score: post.votes.filter((v: any) => v.vote_type === "up").length -
                 post.votes.filter((v: any) => v.vote_type === "down").length
        }))

        setProfile(userData)
        setPosts(postsWithScores)
      } catch (err: any) {
        setError(err.message)
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (!username) return <div>Invalid profile URL</div>
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!profile) return <div>User not found</div>

  return (
    <div className="container mx-auto py-6">
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{profile.raw_user_meta_data?.username?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile.raw_user_meta_data?.username || "Unknown User"}</h1>
            <p className="text-muted-foreground">@{profile.raw_user_meta_data?.username || "unknown"}</p>
            <p>Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
          </div>
        </div>
      </Card>
      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} isAuthenticated={!!session} />
          ))
        ) : (
          <p className="text-muted-foreground">No posts yet.</p>
        )}
      </div>
    </div>
  )
}