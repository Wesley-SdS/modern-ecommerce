import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
        <span className="text-lg font-bold text-background">E</span>
      </div>
      <span className="text-xl font-semibold">ELEGANCE</span>
    </Link>
  )
}
