import { MobileFab } from "@/components/mobile-fab";
import { PostCard } from "@/components/post-card";
import { RightSidebar } from "@/components/right-sidebar";
import { SiteHeader } from "@/components/site-header";
import { LeftSidebar } from "@/components/left-sidebar";
import { posts } from "@/data/posts";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Adjust formatting if needed
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-customBackground">
      <SiteHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[1fr_400px] lg:grid-cols-[240px_1fr_300px] lg:gap-6 px-0 lg:px-24">
        <LeftSidebar />
        <main className="relative">
          <div className="border-x border-white">
            {posts.map((post) => (
              <Card key={post.id} className="bg-customBackground border-b border-white border-x-0 rounded-none">
                <CardHeader className="flex-row items-start gap-4 space-y-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      alt={post.username || post.email}
                      src="/placeholder.svg" // Update if avatar URLs are added
                      className="rounded-full object-cover"
                    />
                    <AvatarFallback>
                      {(post.username || post.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.username || post.email}</span>
                      <span className="text-sm text-muted-foreground">· {formatTimestamp(post.created_at)}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm">{post.content}</div>
                  </div>
                </CardHeader>
                <CardFooter className="ml-10 text-muted-foreground">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-transparent">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes > 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
        <RightSidebar />
      </div>
      <MobileFab />
    </div>
  );
}
