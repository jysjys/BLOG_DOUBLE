import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// In-memory storage for pets (replace with database in production)
let pets = [
  {
    id: 1,
    name: 'Black',
    age: 2,
    color: 'Black',
    breed: 'Domestic Shorthair',
    description: 'A sleek and mysterious black cat with piercing yellow eyes.',
    imageUrl: '/cat_black.jpg',
  },
  {
    id: 2,
    name: 'Huangmao',
    age: 3,
    color: 'Yellow',
    breed: 'Tabby',
    description: 'A cheerful yellow tabby with a warm personality.',
    imageUrl: '/cat_yellow.jpg',
  },
  {
    id: 3,
    name: 'Erya',
    age: 1.5,
    color: 'White',
    breed: 'Persian',
    description: 'A beautiful white cat with a gentle demeanor.',
    imageUrl: '/cat_white.jpg',
  }
]

export async function GET() {
  try {
    const pets = await prisma.pet.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(pets)
  } catch (error) {
    console.error('Error fetching pets:', error)
    return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newPet = await request.json()
    const pet = await prisma.pet.create({
      data: {
        name: newPet.name,
        age: newPet.age,
        color: newPet.color,
        breed: newPet.breed,
        description: newPet.description,
        imageUrl: newPet.imageUrl
      }
    })
    return NextResponse.json(pet)
  } catch (error) {
    console.error('Error creating pet:', error)
    return NextResponse.json({ error: 'Failed to create pet' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedPet = await request.json()
    const pet = await prisma.pet.update({
      where: {
        id: updatedPet.id
      },
      data: {
        name: updatedPet.name,
        age: updatedPet.age,
        color: updatedPet.color,
        breed: updatedPet.breed,
        description: updatedPet.description,
        imageUrl: updatedPet.imageUrl
      }
    })
    return NextResponse.json(pet)
  } catch (error) {
    console.error('Error updating pet:', error)
    return NextResponse.json({ error: 'Failed to update pet' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.pet.delete({
      where: {
        id: id
      }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pet:', error)
    return NextResponse.json({ error: 'Failed to delete pet' }, { status: 500 })
  }
} 