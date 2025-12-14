import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 })
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'L\'image est trop grande (max 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `event-${timestamp}-${randomString}.${extension}`

    // Créer le dossier uploads/events s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'events')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Sauvegarder le fichier
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Retourner l'URL de l'image
    const imageUrl = `/uploads/events/${filename}`

    return NextResponse.json({ url: imageUrl }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    )
  }
}

