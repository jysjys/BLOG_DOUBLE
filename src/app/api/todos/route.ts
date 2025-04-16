import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 只能用在 Node.js runtime
export const runtime = 'nodejs'

// GET /api/todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// POST /api/todos
export async function POST(req: NextRequest) {
  try {
    const { text, completed = false } = await req.json();
    
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    
    const todo = await prisma.todo.create({
      data: {
        text,
        completed,
        createdAt: new Date(),
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
} 