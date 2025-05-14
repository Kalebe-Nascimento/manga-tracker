import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import MangaList from "@/components/manga-list"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tracker de Mangás e Quadrinhos</h1>
        <Link href="/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Novo
          </Button>
        </Link>
      </div>
      <MangaList />
    </div>
  )
}
