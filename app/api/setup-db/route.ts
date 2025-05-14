import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Rota para inicializar o banco de dados
export async function GET() {
  try {
    // Verificar se a tabela já existe executando uma consulta simples
    try {
      await prisma.manga.findFirst()
      return NextResponse.json({ message: "Banco de dados já está configurado" })
    } catch (error) {
      // Se ocorrer um erro, provavelmente a tabela não existe
      // Vamos criar a tabela manualmente
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "mangas" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "series" TEXT NOT NULL,
          "currentChapter" INTEGER NOT NULL,
          "type" TEXT NOT NULL,
          "scanLink" TEXT,
          "lastReadAt" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "mangas_pkey" PRIMARY KEY ("id")
        );
      `

      return NextResponse.json({ message: "Banco de dados configurado com sucesso" })
    }
  } catch (error) {
    console.error("Erro ao configurar banco de dados:", error)
    return NextResponse.json({ error: "Erro ao configurar banco de dados" }, { status: 500 })
  }
}
