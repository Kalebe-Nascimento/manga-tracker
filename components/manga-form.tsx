"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Manga } from "@/lib/manga-service"

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  series: z.string().min(1, "A série é obrigatória"),
  currentChapter: z.coerce.number().min(0, "O capítulo deve ser um número positivo"),
  type: z.enum(["físico", "digital"]),
  scanLink: z.string().url("Insira uma URL válida").optional().or(z.literal("")),
})

interface MangaFormProps {
  manga?: Manga
}

export default function MangaForm({ manga }: MangaFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: manga
      ? {
          title: manga.title,
          series: manga.series,
          currentChapter: manga.currentChapter,
          type: manga.type,
          scanLink: manga.scanLink || "",
        }
      : {
          title: "",
          series: "",
          currentChapter: 0,
          type: "digital",
          scanLink: "",
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      if (manga) {
        // Editar mangá existente
        const response = await fetch(`/api/mangas/${manga.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...manga,
            ...values,
            scanLink: values.scanLink || null,
          }),
        })

        if (!response.ok) {
          throw new Error("Falha ao atualizar mangá")
        }
      } else {
        // Adicionar novo mangá
        const response = await fetch("/api/mangas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            scanLink: values.scanLink || null,
          }),
        })

        if (!response.ok) {
          throw new Error("Falha ao adicionar mangá")
        }
      }

      router.push("/")
    } catch (error) {
      console.error("Erro ao salvar:", error)
      setError("Ocorreu um erro ao salvar. Tente novamente.")
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && <div className="bg-red-50 p-4 rounded-md text-red-500 mb-4">{error}</div>}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="One Piece" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="series"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Série/Editora</FormLabel>
              <FormControl>
                <Input placeholder="Shonen Jump / Panini" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentChapter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capítulo/Volume Atual</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="físico">Físico</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scanLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link da Scan (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/manga/one-piece" {...field} />
              </FormControl>
              <FormDescription>Deixe em branco para edições físicas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : manga ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
