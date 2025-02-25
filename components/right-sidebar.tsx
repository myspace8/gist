export function RightSidebar() {
  return (
    <div className="sticky top-0 hidden h-screen bg-customBackground md:block">
      <div className="flex h-28 items-center px-4">
        {/* Add any header content for right sidebar if needed */}
      </div>
      <div className="p-4">
        <div className="flex justify-center items-center h-56 rounded-lg border border-white p-4 text-card-foreground shadow-sm">
          <span className="text-muted-foreground text-sm">null</span>
        </div>
      </div>
    </div>
  )
}

