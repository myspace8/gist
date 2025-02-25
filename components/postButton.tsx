import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface PostButtonProps {
    onClick: () => void
}

export default function PostButton({ onClick }: PostButtonProps) {
    return (
        <Button onClick={onClick} size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg md:hidden">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Create post</span>
        </Button>
    )
}

