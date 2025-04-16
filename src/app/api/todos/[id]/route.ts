import { prisma } from '@/lib/prisma'

// 只能用在 Node.js runtime
export const runtime = 'nodejs'

// GET /api/todos/[id]
export async function GET(
  request: Request,
    context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const todoId = parseInt(id)
    if (isNaN(todoId)) {
      return Response.json(
        { error: 'Invalid ID format' }, 
        { status: 400 }
      )
    }

    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    })

    return todo 
      ? Response.json(todo)
      : Response.json(
          { error: 'Todo not found' }, 
          { status: 404 }
        )
  } catch (error) {
    console.error('[GET] Error:', error)
    return Response.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// PUT /api/todos/[id]
export async function PUT(
  request: Request,
    context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const todoId = parseInt(id)
    if (isNaN(todoId)) {
      return Response.json(
        { error: 'Invalid ID format' }, 
        { status: 400 }
      )
    }

    const { text, completed } = await request.json()
    const updated = await prisma.todo.update({
      where: { id: todoId },
      data: { text, completed },
    })

    return Response.json(updated)
  } catch (error) {
    console.error('[PUT] Error:', error)
    return Response.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// DELETE /api/todos/[id]
export async function DELETE(
  request: Request,
    context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const todoId = parseInt(id)
    if (isNaN(todoId)) {
      return Response.json(
        { error: 'Invalid ID format' }, 
        { status: 400 }
      )
    }

    await prisma.todo.delete({
      where: { id: todoId },
    })

    return Response.json(
      { success: true }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('[DELETE] Error:', error)
    return Response.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}