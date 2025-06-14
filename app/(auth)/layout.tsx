export const metadata = {
  title: 'Benditta Pizza',
  description: 'Created by FsTools.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}
