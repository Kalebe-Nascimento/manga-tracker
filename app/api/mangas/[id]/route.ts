import { NextResponse } from "next/server"
import { getMangaById, updateManga, deleteManga } from "@/lib/manga-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const manga = await getMangaById(params.id)

    if (!manga) {
      return NextResponse.json({ error: "Mangá não encontrado" }, { status: 404 })
    }

    return NextResponse.json(manga)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar mangá" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const manga = await getMangaById(params.id)

    if (!manga) {
      return NextResponse.json({ error: "Mangá não encontrado" }, { status: 404 })
    }

    const updatedManga = await updateManga(params.id, {
      title: data.title,
      series: data.series,
      currentChapter: data.currentChapter,
      type: data.type,
      scanLink: data.scanLink || null,
      lastReadAt: data.lastReadAt ? new Date(data.lastReadAt) : manga.lastReadAt,
    })

    return NextResponse.json(updatedManga)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar mangá" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const manga = await getMangaById(params.id)

    if (!manga) {
      return NextResponse.json({ error: "Mangá não encontrado" }, { status: 404 })
    }

    await deleteManga(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir mangá" }, { status: 500 })
  }
}
