"use client"

import { useState, useEffect } from "react"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { supabase } from '@/supabase/client';
import { useSession } from "next-auth/react"

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

interface PostCardProps {
  post: {
    id: string
    content: string
    user_id: string
    email: string
    created_at: string
    username?: string
    score: number
  }
  isAuthenticated: boolean
}

export function PostCard({ post, isAuthenticated }: PostCardProps) {
  const { data: session } = useSession()
  const [score, setScore] = useState(post.score)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && session?.user?.id) {
      fetchUserVote()
    }
  }, [isAuthenticated, session?.user?.id])

  const fetchUserVote = async () => {
    const { data, error } = await supabase
      .from("votes")
      .select("vote_type")
      .eq("post_id", post.id)
      .eq("user_id", session?.user?.id)
      .single()

    if (!error && data) setUserVote(data.vote_type)
  }

  const handleVote = async (voteType: "up" | "down") => {
    if (!isAuthenticated || !session?.user?.id || loading) return
    setLoading(true)

    try {
      const { data: existingVote, error: fetchError } = await supabase
        .from("votes")
        .select("vote_type")
        .eq("post_id", post.id)
        .eq("user_id", session.user.id)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError

      if (!existingVote) {
        await supabase.from("votes").insert({ post_id: post.id, user_id: session.user.id, vote_type: voteType })
        setScore(score + (voteType === "up" ? 1 : -1))
        setUserVote(voteType)
      } else if (existingVote.vote_type === voteType) {
        await supabase.from("votes").delete().eq("post_id", post.id).eq("user_id", session.user.id)
        setScore(score - (voteType === "up" ? 1 : -1))
        setUserVote(null)
      } else {
        await supabase.from("votes").update({ vote_type: voteType }).eq("post_id", post.id).eq("user_id", session.user.id)
        setScore(score + (voteType === "up" ? 2 : -2))
        setUserVote(voteType)
      }
    } catch (err: any) {
      console.error("Vote error:", err.message)
    } finally {
      setLoading(false)
    }
  }

  const handle = post.username ? `@${post.username}` : `@${post.email.split("@")[0]}`
  const timestamp = formatTimeAgo(post.created_at)

  return (
    <Card className="bg-customBackground border-b-0 border-white border-x-0 rounded-none">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <Avatar className="h-10 w-10">
          <AvatarImage alt={post.username || post.email} src="/placeholder.svg" className="rounded-full object-cover" />
          <AvatarFallback>{(post.username || post.email).charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{post.username || post.email}</span>
            <span className="text-sm text-muted-foreground">{handle}</span>
            <span className="text-sm text-muted-foreground">· {timestamp}</span>
          </div>
          <div className="whitespace-pre-wrap text-sm">{post.content}</div>
        </div>
      </CardHeader>
      <CardFooter className="ml-10 text-muted-foreground flex gap-2 w-min">
        <div
          className={`flex items-center gap-2 rounded-full transition-colors duration-200 ${userVote === "up"
            ? "bg-blue-500"
            : userVote === "down"
              ? "bg-red-500"
              : "bg-white/45"
            }`}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1 hover:bg-transparent ${userVote === "down" ? "text-white" : ""
              } ${userVote === "up" ? "text-white" : ""
              }`}
            onClick={() => handleVote("up")}
            disabled={!isAuthenticated || loading}
          >
            <ArrowBigUp className={`h-4 w-4 ${userVote === "up" ? "fill-current" : ""}`} />
          </Button>
          <span className={`text-sm ${(userVote === "up" || userVote === "down") ? "text-white" : ""}`}>{score}</span>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1 hover:bg-transparent ${userVote === "up" ? "text-white" : ""
              } ${userVote === "down" ? "text-white" : ""
              }`}
            onClick={() => handleVote("down")}
            disabled={!isAuthenticated || loading}
          >
            <ArrowBigDown className={`h-4 w-4 ${userVote === "down" ? "fill-current" : ""}`} />
          </Button>
        </div>

      </CardFooter>
    </Card>
  )
}

function formatTimeAgo(created_at: string) {
  const now = new Date()
  const postDate = new Date(created_at)
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
    { label: "", seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count > 0) return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`
  }
  return "just now"
}