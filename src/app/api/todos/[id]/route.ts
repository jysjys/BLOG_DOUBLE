import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

interface DynamicRouteParams {
  params: { id: string }
}

// GET /api/todos/[id]
export async function GET(
  request: NextRequest,
  { params }: DynamicRouteParams
): Promise<NextResponse> {
  try {
    const todoId = parseInt(params.id)
    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' }, 
        { status: 400 }
      )
    }

    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    })

    return todo 
      ? NextResponse.json(todo)
      : NextResponse.json(
          { error: 'Todo not found' }, 
          { status: 404 }
        )
  } catch (error) {
    console.error('[GET] Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// PUT /api/todos/[id]
export async function PUT(
  request: NextRequest,
  { params }: DynamicRouteParams
): Promise<NextResponse> {
  try {
    const todoId = parseInt(params.id)
    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' }, 
        { status: 400 }
      )
    }

    const { text, completed } = await request.json()
    const updated = await prisma.todo.update({
      where: { id: todoId },
      data: { text, completed },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PUT] Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// DELETE /api/todos/[id]
export async function DELETE(
  request: NextRequest,
  { params }: DynamicRouteParams
): Promise<NextResponse> {
  try {
    const todoId = parseInt(params.id)
    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' }, 
        { status: 400 }
      )
    }

    await prisma.todo.delete({
      where: { id: todoId },
    })

    return NextResponse.json(
      { success: true }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('[DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}