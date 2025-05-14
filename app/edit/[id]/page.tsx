"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MangaForm from "@/components/manga-form"
import type { Manga } from "@/lib/manga-service"

export default function EditMangaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [manga, setManga] = useState<Manga | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchManga() {
      try {
        setLoading(true)
        const response = await fetch(`/api/mangas/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/")
            return
          }
          throw new Error("Falha ao carregar mangá")
        }

        const data = await response.json()
        setManga(data)
      } catch (err) {
        console.error("Erro ao carregar mangá:", err)
        setError("Erro ao carregar dados. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchManga()
  }, [params.id, router])

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Carregando...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-red-500">
        <p>{error}</p>
        <button onClick={() => router.push("/")} className="mt-4 text-blue-500 hover:underline">
          Voltar para a página inicial
        </button>
      </div>
    )
  }

  if (!manga) {
    return <div className="container mx-auto py-8 px-4">Mangá não encontrado</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Editar Mangá/Quadrinho</CardTitle>
        </CardHeader>
        <CardContent>
          <MangaForm manga={manga} />
        </CardContent>
      </Card>
    </div>
  )
}
