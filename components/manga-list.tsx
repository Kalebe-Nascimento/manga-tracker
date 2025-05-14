"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, BookOpen, ExternalLink, PlusCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Manga } from "@/lib/manga-service"

export default function MangaList() {
  const [mangas, setMangas] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMangas()
  }, [])

  const fetchMangas = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/mangas")

      if (!response.ok) {
        throw new Error("Falha ao carregar mangás")
      }

      const data = await response.json()
      setMangas(data)
    } catch (err) {
      setError("Erro ao carregar mangás. Tente novamente mais tarde.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/mangas/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir mangá")
      }

      // Atualizar a lista após excluir
      fetchMangas()
    } catch (err) {
      console.error("Erro ao excluir:", err)
    }
  }

  const handleMarkAsRead = async (manga: Manga) => {
    try {
      const updatedManga = {
        ...manga,
        currentChapter: manga.currentChapter + 1,
        lastReadAt: new Date().toISOString(),
      }

      const response = await fetch(`/api/mangas/${manga.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedManga),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar mangá")
      }

      // Atualizar a lista após marcar como lido
      fetchMangas()
    } catch (err) {
      console.error("Erro ao atualizar:", err)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Carregando mangás...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
        <Button onClick={fetchMangas} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (mangas.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">Nenhum mangá ou quadrinho cadastrado</h2>
        <p className="text-muted-foreground mb-6">
          Adicione seu primeiro mangá ou quadrinho para começar a rastrear sua leitura.
        </p>
        <Link href="/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Novo
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mangas.map((manga) => (
        <Card key={manga.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{manga.title}</CardTitle>
                <CardDescription>{manga.series}</CardDescription>
              </div>
              <Badge variant={manga.type === "físico" ? "default" : "secondary"}>{manga.type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <p>
                <span className="font-medium">Capítulo/Volume atual:</span> {manga.currentChapter}
              </p>
              {manga.scanLink && (
                <p className="flex items-center">
                  <span className="font-medium mr-2">Link:</span>
                  <a
                    href={manga.scanLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    Acessar <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </p>
              )}
              {manga.lastReadAt && (
                <p>
                  <span className="font-medium">Última leitura:</span> {new Date(manga.lastReadAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <div className="flex space-x-2">
              <Link href={`/edit/${manga.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente este registro.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(manga.id)}>Excluir</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button onClick={() => handleMarkAsRead(manga)} variant="default" size="sm">
              <BookOpen className="h-4 w-4 mr-1" />
              Ler Próximo
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
