import { NextResponse } from "next/server"
import { getMangaList, addManga } from "@/lib/manga-service"

export async function GET() {
  try {
    const mangas = await getMangaList()
    return NextResponse.json(mangas)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar mangás" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newManga = await addManga({
      title: data.title,
      series: data.series,
      currentChapter: data.currentChapter,
      type: data.type,
      scanLink: data.scanLink || null,
    })
    return NextResponse.json(newManga, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao adicionar mangá" }, { status: 500 })
  }
}
