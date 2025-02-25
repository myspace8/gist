import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function CreatePost() {
  return (
    <Card className="border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
        <Avatar className="h-10 w-10">
          <img alt="Avatar" src="/placeholder.svg?height=40&width=40" className="rounded-full object-cover" />
        </Avatar>
        <Input className="flex-1" placeholder="Tell us what is happening?!" />
        <Button size="sm" className="px-6">
          Post
        </Button>
      </CardHeader>
    </Card>
  )
}

