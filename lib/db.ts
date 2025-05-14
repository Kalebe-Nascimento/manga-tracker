import { MongoClient, type Db, type Collection } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Por favor, defina a variável de ambiente MONGODB_URI")
  }

  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()

  const db = client.db(process.env.MONGODB_DATABASE || "manga-tracker")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getCollection<T>(collectionName: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase()
  return db.collection<T>(collectionName)
}
