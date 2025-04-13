import { NextResponse } from "next/server";
import { todoListService } from "@/services/TodoListService";

/**
 * GET方法用于获取所有待办事项
 * @returns {Promise<NextResponse>} 包含所有待办事项的JSON响应
 */
export async function GET() {
  const todos = await todoListService.getTodos();
  return NextResponse.json(todos);
}

/**
 * POST方法用于创建新的待办事项
 * @param {Request} request - 请求体中包含待办事项的文本内容
 * @returns {Promise<NextResponse>} 返回创建的待办事项或错误信息的JSON响应
 */
export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text) {
    return NextResponse.json(
      { error: "Text is required" },
      { status: 400 }
    );
  }
  const todo = await todoListService.addTodo(text);
  return NextResponse.json(todo);
}

/**
 * PUT方法用于切换待办事项的完成状态
 * @param {Request} request - 请求体中包含待办事项的ID
 * @returns {Promise<NextResponse>} 返回更新后的待办事项或错误信息的JSON响应
 */
export async function PUT(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      { status: 400 }
    );
  }
  const todo = await todoListService.toggleTodo(id);
  if (!todo) {
    return NextResponse.json(
      { error: "Todo not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(todo);
}

/**
 * DELETE方法用于删除待办事项
 * @param {Request} request - 请求体中包含待办事项的ID
 * @returns {Promise<NextResponse>} 返回表示成功或错误的JSON响应
 */
export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      { status: 400 }
    );
  }
  const success = await todoListService.deleteTodo(id);
  if (!success) {
    return NextResponse.json(
      { error: "Todo not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true });
} 