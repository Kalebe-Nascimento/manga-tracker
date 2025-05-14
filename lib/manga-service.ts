import prisma from "./prisma"
import type { Manga } from "@prisma/client"

export type { Manga } from "@prisma/client"

// Função para obter a lista de mangás do banco de dados
export async function getMangaList(): Promise<Manga[]> {
  try {
    return await prisma.manga.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    })
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
    return []
  }
}

// Função para adicionar um novo mangá
export async function addManga(
  mangaData: Omit<Manga, "id" | "lastReadAt" | "createdAt" | "updatedAt">,
): Promise<Manga> {
  try {
    return await prisma.manga.create({
      data: mangaData,
    })
  } catch (error) {
    console.error("Erro ao adicionar mangá:", error)
    throw error
  }
}

// Função para obter um mangá pelo ID
export async function getMangaById(id: string): Promise<Manga | null> {
  try {
    return await prisma.manga.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error("Erro ao buscar mangá:", error)
    return null
  }
}

// Função para atualizar um mangá existente
export async function updateManga(id: string, data: Partial<Manga>): Promise<Manga> {
  try {
    return await prisma.manga.update({
      where: { id },
      data,
    })
  } catch (error) {
    console.error("Erro ao atualizar mangá:", error)
    throw error
  }
}

// Função para excluir um mangá
export async function deleteManga(id: string): Promise<void> {
  try {
    await prisma.manga.delete({
      where: { id },
    })
  } catch (error) {
    console.error("Erro ao excluir mangá:", error)
    throw error
  }
}
