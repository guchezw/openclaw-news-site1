export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <title>OpenClaw 资讯站 - AI 助手框架最新动态</title>
        <meta name="description" content="OpenClaw AI 助手框架最新资讯、更新日志、社区动态" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
