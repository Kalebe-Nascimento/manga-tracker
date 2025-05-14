import MangaForm from "@/components/manga-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddMangaPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Mangá/Quadrinho</CardTitle>
        </CardHeader>
        <CardContent>
          <MangaForm />
        </CardContent>
      </Card>
    </div>
  )
}
