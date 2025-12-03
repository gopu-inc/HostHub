export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
