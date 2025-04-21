import './globals.css'

// 使用系统默认字体代替Google Fonts，避免网络连接问题
const inter = { className: 'font-sans' }

export const metadata = {
  title: '宠物管理系统',
  description: '一个简单的宠物管理系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
