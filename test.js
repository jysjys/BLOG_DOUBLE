const { PrismaClient } = require('./src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  try {
    // 创建一个新的 Todo
    const newTodo = await prisma.todo.create({
      data: {
        text: 'Test Todo',
        completed: false,
        createdAt: new Date(),
      },
    })
    console.log('Created todo:', newTodo)

    // 查询所有 Todo
    const todos = await prisma.todo.findMany()
    console.log('All todos:', todos)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 